from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, logout, authenticate
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
import json
from .models import User, Book
from django.urls import reverse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.core.exceptions import ValidationError
from datetime import datetime
import random
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
    if request.method == 'GET':
        return render(request, 'Add_Book.html')
    
    if request.method == 'POST':
        try:
            # Get form data
            book_id = request.POST.get('book_id')
            title = request.POST.get('title')
            author = request.POST.get('author')
            description = request.POST.get('description')
            category = request.POST.get('category')
            cover_image = request.FILES.get('cover_image')

            # Validate required fields
            if not all([book_id, title, author, description, category]):
                return JsonResponse({'success': False, 'message': 'All fields are required.'})
            
            # Check if book ID already exists
            if Book.objects.filter(id=book_id).exists():
                return JsonResponse({'success': False, 'message': f'Book with ID {book_id} already exists.'})
            
            # Generate unique ISBN
            isbn = str(random.randint(1000000000000, 9999999999999))
            while Book.objects.filter(isbn=isbn).exists():
                isbn = str(random.randint(1000000000000, 9999999999999))
            
            # Create new book with user-provided ID
            book = Book.objects.create(
                id=book_id,  # Use user-provided ID
                title=title,
                author=author,
                description=description,
                category=category,
                isbn=isbn,
                publication_year=datetime.now().year,
                publisher='Default Publisher'
            )

            # Handle cover image if provided
            if cover_image:
                book.cover_image = cover_image
                book.save()
            
            return JsonResponse({
                'success': True,
                'message': f'Book added successfully! Book ID: {book.id}',
                'book_id': book.id,
                'redirect_url': reverse('browse')
            })
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})

@login_required
def edit_book(request, book_id=None):
    if request.method == 'GET':
        # If book_id is provided in URL, use it
        if book_id:
            try:
                book = Book.objects.get(id=book_id)
                return render(request, 'Edit_Book.html', {'book': {
                    'id': book.id,
                    'title': book.title,
                    'author': book.author,
                    'description': book.description,
                    'isbn': book.isbn,
                    'publication_year': book.publication_year,
                    'publisher': book.publisher,
                    'category': book.category,
                    'cover_image': book.cover_image.url if book.cover_image else None
                }})
            except Book.DoesNotExist:
                messages.error(request, f'Book with ID {book_id} not found.')
                return render(request, 'Edit_Book.html')
        
        # If book_id is provided in GET parameters, redirect to the edit page
        book_id = request.GET.get('book_id')
        if book_id:
            try:
                # Convert book_id to integer
                book_id = int(book_id)
                book = Book.objects.get(id=book_id)
                return render(request, 'Edit_Book.html', {'book': {
                    'id': book.id,
                    'title': book.title,
                    'author': book.author,
                    'description': book.description,
                    'isbn': book.isbn,
                    'publication_year': book.publication_year,
                    'publisher': book.publisher,
                    'category': book.category,
                    'cover_image': book.cover_image.url if book.cover_image else None
                }})
            except (ValueError, Book.DoesNotExist):
                # Get all book IDs for debugging
                all_books = Book.objects.all().values_list('id', flat=True)
                messages.error(request, f'Book with ID {book_id} not found. Available book IDs: {list(all_books)}')
                return render(request, 'Edit_Book.html')
        
        # If no book_id is provided, show the search form
        return render(request, 'Edit_Book.html')
    
    if request.method == 'POST':
        try:
            # Get book_id from POST data
            book_id = request.POST.get('book_id')
            if not book_id:
                return JsonResponse({'success': False, 'message': 'Book ID is required.'})
            
            # Get the book
            book = Book.objects.get(id=book_id)
            
            # Get form data
            title = request.POST.get('title')
            author = request.POST.get('author')
            description = request.POST.get('description')
            category = request.POST.get('category')
            cover_image = request.FILES.get('cover_image')

            # Validate required fields
            if not all([title, author, description, category]):
                return JsonResponse({'success': False, 'message': 'Title, author, description, and category are required.'})
            
            # Update book
            book.title = title
            book.author = author
            book.description = description
            book.category = category
            
            # Handle cover image if provided
            if cover_image:
                book.cover_image = cover_image
            
            book.save()
            
            return JsonResponse({
                'success': True,
                'message': 'Book updated successfully! Redirecting...',
                'book_id': book.id,
                'redirect_url': reverse('browse')
            })
            
        except Book.DoesNotExist:
            return JsonResponse({'success': False, 'message': f'Book with ID {book_id} not found.'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})

def book_details(request, book_id):
    return render(request, 'Details.html', {'book_id': book_id})

@login_required
def change_password(request):
    return render(request, 'Change_Password.html')
