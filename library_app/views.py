from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, logout, authenticate
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
import json
from .models import User
from django.urls import reverse
from django.views.decorators.csrf import ensure_csrf_cookie
# Create your views here.
def home(request):
    return render(request, 'Home.html')

def browse(request):
    return render(request, 'Browse.html')

@ensure_csrf_cookie
def login_view(request):
    """View function for handling user login with AJAX support."""
    if request.method == 'GET':
        # Regular GET request - render the login page
        return render(request, 'Login.html')
    
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        
        # Check if this is an AJAX request
        is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'
        
        if user is not None:
            login(request, user)
            
            if is_ajax:
                return JsonResponse({
                    'success': True,
                    'message': f'Login successful as {user.role}!',
                    'redirect_url': reverse('home'),
                    'user_role': user.role
                })
            else:
                messages.success(request, f'Login successful as {user.role}!')
                return redirect('home')
        else:
            if is_ajax:
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid username or password'
                })
            else:
                messages.error(request, 'Invalid username or password')
                return render(request, 'Login.html')

@csrf_exempt
def signup(request):
    if request.method == 'GET':
        return render(request, 'Sign-Up.html')
    
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            confirm_password = data.get('confirmPassword')
            email = data.get('email')
            account_type = data.get('accountType')
            
            # Validation
            if not username or len(username) < 8:
                return JsonResponse({'success': False, 'message': 'Username must be at least 8 characters long.'})
            
            if not password or len(password) < 6:
                return JsonResponse({'success': False, 'message': 'Password must be at least 6 characters long.'})
                
            if password != confirm_password:
                return JsonResponse({'success': False, 'message': 'Passwords do not match.'})
            
            # Check if username or email already exists
            if User.objects.filter(username=username).exists():
                return JsonResponse({'success': False, 'message': 'Username already exists.'})
                
            if User.objects.filter(email=email).exists():
                return JsonResponse({'success': False, 'message': 'Email already exists.'})
            
            # Create new user
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                role=account_type
            )
            
            return JsonResponse({'success': True, 'message': f'Sign up successful as {account_type}!'})
        
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})

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