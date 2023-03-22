from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsOwnerOrReadOnly(BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` attribute.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        else:
            return request.user.id == obj.owner.id


class IsAnon(BasePermission):
    """
    Checks if a user is not authenticated. Mainly used for registering and resetting pw.
    """
    message = 'You are already logged in'

    def has_permission(self, request, view):
        return request.user.is_anonymous
