---
title: "Export Data as an Excel Sheet in Laravel"
date: 2025-03-24
description: "Learn how to export data as an Excel sheet in Laravel using the Maatwebsite Excel package."
categories: [Laravel, PHP]
tags: [Laravel, Excel, Maatwebsite, Data Export]
meta:
  - name: "keywords"
    content: "Laravel Excel export, Maatwebsite Excel, Laravel data export, Laravel reporting"
  - name: "author"
    content: "Mohamed Thabet"
---

# Export Data as an Excel Sheet in Laravel

Exporting data to Excel is essential for many web applications that handle reporting, data analysis, or user downloads. In this comprehensive guide, you'll learn how to implement Excel exports in Laravel using the powerful Maatwebsite Excel package.

## Common Use Cases for Excel Exports

- **Administrative Reports**: Generate detailed reports for management dashboards
- **User Data Downloads**: Allow users to download their personal data
- **Data Migration**: Export data for transfer between systems
- **Batch Processing**: Prepare data for offline processing or analysis

## Step 1: Install the Package

To get started, install the package via Composer:

```bash
composer require maatwebsite/excel
```

- For Laravel versions before 11, you'll need to publish the configuration file:

```bash
php artisan vendor:publish --provider="Maatwebsite\Excel\ExcelServiceProvider" --tag=config
```

- In Laravel 11 and later, you don't need to publish the configuration file, as Laravel automatically handles this step.

## Step 2: Create an Export Class

Next, generate an export class for your data:

```bash
php artisan make:export UsersExport --model=User
```

## Step 3: Define Data in the Export Class

Modify the generated UsersExport.php file to define the data structure you want to export:
```php 
<?php

namespace App\Exports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class UsersExport implements FromCollection, WithHeadings
{
    public function collection()
    {
        return User::with('enrollments.course')->get()->map(function ($user) {
            $courses = $user->enrollments->map(fn($enrollment) => $enrollment->course->name)->join(', ');
            
            return [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'phone_number' => $user->phone_number,
                'courses' => $courses,
                'created_at' => $user->created_at->format('Y-m-d'),
                'updated_at' => $user->updated_at->format('Y-m-d')
            ];
        });
    }

    public function headings(): array
    {
        return [
            'الرقم التعريفي',
            'الاسم الأول',
            'الاسم الأخير',
            'رقم الهاتف',
            'الدورات المسجل فيها',
            'تاريخ الإنشاء',
            'تاريخ التحديث'
        ];
    }
}
```

### Why Use with('enrollments.course')?

Eager loading is used to optimize performance by reducing the number of database queries. Instead of retrieving each user's enrollments and their courses in separate queries, with('enrollments.course') loads all related data in a single query, making the export process significantly faster and more efficient.

## Step 4: Create a Controller Method

Now, define an export function inside your controller:

```php
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\UsersExport;

public function export()
{
    Excel::download(new UsersExport, 'users.xlsx');
    return back()->with('success', 'Users exported successfully!');
}
```

This method will export the Excel file and return a success message to the user.

## Step 5: Add a Route

Finally, register a route to trigger the export:

```php
use App\Http\Controllers\ExcelController;

Route::get('/export', [ExcelController::class, 'export']);
```
---

## Troubleshooting: Command "make:export" is not defined.

If you encounter this error, consider the following:

- Ensure the package is installed correctly.

- Check that you're using a compatible version (3.x or later). Run:

```bash
composer show maatwebsite/excel
```

- If you see a version conflict, update your package with:

```bash
composer require maatwebsite/excel:~3.1.64 --with-all-dependencies
```
if this error appear 
```bash
Problem 1
- Root composer.json requires maatwebsite/excel ~3.0 -> satisfiable by maatwebsite/excel[3.0.0, ..., 3.1.64].
- maatwebsite/excel 3.0.0 requires php ^7.1 -> your php version (8.2.12) does not satisfy that requirement.
- maatwebsite/excel[3.0.1, ..., 3.1.25] require php ^7.0 -> your php version (8.2.12) does not satisfy
```
then: 
 - ensure the GD extension is enabled in your php.ini file by removing the ; before the extension line.

-  install package again 