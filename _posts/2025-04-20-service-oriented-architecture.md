---
title: "Service Oriented Architecture (SOA): Principles and Best Practices"
date: 2025-04-16
description: "A comprehensive guide to understanding Service Oriented Architecture, its principles, benefits, challenges, and implementation best practices."
categories: [Architecture, Software Design]
tags: [SOA, Microservices, Enterprise Architecture,Architecture , Integration]
---

### **Controller Responsibilities & Service Pattern**

---

In Laravel, **controllers** are responsible for handling **requests** and **responses**. However, to maintain clean and testable code, we should separate concerns:

- **Business logic** should be placed in a **service class**.
- **Data access** should be handled in a **repository** (if needed).

### **Why Use the Service Pattern?**

Using the **Service Pattern** provides the following benefits:

✅ **Code Maintainability** – Business logic is kept separate from controllers, making updates easier.

✅ **Reusability** – The same service logic can be used across multiple controllers or commands.

✅ **Testability** – Services can be unit-tested independently from the framework.

---

## **How to Implement the Service Pattern in Laravel**

### **1- Generate a Service Class**

Create a **UserService** class using the following command:

```bash
php artisan make:class Services/UserService
```

---

### **2- Define the Service Logic**

```php
namespace App\Services;

use App\Models\User;

class UserService {
    public function create(array $userData): User {
        $user = User::create($userData);
        $user->roles()->sync($userData['roles']);
        return $user;
    }

    public function update(array $userData, User $user): User {
        $user->update($userData);
        $user->roles()->sync($userData['roles']);
        return $user;
    }
}

```

### **📌 Notes:**

🔹 Services handle business logic, keeping controllers thin and clean.

🔹 We use `sync()` to update user roles efficiently.

🔹 Dependency injection is recommended to instantiate services.

---

### **3- Use the Service in a Controller**

There are three ways to inject a service into a controller:

1. **Instantiating Directly** (❌ Not Recommended – tight coupling)
2. **Method Injection** (✅ Preferred – flexible and explicit)
3. **Constructor Injection** (✅ Best for dependencies used across multiple methods)

### **Example: Using Method Injection**

```php
use App\Services\UserService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;

class UserController extends Controller {
    public function store(Request $request, UserService $userService) {
        $userService->create($request->validated());
        return redirect()->route('users.index');
    }

    public function update(Request $request, User $user, UserService $userService) {
        $userService->update($request->validated(), $user);
        return redirect()->route('users.index');
    }
}

```

### **Example: Using Constructor Injection**

```php
use App\Services\UserService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;

class UserController extends Controller {
    private UserService $userService;

    public function __construct(UserService $userService) {
        $this->userService = $userService;
    }

    public function store(Request $request) {
        $this->userService->create($request->validated());
        return redirect()->route('users.index');
    }

    public function update(Request $request, User $user) {
        $this->userService->update($request->validated(), $user);
        return redirect()->route('users.index');
    }
}

```

If your service class requires constructor parameters, bind it in a Service Provider:

```php
$this->app->bind(UserService::class, function () {
    return new UserService(*/* dependencies */*);
});
```

This ensures Laravel resolves the service correctly when injected.

### **📌 Notes:**

✅ **Constructor Injection** is ideal when a service is used in multiple methods within the controller.

✅ Laravel's service container automatically resolves the dependency when the controller is instantiated.

✅ This ensures the service is always available and reduces method parameters.

---

## Advanced approach (Kind of striction )

in service folder create two folders 
   - contract folder (that has interface that has all function that should be exist in service )
   - services folder (that has all service that implements interfaces in contract  folder )

```markdown
app/
└── Services/
    ├── Contracts/
    │   └── UserServiceInterface.php
    └── Services/
        └── UserService.php
```

### 1. Create the **Contract** Interface

**`app/Services/Contracts/UserServiceInterface.php`**

```php
php
CopyEdit
<?php

namespace App\Services\Contracts;

use App\Models\User;

interface UserServiceInterface
{
    public function create(array $data): User;
    public function update(User $user, array $data): bool;
    public function delete(User $user): bool;
}

```

### 2. Create the **Service** Class

**`app/Services/UserService.php`**

```php
php
CopyEdit
<?php

namespace App\Services;

use App\Models\User;
use App\Services\Contracts\UserServiceInterface;
use Illuminate\Support\Facades\Hash;

class UserService implements UserServiceInterface
{
    public function create(array $data): User
    {
        $data['password'] = Hash::make($data['password']);
        return User::create($data);
    }

    public function update(User $user, array $data): bool
    {
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }
        return $user->update($data);
    }

    public function delete(User $user): bool
    {
        return $user->delete();
    }
}

```

---

### 3. Bind Interface to Implementation in a Service Provider

**`AppServiceProvider.php`** or create a dedicated one.

```php
php
CopyEdit
use App\Services\Contracts\UserServiceInterface;
use App\Services\UserService;

public function register(): void
{
    $this->app->bind(UserServiceInterface::class, UserService::class);
}

```

### 4. Use the Service in a Controller

**`app/Http/Controllers/UserController.php`**

```php
php
CopyEdit
<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Services\Contracts\UserServiceInterface;

class UserController extends Controller
{
    protected UserServiceInterface $userService;

    public function __construct(UserServiceInterface $userService)
    {
        this->userService = $userService;
    }

    public function store(Request $request)
    {
        $user = $this->userService->create($request->all());
        return response()->json($user);
    }

    public function update(Request $request, User $user)
    {
        $this->userService->update($user, $request->all());
        return response()->json(['message' => 'User updated']);
    }

    public function destroy(User $user)
    {
        $this->userService->delete($user);
        return response()->json(['message' => 'User deleted']);
    }
}

```

