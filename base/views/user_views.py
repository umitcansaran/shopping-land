from django.contrib.auth import get_user_model
from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import CreateAPIView
from ..serializers import UserSerializer, RegistrationSerializer

User = get_user_model()

class RegistrationView(CreateAPIView):
    
    queryset = User.objects.all()
    permission_classes = []
    serializer_class = RegistrationSerializer

class UserViewSet(ModelViewSet):
    """
    GET: List users profiles. (-> request.user)
    DELETE: Remove user profile. (-> request.user)
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer

class MeViewSet(ModelViewSet):
    """
    GET: Get the user profile. (-> request.user)
    PATCH: Update the user profile. (-> request.user)
    """
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def get_object(self):
        self.check_permissions(self.request)
        return self.request.user


    
