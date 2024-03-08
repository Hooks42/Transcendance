import os
import requests
from django.shortcuts import render, redirect
from .forms import AccountCreationForm, AccountLoginForm, RegularAccountUpdateForm, Auth42AccountUpdateForm
from django import forms
from django.contrib import messages
from django.contrib.auth import login, logout, update_session_auth_hash, authenticate
from django.contrib.auth.hashers import make_password
from .models import Message, User
from dotenv import load_dotenv
from django.http import HttpResponseRedirect
from urllib.parse import urlencode
from django.urls import reverse
from django.http import HttpResponse
from Transcendance.management.OAuth20.get_info_from_42 import register_user 



def AccountCreation(request):
    if request.method == 'POST':
        form = AccountCreationForm(request.POST)
        if form.is_valid():
            try:
                form.Create_User(request)
                return redirect('hello')
            except forms.ValidationError as e:
                error = e
                return render(request, "Account_creation.html", {"form" : form})
    else:
        form = AccountCreationForm()
    return render(request, "Account_creation.html", {"form" : form})

def AccountLogin(request):
    if request.method == 'POST':
        form = AccountLoginForm(request.POST)
        if form.is_valid():
            if form.Login(request):
                return redirect('hello')
    else:
        form = AccountLoginForm()
    return render(request, "Account_login.html", {"form" : form})

def Hello(request):
    return render(request, 'Hello.html')

def LoginPage(request):
    return render(request, 'Login_page.html')

def FailedLogin(request):
    return render(request, 'Failed_login.html')

def Logout(request):
    logout(request)
    return render(request, 'Logout.html')

def ChatView(request):
    message_backup = Message.objects.all()
    return render(request, "Chat_room.html", {'message': message_backup})

def redirect_to_provider(request):
    load_dotenv()
    base_url = "https://api.intra.42.fr/oauth/authorize"
    params = {
        "client_id": os.getenv("CLIENT_ID"),
        "redirect_uri": 'https://localhost:/callback',
        "response_type": "code",
    }
    auth_url = f"{base_url}?{urlencode(params)}"
    return HttpResponseRedirect(auth_url)

def callback_view(request):
    load_dotenv()
    code = request.GET.get("code")
    data = {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': 'https://localhost:/callback',
        'client_id': os.getenv("CLIENT_ID"),
        'client_secret': os.getenv("CLIENT_SECRET"),
    }
    response = requests.post('https://api.intra.42.fr/oauth/token', data=data)
    error = request.GET.get("error")
    response_data = response.json()
    if error or not 'access_token' in response_data:
        return HttpResponse(f"Failed to authenticate with 42: {error}\n{response_data}", status=400)
    else:
        access_token = response_data['access_token']
        user = register_user(access_token)
        login(request, user)
    return render(request, 'Hello.html', {"user": user})


def AccountUpdate(request):
    user = User.objects.get(username=request.user.username)
    if request.method == 'POST':
        if user.id_42:
            form = Auth42AccountUpdateForm(request.POST, request.FILES, instance=user)
        else:
            form = RegularAccountUpdateForm(request.POST, request.FILES, instance=user)
        if form.is_valid():
            username = form.cleaned_data.get('email')
            password = form.cleaned_data.get('new_password')
            form.save()
            if username:
                user = authenticate(username=username, password=password)
                if user is not None:
                    login(request, user)
            elif password:
                update_session_auth_hash(request, user)
            return redirect('hello')
    else:
        if user.id_42:
            form = Auth42AccountUpdateForm(initial={
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
                'avatar': ''
            }, instance=user)
        else:
            form = RegularAccountUpdateForm(initial={
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': "",
                'avatar': ""
            }, instance=user)
    return render(request, 'Update_account.html', {'form': form})