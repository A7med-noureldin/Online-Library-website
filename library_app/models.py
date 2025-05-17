from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    USER_ROLE_CHOICES = [
        ('user', 'User'),
        ('admin', 'Admin'),
    ]
    
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=USER_ROLE_CHOICES, default='user')
    
    def __str__(self):
        return self.username

class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=200)
    description = models.TextField()
    isbn = models.CharField(max_length=13, unique=True)
    publication_year = models.IntegerField()
    publisher = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    cover_image = models.ImageField(upload_to='book_covers/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    isBorrowed = models.BooleanField(default=False)
    borrowedBy =models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)
    def __str__(self):
        return self.title
