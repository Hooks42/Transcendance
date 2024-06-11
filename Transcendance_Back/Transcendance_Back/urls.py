"""
URL configuration for Transcendance_Back project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path
from Transcendance.views import Hello, Logout, Home
from Transcendance.views import callback_view, AccountUpdate, Fullsite, LoginPage
from Transcendance.views import Successfully_Connected_42, get_conv_history
from Transcendance.views import get_friends_list, get_friends_request, get_user_lists
from Transcendance.views import get_user_infos, get_block_list, UserProfile, pfc_game, pong_mode_choice
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('login-page/', LoginPage, name='login-page'),
    path('user-profile/', UserProfile, name='user-profile'),
    path('hello/', Hello, name='hello'),
    path('logout/', Logout, name='logout'),
    path('callback/', callback_view, name='callback-view'),
    path('update-account/', AccountUpdate, name='update-account'),
    path('successfully-connected-42/', Successfully_Connected_42, name='Successfully_Connected_42'),
    path('get-user-infos/', get_user_infos, name='get-actual-user'),
    path('get-conv-history/', get_conv_history, name='get-conv-history'),
    path('get-friends-list/', get_friends_list, name='get-friends-list'),
    path('get-block-list/', get_block_list, name='get-block-list'),
    path('get-friends-request/', get_friends_request, name='get-friends-request'),
    path('get-user-lists/', get_user_lists, name='get-user-lists'),
    path('fullsite/', Fullsite, name='fullsite'),
    path('home/', Home, name='home'),
    path('profile/', Hello, name='profile'),
    path('pong/', Hello, name='pong'),
    path('pierre_feuille_ciseaux/', Hello, name='pierre_feuille_ciseaux'),
    path('pfc/', pfc_game, name='pfc'),
    path('pong-mode-choice/', pong_mode_choice, name='pong-mode-choice'),
    path('matchmaking/', Hello, name='matchmaking'),
    
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
