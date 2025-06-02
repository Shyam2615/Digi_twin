from groq import Groq

key = "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"

def get_insights():
    prompt = f"""
    Based on the following health data:
    - Sleep Duration: 8 hours
    - Physical Activity Level: Moderate
    - Stress Level: Low
    - BMI Category: Normal
    - Heart Rate: 70 bpm
    - Daily Steps: 8000
    - Blood Pressure: 120/80
    
    Provide a brief health analysis, explain why the user's sleep cycle is good or poor, 
    and suggest improvements.
    """

    client = Groq(
        api_key = key
        )
    
    completion = client.chat.completions.create(
        model = "llama3-8b-8192",
        messages = [
            {
                "role": "system",
                "content": prompt
            }
        ],
        temperature = 1,
        top_p = 1
    )
    
    print(completion.choices[0].message.content)
    
get_insights()