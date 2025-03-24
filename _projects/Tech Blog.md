---
layout: project
title: "Tech Blog"
date: 2024-10-20
image: /assets/projects/Tech blog.png
technologies: [Laravel, PHP, MVC, Bootstrap, MySQL]
github_link: https://github.com/MohamedThabt/Tech_Blog
# live_link: https://yourdemo.com/tech-blog
linkedin_post: https://www.linkedin.com/posts/mohamed--thabet_laravel-php-webdevelopment-activity-7251995135733882880-8xrL?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEiuH6EBSs9aBuQLFJk1C4nFPS8B1CoMYJs
---

# Tech Blog :Laravel  Project

## Project Overview

**Laravel Tech Blog** is a feature-rich blogging platform built with Laravel, implementing a complete content management system for tech-related articles. The application follows modern Laravel practices and includes robust user authentication, authorization, and CRUD operations.

## Key Features

### 🔐 Authentication System
- Complete Laravel authentication system with login, registration, and password reset functionality
- User roles (Admin and Writer) with separate permissions
- Middleware-based route protection

### 📝 Post Management
- Full CRUD operations for blog posts
- Image upload functionality with default fallback images
- Rich text content display
- Search functionality by post title
- Pagination for posts listing

### 👥 User Management (Admin Only)
- User creation, updating, and deletion
- Role assignment and management
- View posts by specific users

### 🔒 Authorization
- Gate-based permissions using Laravel's authorization system
- Role-specific content access
- Writer permissions to manage only their own posts
- Admin access to all content

### 🎨 Frontend
- Responsive design using Bootstrap 5
- Clean, modern UI with custom styling
- Optimized for mobile and desktop viewing

## Technical Implementation

### 🏗️ Models and Relationships
- User model with one-to-many relationship to Posts
- Post model with image handling and user association

### 🎮 Controllers
- Well-organized controllers following Laravel conventions
- `PostController` for post operations
- `UserController` for user management
- Auth controllers for authentication functionality

### 💾 Database
- Migration-based database schema
- SQLite database for easy development
- Seeders for populating test data

### 👁️ Views
- Blade templating with layouts and components
- Form validation with error handling
- Flash messaging for user feedback

### 🛣️ Route Organization
- Route grouping with middleware
- Named routes for clean URL generation
- Resource controllers for RESTful endpoints

## Architecture Highlights

- MVC architecture strictly followed
- Repository pattern for data access
- Service providers for dependency injection
- Gates for authorization logic
- Middleware for route protection

## Development Practices

- Validation rules for form inputs
- Error handling and user feedback
- Secure password management
- Protection against common vulnerabilities
- Clean code organization and commenting

## Technologies Used

- **Backend**: Laravel 11, PHP 8.2
- **Frontend**: Bootstrap 5, SASS, JavaScript
- **Database**: MySQL
- **Tools**: Composer, NPM, Vite
- **Version Control**: Git

> **Laravel Tech Blog** demonstrates my expertise in modern PHP framework development, emphasizing security, clean architecture, and user experience design.