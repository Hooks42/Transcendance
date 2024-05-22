import os
import requests
from django.shortcuts import render, redirect
from .forms import AccountCreationForm, AccountLoginForm, RegularAccountUpdateForm, Auth42AccountUpdateForm
from django import forms
from django.contrib import messages
from django.contrib.auth import login, logout, update_session_auth_hash, authenticate
from django.contrib.auth.hashers import make_password
from .models import Message, User, Conversation, GameStats, GameHistory
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
                print(f"✅ signup returned JsonResponse with success")
                return JsonResponse({'signup_status': 'success'})
            else:
                print(f"✅ signup returned JsonResponse with fail")
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
        
        elif form_type == 'edit':
            user = User.objects.get(username=request.user.username)
            if user.id_42:
                edit_form = Auth42AccountUpdateForm(request.POST, request.FILES, instance=user)
            else:
                edit_form = RegularAccountUpdateForm(request.POST, request.FILES, instance=user)
            if edit_form.is_valid():
                username = edit_form.cleaned_data.get('email')
                password = edit_form.cleaned_data.get('new_password')
                edit_form.save()
                if username:
                    user = authenticate(username=username, password=password)
                    if user is not None:
                        login(request, user)
                elif password:
                    update_session_auth_hash(request, user)
                return JsonResponse({'edit_status': 'success'})
            else:
                return JsonResponse({'edit_status': 'fail', 'errors': edit_form.errors})
            
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
    return redirect('Successfully_Connected_42')

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

def Successfully_Connected_42(request):
    return render(request, 'Successfully_Connected_42.html')

def get_user_infos(request):
    user_username = request.GET.get('username', None)
    if user_username is None or user_username == '' or user_username == "null":
        if (request.user.is_anonymous):
            return JsonResponse({'username': None})
        return JsonResponse({'username': request.user.username, 'profile_picture': request.user.avatar.url})
    else:
        try:
            user = User.objects.get(username=user_username)
            return JsonResponse({'username': user.username, 'profile_picture': user.avatar.url})
        except User.DoesNotExist:
            return JsonResponse({'username': None})

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
def get_block_list(request):
    try:
        user = User.objects.get(username=request.user.username)
        block_list = []
        for user in user.block_list:
            try:
                blocked_user = User.objects.get(username=user)
                block_list.append({
                    'username': blocked_user.username,
                    'profile_picture': blocked_user.avatar.url,
                    'is_online': blocked_user.is_online,
                })
            except User.DoesNotExist:
                pass
        return JsonResponse({'block_list': block_list})
    except User.DoesNotExist:
        return JsonResponse({'block_list': []})
            
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

@login_required
def UserProfile(request):
    is_42 = False;
    status = None
    user_username = request.GET.get('username', None)
    print(f"🔱 user_username --> {user_username}")
    if user_username is None or user_username == '' or user_username == "null":
        print(f"🔱 request.user.username --> {request.user.username}")
        user_username = request.user.username
        print(f"🔱 user_username --> {user_username}")
    try:
        user = User.objects.get(username=user_username)
    except User.DoesNotExist:
        print(f"🔱 user {user_username} User.DoesNotExist")
        return JsonResponse({'user_profile_html': None, 'status': 'fail'})
    
    is_42 = user.id_42
    print(f"🔱 is_42 --> {is_42}")
    
    try:
        user_stats = GameStats.objects.get(user=user)
        try:
            user_pfc_history_list = GameHistory.get_games_for_user(user)
            user_pfc_history = []
            for user_pfc_history_instance in user_pfc_history_list:
                current_player_username = None
                current_player_score = None
                current_player_penalties = None
                current_player_moves = None
                opponent_username = None
                opponent_score = None
                opponent_penalties = None
                opponent_moves = None
                victory = None
                if user.username == user_pfc_history_instance.player1.username:
                    current_player_username = user.username
                    current_player_score = user_pfc_history_instance.player1_score
                    current_player_penalties = user_pfc_history_instance.player1_penalties
                    current_player_moves = user_pfc_history_instance.player1_moves
                    opponent_username = user_pfc_history_instance.player2.username
                    opponent_score = user_pfc_history_instance.player2_score
                    opponent_penalties = user_pfc_history_instance.player2_penalties
                    opponent_moves = user_pfc_history_instance.player2_moves
                elif user.username == user_pfc_history_instance.player2.username:
                    current_player_username = user.username
                    current_player_score = user_pfc_history_instance.player2_score
                    current_player_penalties = user_pfc_history_instance.player2_penalties
                    current_player_moves = user_pfc_history_instance.player2_moves
                    opponent_username = user_pfc_history_instance.player1.username
                    opponent_score = user_pfc_history_instance.player1_score
                    opponent_penalties = user_pfc_history_instance.player1_penalties
                    opponent_moves = user_pfc_history_instance.player1_moves
                
                if current_player_score == 7 or opponent_penalties == 3:
                    victory = True
                elif opponent_score == 7 or current_player_penalties == 3:
                    victory = False
                
                user_pfc_history.append({
                    'game_id': user_pfc_history_instance.game_id,
                    'current_player_username': current_player_username,
                    'opponent_userame': opponent_username,
                    'round_count': user_pfc_history_instance.round_count,
                    'current_player_moves': current_player_moves,
                    'opponent_moves': opponent_moves,
                    'current_player_score': current_player_score,
                    'opponent_score': opponent_score,
                    'current_player_penalties': current_player_penalties,
                    'opponent_penalties': opponent_penalties,
                    'timestamp': user_pfc_history_instance.timestamp.strftime('%d-%m-%y %H:%M'),
                    'victory': victory,
                })
        except GameHistory.DoesNotExist:
            status = 'history error'
    except GameStats.DoesNotExist:
        status = 'No stats'
        
    initial = {
        'username': user.username,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'email': "",
    }
    
    initial_42 = {
        'username': user.username,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'email': user.email,
    }
    
    context = {
        'request': request,
        'regular_update_form': RegularAccountUpdateForm(initial=initial, instance=user),
        'auth42_update_form': Auth42AccountUpdateForm(initial=initial_42, instance=user),
        'username': user.username,
        'avatar': user.avatar.url,
    }
    
    if (is_42 is not None):
        context['is_42'] = True
    
    if status is None:
        context['total_pong_win'] = user_stats.total_pong_win
        context['total_pong_los'] = user_stats.total_pong_los
        context['total_pong_win_tie'] = user_stats.total_pong_win_tie
        context['total_pong_los_tie'] = user_stats.total_pong_los_tie
        
        context['total_scissors'] = user_stats.total_scissors
        context['total_paper'] = user_stats.total_paper
        context['total_rock'] = user_stats.total_rock
        context['total_spr_win'] = user_stats.total_spr_win
        context['total_spr_los'] = user_stats.total_spr_los
        context['total_spr_win_tie'] = user_stats.total_spr_win_tie
        context['total_spr_los_tie'] = user_stats.total_spr_los_tie
        
        if status != "history error":
            context['user_pfc_history'] = user_pfc_history
    
    user_profile_html = render_to_string('user_profile.html', context, request=request)
    return JsonResponse({'user_profile_html': user_profile_html, 'status': status})
            
    
@login_required
def Home(request):
    home_page_html = render_to_string('home.html', {'request': request}, request=request)
    return JsonResponse({'home_page_html': home_page_html})
        