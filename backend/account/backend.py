# accounts/backends.py
from django.contrib.auth.backends import ModelBackend
from account.models import User

class EmailBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        print(f"[DEBUG] EmailBackend authenticate called with username={username} password={'***'} kwargs={kwargs}")
        email = kwargs.get('email') or username  # accept both
        if email is None or password is None:
            return None
        try:
            user = User.objects.get(email=email)
            if user.check_password(password):
                return user
        except User.DoesNotExist:
            return None
