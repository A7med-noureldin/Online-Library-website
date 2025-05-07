from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, logout, authenticate
from django.contrib import messages

# Create your views here.
def home(request):
    return render(request, 'Home.html')

def browse(request):
    return render(request, 'Browse.html')

def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('home')
        else:
            messages.error(request, 'Invalid username or password')
    return render(request, 'Login.html')

def signup(request):
    if request.method == 'POST':
        # Handle signup logic here
        pass
    return render(request, 'Sign-Up.html')

@login_required
def profile(request):
    return render(request, 'Profile.html')

def logout_view(request):
    logout(request)
    return redirect('home')

def about(request):
    return render(request, 'About_Us.html')

@login_required
def add_book(request):
    return render(request, 'Add_Book.html')

@login_required
def edit_book(request, book_id):
    return render(request, 'Edit_Book.html', {'book_id': book_id})

def book_details(request, book_id):
    return render(request, 'Details.html', {'book_id': book_id})

@login_required
def change_password(request):
    return render(request, 'Change_Password.html')