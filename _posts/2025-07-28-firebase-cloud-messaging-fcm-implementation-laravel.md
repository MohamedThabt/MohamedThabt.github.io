---
title: "Firebase Cloud Messaging (FCM) Implementation in Laravel - Complete Guide"
date: 2025-07-28
description: "A comprehensive guide to implementing Firebase Cloud Messaging (FCM) push notifications in Laravel applications with best practices, security considerations, and multi-device support."
categories: [Laravel, Firebase]
tags: [Laravel, FCM, Push Notifications, Firebase, Mobile Development, API]
meta:
  - name: "keywords"
    content: "Firebase Cloud Messaging, FCM Laravel, push notifications, Firebase notifications, Laravel notifications, mobile notifications"
  - name: "author"
    content: "Mohamed Thabet"
---

Firebase Cloud Messaging (FCM) is a powerful service that allows you to send push notifications to mobile and web applications. In this comprehensive guide, we'll walk through implementing FCM in Laravel applications with best practices for security, scalability, and multi-device support.

## 📚 Overview

This guide provides a complete walkthrough for implementing Firebase Cloud Messaging (FCM) push notifications in Laravel applications, including practical examples, best practices, and detailed explanations of why each step is necessary.

## 🎯 Learning Objectives

By the end of this guide, you will understand:

- How to set up Firebase project for FCM
- Why and how to integrate FCM with Laravel
- Best practices for token management
- Security considerations and implementation patterns
- How to handle multiple devices per user

## 📖 Essential Resources

### Official Documentation

- [Laravel FCM Notification Channel](https://laravel-notification-channels.com/fcm/#contents)
- [Firebase Console](https://console.firebase.google.com/)

### Video Tutorials

- [Laravel FCM Implementation Tutorial](https://youtu.be/W9a3BWqnwhY?si=015F16SmXwl33kPK)
- [Firebase Setup Guide](https://youtu.be/8KE7W6Ome1w?si=kSwhph-aLpzFRvUZ)

## 🏗️ Step-by-Step Implementation

### Step 1: Firebase Project Setup

#### What to do:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Cloud Messaging API
4. Generate service account credentials
5. Download the JSON credentials file

#### Why this step is necessary:

- **Service Account**: Firebase requires authenticated access to send messages
- **Credentials File**: Contains private keys and project configuration needed for server-to-server communication
- **Cloud Messaging API**: Must be enabled to send push notifications

```json
// Example credentials file structure
{
    "type": "service_account",
    "project_id": "your-project-id",
    "private_key_id": "key-id",
    "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com",
    "client_id": "123456789",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token"
}
```

### Step 2: Laravel Package Installation

#### What to do:

```bash
# Install the FCM notification channel
composer require laravel-notification-channels/fcm

# Install Laravel Firebase (dependency)
composer require kreait/laravel-firebase
```

#### Why these packages:

- **laravel-notification-channels/fcm**: Provides seamless integration with Laravel's notification system
- **kreait/laravel-firebase**: Official PHP SDK for Firebase, handles authentication and API calls
- **Integration Benefit**: Works with Laravel's existing notification infrastructure (database, mail, etc.)

### Step 3: Credentials Storage

#### What to do:

```bash
# Place credentials file in storage folder
storage/app/firebase-credentials.json
```

#### 🔐 Why store in `storage/` folder (NOT `public/`):

**Security Reasons:**

- **Private Access**: `storage/` folder is NOT web-accessible, preventing direct URL access
- **Sensitive Data**: Credentials contain private keys that could compromise your Firebase project
- **Laravel Best Practice**: Laravel's `storage/` is designed for sensitive files

**What happens if stored in `public/`:**

```bash
# ❌ DANGEROUS - Anyone could access:
https://yoursite.com/firebase-credentials.json
```

**Correct approach:**

```php
// .env file
FIREBASE_CREDENTIALS=storage/app/firebase-credentials.json

// This path is only accessible by your Laravel application
```

### Step 4: Database Design - FCM Tokens Table

#### What to do:

```php
// Migration: create_fcm_tokens_table.php
Schema::create('fcm_tokens', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->text('fcm_token');
    $table->string('platform'); // android, ios
    $table->string('device_name');
    $table->timestamps();

    $table->index(['user_id']);
    // NO unique constraint on user_id + fcm_token
});
```

#### 📱 Why separate table (NOT just a column in users table):

**Multi-Device Support:**

```php
// ❌ Single column approach - WRONG
users table:
- id
- name
- email
- fcm_token  // Only ONE device supported

// ✅ Separate table approach - CORRECT
fcm_tokens table:
- id
- user_id
- fcm_token
- platform
- device_name

// One user can have multiple tokens
User ID 1: iPhone 13 Pro, iPad, Android Tablet
User ID 2: Samsung Galaxy, Work Phone
```

**Real-world scenarios:**

- User logs in from phone and tablet
- User switches devices
- User has work and personal devices
- Family members sharing account

**Code example:**

```php
// User can receive notifications on ALL devices
$user = User::find(1);
$user->fcmTokens; // Returns collection of all device tokens

// Send notification to all user's devices
$user->notify(new ProjectAccepted($project));
```

### Step 5: Model Implementation

#### FCM Token Model

```php
// app/Models/FcmToken.php
class FcmToken extends Model
{
    protected $fillable = [
        'user_id',
        'fcm_token',
        'platform',
        'device_name',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Scope for filtering by platform
    public function scopeForPlatform($query, string $platform)
    {
        return $query->where('platform', $platform);
    }
}
```

#### User Model Extensions

```php
// app/Models/User.php
class User extends Authenticatable
{
    public function fcmTokens()
    {
        return $this->hasMany(FcmToken::class);
    }

    /**
     * Required by laravel-notification-channels/fcm
     * Returns array of tokens for multicast sending
     */
    public function routeNotificationForFcm()
    {
        return $this->fcmTokens()->pluck('fcm_token')->toArray();
    }

    public function addFcmToken(string $token, string $platform, string $deviceName): FcmToken
    {
        // Check if exact combination exists
        $existing = $this->fcmTokens()
            ->where('fcm_token', $token)
            ->where('platform', $platform)
            ->where('device_name', $deviceName)
            ->first();

        if ($existing) {
            $existing->touch(); // Update timestamp
            return $existing;
        }

        // Create new token entry
        return $this->fcmTokens()->create([
            'fcm_token' => $token,
            'platform' => $platform,
            'device_name' => $deviceName,
        ]);
    }
}
```

#### Why this model structure:

- **Separation of Concerns**: FCM tokens have their own lifecycle
- **Easy Querying**: Can filter by platform, device, etc.
- **Automatic Cleanup**: Foreign key constraint handles user deletion
- **Scalable**: Easy to add more device-specific fields

### Step 6: Configuration Setup

#### Firebase Configuration

```php
// config/firebase.php
return [
    'default' => env('FIREBASE_CONNECTION', 'default'),
    'connections' => [
        'default' => [
            'credentials' => env('FIREBASE_CREDENTIALS'),
            'cache_store' => env('FIREBASE_CACHE_STORE', 'file'),
        ],
    ],
];
```

#### Environment Variables

```bash
# .env
FIREBASE_CREDENTIALS=storage/app/firebase-credentials.json
```

#### Why this configuration:

- **Environment-based**: Different credentials for dev/staging/production
- **Caching**: Improves performance by caching Firebase auth tokens
- **Flexibility**: Easy to switch between different Firebase projects

### Step 7: Notification Implementation

#### Basic Notification Class

```php
// app/Notifications/ProjectAccepted.php
use NotificationChannels\Fcm\FcmChannel;
use NotificationChannels\Fcm\FcmMessage;
use NotificationChannels\Fcm\Resources\Notification as FcmNotification;

class ProjectAccepted extends Notification
{
    protected $project;

    public function __construct($project)
    {
        $this->project = $project;
    }

    public function via($notifiable): array
    {
        return ['database', FcmChannel::class]; // Multiple channels
    }

    public function toFcm($notifiable): FcmMessage
    {
        return (new FcmMessage(notification: new FcmNotification(
            title: '🎉 Project Accepted!',
            body: "Your project '{$this->project->title}' has been accepted!",
            image: asset('images/success-icon.png')
        )))
        ->data([
            'type' => 'project_accepted',
            'project_id' => (string) $this->project->id,
            'click_action' => 'OPEN_PROJECT',
        ])
        ->custom([
            'android' => [
                'notification' => [
                    'color' => '#00ff00',
                    'sound' => 'default',
                    'channel_id' => 'projects',
                ],
            ],
            'apns' => [
                'payload' => [
                    'aps' => [
                        'sound' => 'default',
                        'badge' => 1,
                    ],
                ],
            ],
        ]);
    }

    public function toArray($notifiable): array
    {
        return [
            'title' => 'Project Accepted',
            'message' => "Your project '{$this->project->title}' has been accepted!",
            'project_id' => $this->project->id,
        ];
    }
}
```

#### Why this structure:

- **Multiple Channels**: Database for app history + FCM for push notifications
- **Platform-specific**: Different settings for Android/iOS
- **Rich Content**: Images, actions, and custom data
- **Consistent Data**: Same information across all channels

### Step 8: Authentication Integration

#### Login Controller Integration

```php
// app/Http/Controllers/Auth/LoginController.php
public function login(Request $request)
{
    $validator = validator($request->all(), [
        'email' => 'required|email',
        'password' => 'required',
        // FCM fields (optional for backward compatibility)
        'fcm_token' => 'nullable|string',
        'platform' => 'nullable|string|in:android,ios',
        'device_name' => 'nullable|string',
    ]);

    // ... authentication logic ...

    if ($user && Hash::check($request->password, $user->password)) {
        // Handle FCM token if provided
        if ($request->filled(['fcm_token', 'platform', 'device_name'])) {
            $user->addFcmToken(
                $request->fcm_token,
                $request->platform,
                $request->device_name
            );
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user,
            'fcm_token_saved' => $request->filled(['fcm_token', 'platform', 'device_name']),
        ]);
    }
}
```

#### Why integrate with authentication:

- **Automatic Registration**: FCM tokens saved during login
- **Device Tracking**: Know which devices belong to which users
- **Session Management**: Link FCM tokens to user sessions
- **Backward Compatibility**: Optional fields don't break existing apps

### Step 9: Error Handling & Token Cleanup

#### Failed Notification Listener

```php
// app/Listeners/HandleFailedFCMNotifications.php
class HandleFailedFCMNotifications
{
    public function handle(NotificationFailed $event): void
    {
        if ($event->channel !== FcmChannel::class) {
            return;
        }

        $report = Arr::get($event->data, 'report');
        $failedToken = $report->target()->value();

        Log::warning('FCM notification failed', [
            'token' => $failedToken,
            'error' => $report->error()?->getMessage(),
        ]);

        // Remove invalid tokens
        FcmToken::where('fcm_token', $failedToken)->delete();
    }
}
```

#### Why automatic cleanup is important:

- **Invalid Tokens**: Apps uninstalled, tokens expired
- **Performance**: Avoid sending to non-existent devices
- **Cost Optimization**: Reduce unnecessary API calls
- **User Experience**: Clean token database

 