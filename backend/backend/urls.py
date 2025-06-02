from django.contrib import admin
from django.urls import path
from digi_api.views import *

urlpatterns = [
    path("admin/", admin.site.urls),
    # path('users/', UserView.as_view(), name='user'),
    path('health/', HealthDataView.as_view(), name='health'),
    path('health-data/user/<int:user_id>/', UserHealthDataView.as_view(), name='user-health-data'),
    path('register/', RegisterUser.as_view(), name='register'),
    path('login/', LoginUser.as_view(), name='login'),
    path("calorie-estimate/", CalorieEstimationView.as_view(), name="calorie-estimate"),
    path("predict-calories/", PredictCaloriesView.as_view(), name="predict-calories"),
]
