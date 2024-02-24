from django import forms
import random
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate

class AccountCreationForm(forms.ModelForm):
    username = forms.CharField(required=True, widget=forms.EmailInput(attrs={'autocomplete': 'off'}))
    password = forms.CharField(widget=forms.PasswordInput, required=True)
    confirm_password = forms.CharField(widget=forms.PasswordInput, required=True)
    email = forms.EmailField(required=True, widget=forms.EmailInput(attrs={'autocomplete': 'off'}))

    class Meta:
        model = User
        fields = ['username', 'password', 'confirm_password', 'email']

    def clean(self):
        cleaned_data = super().clean() # On appelle clean de la classe parente qui
        username = cleaned_data.get("username")
        password = cleaned_data.get("password")
        confirm_password = cleaned_data.get("confirm_password")
        email = cleaned_data.get("email")
        

        if password != confirm_password:
            raise forms.ValidationError(
                "Les mots de passe ne sont pas identique. Veuillez les saisir a nouveau ❌"
            )
        
        if len(password) < 6:
            raise forms.ValidationError(
                "Le mot de passe doit contenir 6 caracteres minimum ❌"
            )
        
        return cleaned_data

    def Create_User(self):
        username = self.cleaned_data.get('username')
        email = self.cleaned_data.get('email')
        password = self.cleaned_data.get('password')

        if not User.objects.filter(email=email).exists():
            user = User.objects.create_user(username=username, email=email, password=password)
            return user
        else:
            raise forms.ValidationError("Ce nom d'utilisateur existe déjà. ❌")

class AccountLoginForm(forms.Form):
    email = forms.EmailField(required=True, widget=forms.EmailInput(attrs={'autocomplete': 'off'}))
    password = forms.CharField(widget=forms.PasswordInput, required=True)

    class Meta:
        model = User
        fields = ['email', 'password']
    
    def clean(self):
        cleaned_data = super().clean()
        email = cleaned_data.get('email')
        password = cleaned_data.get('password')
        return cleaned_data
    
    def Login(self, request):
        email = self.cleaned_data.get('email')
        password = self.cleaned_data.get('password')
        print("✅ email = ", email)
        print("✅ pdw = ", password)
        user = authenticate(username=email, password=password)
        if user is not None:
            login(request, user)
        else:
            raise forms.ValidationError("Cet email ou mot de passe est incorrect ❌")