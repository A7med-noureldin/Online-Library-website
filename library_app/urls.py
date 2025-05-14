# library_app/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('Home.html', views.home, name='home'),
    path('Browse.html', views.browse, name='browse'),
    path('Login.html', views.login_view, name='login'),
    path('Sign-Up.html', views.signup, name='signup'),
    path('Profile.html', views.profile, name='profile'),
    path('logout.html', views.logout_view, name='logout'),
    path('About_Us.html', views.about, name='about'),
    path('Add_Book.html', views.add_book, name='add_book'),
    path('Edit_Book.html', views.edit_book, name='edit_book'),
    path('Edit_Book/<int:book_id>.html', views.edit_book, name='edit_book'),
    path('Details.html', views.book_details, name='book_details'),
    path('Change_Password.html', views.change_password, name='change_password'),
    path('api/books/', views.get_books, name='get_books'),
    # Add other URL patterns as needed
]
