from django.urls import path
from base.views import search_views as views


urlpatterns = [
    path('', views.Search.as_view())
]
