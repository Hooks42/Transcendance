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
from Transcendance.views import Hello, Logout
from Transcendance.views import ChatView, callback_view, AccountUpdate, get_actual_user, Fullsite, LoginPage
from Transcendance.views import PrivateChatView, PFC_view, UserInfo, Successfully_Connected_42, get_general_conv_history
from Transcendance.views import get_friends_list, get_friends_request
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('login-page/', LoginPage, name='login-page'),
    path('hello/', Hello, name='hello'),
    path('logout/', Logout, name='logout'),
    path('chatroom/', ChatView, name='chat-room'),
    path('callback/', callback_view, name='callback-view'),
    path('update-account/', AccountUpdate, name='update-account'),
    path('successfully-connected-42/', Successfully_Connected_42, name='Successfully_Connected_42'),
    path('get-actual-user/', get_actual_user, name='get-actual-user'),
    path('get-general-conv-history/', get_general_conv_history, name='get-general-conv-history'),
    path('get-friends-list/', get_friends_list, name='get-friends-list'),
    path('get-friends-request/', get_friends_request, name='get-friends-request'),
    path('fullsite/', Fullsite, name='fullsite'),
    re_path(r'^private_chat/(?P<room_name>[a-zA-Z0-9@.+_-]+_[a-zA-Z0-9@.+_-]+)/$', PrivateChatView, name='private-chat-room'),
    re_path(r'^pfc/(?P<room_name>[a-zA-Z0-9@.+_-]+_[a-zA-Z0-9@.+_-]+)/$', PFC_view, name='pfc'),
    re_path(r'^user_info/(?P<username>[a-zA-Z0-9@.+_-]+)/$', UserInfo, name='user-info'),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
