import os
import requests
from django.shortcuts import render, redirect
from .forms import AccountCreationForm, AccountLoginForm, RegularAccountUpdateForm, Auth42AccountUpdateForm
from django import forms
from django.contrib import messages
from django.contrib.auth import login, logout, update_session_auth_hash, authenticate
from django.contrib.auth.hashers import make_password
from .models import Message, User, Conversation
from dotenv import load_dotenv
from django.http import HttpResponseRedirect, JsonResponse, HttpResponse
from urllib.parse import urlencode
from django.urls import reverse
from django.http import HttpResponse
from Transcendance.management.OAuth20.get_info_from_42 import register_user 
from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string
from django.contrib.auth.decorators import login_required
import json

def Profile(request):
    return render(request, 'profile.html')

def Home(request):
    return render(request, 'home.html')

def Hello(request):
    signup_form = AccountCreationForm()
    signin_form = AccountLoginForm()
    
    if request.method == 'POST':
        form_type = request.POST.get('form_type')
        print(f"🔱 form_type --> {form_type}")
        
        if form_type == 'signup':
            signup_form = AccountCreationForm(request.POST)
        
            if signup_form.is_valid():
                signup_form.Create_User(request)
                print(f"✅ signup returned JsonResponse")
                return JsonResponse({'signup_status': 'success'})
            else:
                print(f"✅ signup returned JsonResponse")
                return JsonResponse({'signup_status': 'fail', 'errors': signup_form.errors})
        
        elif form_type == 'signin':
            signin_form = AccountLoginForm(request.POST)
            if signin_form.is_valid():
                email = signin_form.cleaned_data.get('email')
                if signin_form.Login(request):
                    print(f"✅ signin returned JsonResponse")
                    return JsonResponse({'signin_status': 'success'})
                else:
                    print(f"✅ signin returned JsonResponse")
                    return JsonResponse({'signin_status': 'fail', 'errors': signin_form.errors})
            else:
                print(f"✅ signin returned JsonResponse")
                return JsonResponse({'signin_status': 'fail', 'errors': signin_form.errors})
    print(f"✅ servor returned HTPP_RESPONSE")
    return render(request, 'main.html', {'signup_form': signup_form, 'signin_form': signin_form})

def LoginPage(request):
    context = {
        'request': request,
        'signup_form': AccountCreationForm(),
        'signin_form': AccountLoginForm(),
        }
    login_page_html = render_to_string('login_page.html', context, request=request)
    return JsonResponse({'login_page_html': login_page_html})

@login_required
def Logout(request):
    user = User.objects.get(username=request.user.username)
    try:
        logout(request)
        user.is_online = False
        user.save()
        return JsonResponse({'logout_status': 'success'})
    except Exception as e:
        return JsonResponse({'logout_status': 'fail', 'errors': str(e)})

def ChatView(request):
    if Conversation.objects.all().count() == 0:
        conversation = Conversation(conversation="General")
        conversation.save()
    try:
        conversation = Conversation.objects.get(conversation="General")
        message_backup = conversation.messages.all().order_by('timestamp')
    except Conversation.DoesNotExist:
        message_backup = None
    return render(request, "Chat_room.html", {'message': message_backup})

def PrivateChatView(request, room_name):
    Sortroom_name = room_name.split('_')
    Sortroom_name.sort()
    room_name = "_".join(Sortroom_name)
    if Conversation.objects.filter(conversation=room_name).count() == 0:
        conversation = Conversation(conversation=room_name)
        conversation.save()
    try:
        conversation = Conversation.objects.get(conversation=room_name)
        message_backup = conversation.messages.all().order_by('timestamp')
    except Conversation.DoesNotExist:
        message_backup = None

    usernames = room_name.split('_')
    if request.user.username not in usernames:
        return redirect('hello')
    return render(request, "Private_chatroom.html", {'message': message_backup})

def callback_view(request):
    load_dotenv()
    code = request.GET.get("code")
    data = {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': 'https://localhost/callback',
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
    return render(request, 'successfully_connected_42.html')

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
            }, instance=user)
        else:
            form = RegularAccountUpdateForm(initial={
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': ""
            }, instance=user)
    return render(request, 'Update_account.html', {'form': form})

def PFC_view(request, room_name):
    users = room_name.split('_')
    if request.user.username not in users:
        return redirect('hello')
    return render(request, 'PFC.html')

def UserInfo(request, username):
    user = get_object_or_404(User, username=username)
    return render(request, 'User_info.html')

def Successfully_Connected_42(request):
    return render(request, 'Successfully_Connected_42.html')

def get_actual_user(request):
    if (request.user.is_anonymous):
        return JsonResponse({'username': None})
    return JsonResponse({'username': request.user.username})

@login_required
def get_general_conv_history(request):
    try:
        conversation = Conversation.objects.get(conversation="General")
        message_backup = conversation.messages.all().order_by('timestamp')
    except Conversation.DoesNotExist:
        message_backup = None
        return JsonResponse({'messages': []})
    
    message_list = []
    for message in message_backup:
        profile_picture = message.user.avatar.url
        print(f"🔱 profile_picture --> {profile_picture}")
        message_list.append({
            'username': message.user.username,
            'timestamp': message.timestamp.strftime('%d-%m-%y %H:%M'),
            'content': message.content,
            'profile_picture': profile_picture,
        })
    return JsonResponse({'messages': message_list})

@login_required
def get_friends_list(request):
    try:
        user = User.objects.get(username=request.user.username)
        friends = user.friends.all()
        friend_list = []
        for friend in friends:
            friend_list.append({
                'username': friend.username,
                'profile_picture': friend.avatar.url,
                'is_online': friend.is_online,
            })
        return JsonResponse({'friends': friend_list})
    except User.DoesNotExist:
        return JsonResponse({'friends': []})

@login_required
def get_friends_request(request):
    try:
        user = User.objects.get(username=request.user.username)
        friends_request = list(user.friend_request)
        return JsonResponse({'friends_request': friends_request})
    except User.DoesNotExist:
        return JsonResponse({'friends_request': []})

@login_required
def get_user_lists(request):
    try:
        user = User.objects.get(username=request.user.username)
        friend_list = []
        block_list = []
        if user.friends is not None:
            friend_list = [friend.username for friend in user.friends.all()]
        if user.block_list is not None:
            block_list = list(user.block_list) 
        return JsonResponse({'friend_list': friend_list, 'block_list': block_list})
    except User.DoesNotExist:
        return JsonResponse({'friend_list': [], 'block_list': []})      

def Fullsite(request):
    return render(request, 'Fullsite.html')