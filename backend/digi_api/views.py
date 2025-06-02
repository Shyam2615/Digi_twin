from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import *
from .serializers import *
from django.contrib.auth import authenticate ,get_user_model, login
import pickle
import numpy as np # type: ignore
from django.core import serializers
from openai import OpenAI
from django.conf import settings
from groq import Groq
import base64
import cloudinary
import cloudinary.uploader
import json
from django.http import JsonResponse
from dotenv import load_dotenv
import os

load_dotenv()


    
# with open('health_model.pkl', 'rb') as f:
#     model = pickle.load(f)

cloudinary.config(
    cloud_name="dou2gktzi",
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

class PredictCaloriesView(APIView):
    def post(self, request):
        try:
            # Use request.data instead of json.loads(request.body)
            total_calories = request.data.get("total_calories", 0)

            # Debugging: Print received data
            print("Received total_calories:", total_calories)
            print("Request data:", request.data)

        except Exception as e:
            return Response({'error': str(e)}, status=400)

        if not total_calories:
            return JsonResponse({"error": "Total calories is required"}, status=400)
        
        prompt = f"""
        Based on a daily intake of {total_calories} calories, analyze the potential health impact.
        Consider metabolism, activity levels, and general health effects.
        Provide insights on whether this intake is too high or too low and suggest improvements.
        Format the response with:
        - **Bold headings** for different sections.
        - Use double new lines for spacing between sections.
        """

        # Groq API key
        key = os.getenv("GROQ_API_KEY")

        client = Groq(api_key=key)

        try:
            completion = client.chat.completions.create(
                model="llama3-8b-8192",
                messages=[{"role": "user", "content": prompt}],
                temperature=1,
                top_p=1
            )

            prediction = completion.choices[0].message.content

            return JsonResponse({"prediction": prediction}, status=200)
            
        except Exception as e:
            return Response({'error': str(e)}, status=500)
            
        # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CalorieEstimationView(APIView):
    def post(self, request):
        image_url = request.data.get("image_url")
        if not image_url:
            return Response({"error": "Image URL is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": """Analyze the food in this image and estimate its calorie content.### **STRICT OUTPUT FORMAT:**  
        - Food Item: [Food Name] - [Calories] kcal  
        ...  
        - **Total Calories: [Total] kcal**  
         """},
                            {"type": "image_url", "image_url": {"url": image_url}},
                        ],
                    }
                ],
                max_tokens=300,
            )

            result = response.choices[0].message.content
            return Response({"calorie_estimate": result}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class HealthDataView(APIView):
   def post(self, request):
        user_id = request.data.get("user")

        if not user_id:
            return Response({"error": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(id=user_id)  # ✅ Convert user_id to a CustomUser instance
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Prepare health data dictionary (exclude 'user' from request.data)
        health_data_fields = {key: value for key, value in request.data.items() if key != "user"}

        # ✅ Update or create health data entry for the user
        health_data, created = HealthData.objects.update_or_create(
            user=user,  # ✅ Assign the actual CustomUser instance
            defaults=health_data_fields
        )

        serializer = HealthDataSerializer(health_data)

        # Generate prompt for LLM
        prompt = f"""
        Based on the following health data:
        - Sleep Duration: {health_data.sleep_duration} hours
        - Physical Activity Level: {health_data.physical_activity_level}
        - Stress Level: {health_data.stress_level}
        - BMI Category: {health_data.bmi_category}
        - Heart Rate: {health_data.heart_rate} bpm
        - Daily Steps: {health_data.daily_steps}
        - Blood Pressure: {health_data.systolic}/{health_data.diastolic}

        Provide a brief health analysis, explain why the user's sleep cycle is good or poor, 
        and suggest improvements.
        """

        # Groq API key
        key = os.getenv("GROQ_API_KEY")
        client = Groq(api_key=key)

        try:
            completion = client.chat.completions.create(
                model="llama3-8b-8192",
                messages=[{"role": "user", "content": prompt}],
                temperature=1,
                top_p=1
            )

            insights = completion.choices[0].message.content

            return Response({
                "message": "Health data updated successfully" if not created else "Health data created successfully",
                "health_data": serializer.data,
                "prediction": insights,
            }, status=status.HTTP_200_OK if not created else status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class UserHealthDataView(APIView):
    def get(self, request, user_id):
        try:
            health_data = HealthData.objects.filter(user_id=user_id)
            serializer = HealthDataSerializer(health_data, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except HealthData.DoesNotExist:
            return Response({"error": "Health data not found"}, status=status.HTTP_404_NOT_FOUND)
        
class RegisterUser(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'status': True, 'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
        return Response({'status': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
class LoginUser(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            # Get the authenticated user from the serializer's validated_data
            user = serializer.validated_data
            health_data = HealthData.objects.filter(user=user.id).first()
            health_data_json = HealthDataSerializer(health_data).data if health_data else None
            print(health_data_json)
            return Response({'status': True, 
                            'message': 'Login successful', 
                            'username' : user.username,
                            'user' : user.id,
                            'gender' : user.gender,
                            'health_data' : health_data_json
                            }, status=status.HTTP_200_OK)
        return Response({'status': False, 'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    
