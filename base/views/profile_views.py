from django.contrib.auth import get_user_model
from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import ListAPIView
from ..models import Profile
from ..serializers import ProfileSerializer


class ProfileViewSet(ModelViewSet):
    """
    CRUD operations on the profile model
    """
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

    def perform_create(self, serializer):
        serializer.save()

class ListSellerProfiles(ListAPIView):
    """
    List all the seller profiles
    """
    serializer_class = ProfileSerializer

    def get_queryset(self):
        queryset = Profile.objects.all()
        queryset = queryset.filter(status='STORE_OWNER')
        return queryset
    
class LatestSellers(ListAPIView):
    """
    GET: Get most recently added five reviews. 
    """ 
    queryset = Profile.objects.filter(status='STORE_OWNER').order_by('-id')[:5]
    serializer_class = ProfileSerializer

    
class ListProfileByUser(ListAPIView):
    """
    List the profile of a user (int: user_id)
    """
    serializer_class = ProfileSerializer

    def get_queryset(self):
        queryset = Profile.objects.all()
        user = self.kwargs.get('user_id')
        queryset = queryset.filter(user=user)
        return queryset