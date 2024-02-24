from django.shortcuts import render, redirect
from .forms import AccountCreationForm, AccountLoginForm
from django import forms
from django.contrib import messages
from django.contrib.auth import login, logout
from django.contrib.auth.hashers import make_password
from .models import Message


def AccountCreation(request):
    if request.method == 'POST':
        form = AccountCreationForm(request.POST)
        if form.is_valid():
            try:
                form.Create_User()
                return render(request, 'Hello.html', {"form" : form})
            except forms.ValidationError as e:
                error = e
                return render(request, "Account_creation.html", {"form" : form, "error" : error})
    else:
        form = AccountCreationForm()
    return render(request, "Account_creation.html", {"form" : form})

def AccountLogin(request):
    if request.method == 'POST':
        form = AccountLoginForm(request.POST)
        if form.is_valid():
            try:
                form.Login(request)
                return render(request, "Login_page.html", {"form" : form})
            except forms.ValidationError as e:
                error = e
                return render(request, "Failed_login.html", {"form" : form, "error" : error})
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
