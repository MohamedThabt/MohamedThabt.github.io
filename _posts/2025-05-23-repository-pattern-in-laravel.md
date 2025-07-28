---
title: "What is the Repository Pattern in Laravel"
date: 2025-05-23
description: "Explore the Repository Pattern in Laravel - a design pattern that abstracts the data layer, making your code more testable, flexible, and maintainable."
categories: [Laravel, Software Design]
tags: [Laravel, Architecture, Best Practices]
meta:
  - name: "keywords"
    content: "Repository Pattern, Laravel, Design Patterns, SOLID principles, Dependency Injection, Data Layer Abstraction"
  - name: "author"
    content: "Mohamed Thabet"
---

# What is the Repository Pattern in Laravel

The **Repository Pattern** in Laravel is a design pattern used to **abstract the data layer**, allowing you to decouple your application from the persistence layer (e.g., Eloquent ORM, Query Builder, or an external API). It acts as a **mediator between your controllers and your models**, making your code more **testable**, **flexible**, and **maintainable**.

# Why Use the Repository Pattern?

1. **Swappable data sources** – Easily switch from Eloquent to an external API or another database layer.
2. **Better unit testing** – Mocks can be injected into the repository interface.
3. **Cleaner, more organized code**

# **When to Use the Repository Pattern**

- Repetitive queries across controllers:
    
    Centralizes queries so you write once, reuse everywhere.
    
- **Unit testing needed:**
    
    Allows easy mocking/stubbing of data access logic.
    
- **Switching data sources:**
    
    You can change from Eloquent to API/Redis without touching controller code.
    
- **Large-scale applications:**
    
    Helps organize codebase using SOLID and DDD principles.
    

# **When Not to Use It**

- Simple CRUD apps
- **No testing needs**
- Prototype or MVP

> Use the repository pattern **when you find yourself repeating queries, writing complex logic in controllers, or planning for growth/testing.**
> 

# Common Use Cases

- **E-commerce systems** – complex product, cart, and order logic.
- **Learning management systems (LMS)** – many relationships between students, courses, quizzes, etc.
- **APIs** – where you want clear separation between the API logic and the DB access.
- **Microservices** – to isolate data layer behind contracts (interfaces).

---

# EXAMPLE

### 1. **Create an Interface**

```php
// app/Repositories/PostRepositoryInterface.php

namespace App\Repositories;

interface PostRepositoryInterface
{
    public function all();
    public function find($id);
    public function create(array $data);
    public function update($id, array $data);
    public function delete($id);
}
```

---

### 2. **Create the Repository Implementation**

```php
// app/Repositories/PostRepository.php

namespace App\Repositories;

use App\Models\Post;

class PostRepository implements PostRepositoryInterface
{
    public function all()
    {
        return Post::all();
    }

    public function find($id)
    {
        return Post::findOrFail($id);
    }

    public function create(array $data)
    {
        return Post::create($data);
    }

    public function update($id, array $data)
    {
        $post = Post::findOrFail($id);
        $post->update($data);
        return $post;
    }

    public function delete($id)
    {
        $post = Post::findOrFail($id);
        return $post->delete();
    }
}
```

---

### 3. **Bind the Interface to the Implementation**

In `App\Providers\AppServiceProvider` or a custom service provider:

```php
use App\Repositories\PostRepository;
use App\Repositories\PostRepositoryInterface;

public function register()
{
    $this->app->bind(PostRepositoryInterface::class, PostRepository::class);
}
```

---

### 4. **Use It in a Controller**

```php
use App\Repositories\PostRepositoryInterface;

class PostController extends Controller
{
    protected $postRepo;

    public function __construct(PostRepositoryInterface $postRepo)
    {
        $this->postRepo = $postRepo;
    }

    public function index()
    {
        $posts = $this->postRepo->all();
        return view('posts.index', compact('posts'));
    }
}
```

---

### ✅ Benefits in Practice

- Helps with **unit testing** (you can mock `PostRepositoryInterface`).
- Makes your code follow **SOLID principles** (especially the Dependency Inversion Principle).
- Makes it easier to **refactor** your data source later.
