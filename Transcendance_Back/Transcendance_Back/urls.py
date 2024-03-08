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
from django.urls import path
from Transcendance.views import Hello, AccountCreation, AccountLogin, LoginPage, FailedLogin,Logout, ChatView, redirect_to_provider, callback_view, AccountUpdate
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    path('admin/', admin.site.urls),
    path('hello/', Hello, name='hello'),
    path('signin/', AccountCreation, name='signin'),
    path('login/', AccountLogin, name='login'),
    path('login-page/', LoginPage, name='login-page'),
    path('failed-login/', FailedLogin, name='failed-login'),
    path('logout/', Logout, name='logout'),
    path('chatroom/', ChatView, name='chat-room'),
    path('oauth/', redirect_to_provider, name='redirect-to-provider'),
    path('callback/', callback_view, name='callback-view'),
    path('update-account/', AccountUpdate, name='update-account'),

]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
