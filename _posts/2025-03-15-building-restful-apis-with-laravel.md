---
title: "Building RESTful APIs with Laravel"
date: 2025-03-15
categories: [Development, Backend]
tags: [laravel, php, api, rest, backend]
---

# Building RESTful APIs with Laravel

Laravel offers a powerful and elegant way to build RESTful APIs. In this post, I'll walk through the essential steps to create a robust API using Laravel's built-in features.

## Setting Up the Project

First, let's create a new Laravel project using Composer:

```bash
composer create-project laravel/laravel api-project
cd api-project
```

## Creating a Resource Controller

Laravel's resource controllers make it easy to build RESTful APIs. Let's create one for a `Product` model:

```bash
php artisan make:controller ProductController --resource --model=Product
```

This generates a controller with methods for index, store, show, update, and destroy operations.

## Defining Routes

In `routes/api.php`, define your API routes:

```php
use App\Http\Controllers\ProductController;

Route::middleware('api')->group(function () {
    Route::apiResource('products', ProductController::class);
});
```

## Implementing the Controller

Here's how to implement a basic CRUD controller:

```php
namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        return Product::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric',
        ]);

        $product = Product::create($validated);
        
        return response()->json($product, 201);
    }

    public function show(Product $product)
    {
        return $product;
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'description' => 'string',
            'price' => 'numeric',
        ]);

        $product->update($validated);
        
        return response()->json($product);
    }

    public function destroy(Product $product)
    {
        $product->delete();
        
        return response()->json(null, 204);
    }
}
```

## API Resources for Data Transformation

For more control over your JSON responses, use API Resources:

```bash
php artisan make:resource ProductResource
```

Then implement the resource:

```php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'price' => $this->price,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
```

Update your controller to use the resource:

```php
public function index()
{
    return ProductResource::collection(Product::all());
}

public function show(Product $product)
{
    return new ProductResource($product);
}
```

## Authentication with Sanctum

Laravel Sanctum provides a lightweight authentication system for SPAs and APIs:

```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

To protect routes, add the sanctum middleware:

```php
Route::middleware(['auth:sanctum'])->group(function () {
    Route::apiResource('products', ProductController::class);
});
```

## Conclusion

Laravel makes building RESTful APIs straightforward with its expressive syntax and powerful features. By following these patterns, you can create robust, secure, and well-structured APIs that follow REST principles.

For larger applications, consider implementing more advanced features like API versioning, rate limiting, and comprehensive documentation with tools like Swagger.