# VidTube API v1

This is the first version of the VidTube API. It provides endpoints for managing videos, users, comments, likes, playlists, subscriptions, and tweets.

## Base URL

All API endpoints are relative to the base URL:

```
https://your-api-domain.com/api/v1
```

## Authentication

Most endpoints require authentication. Authentication is handled using JWT (JSON Web Tokens).

When a user logs in or registers, they receive a token which should be included in subsequent requests in the Authorization header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

## Available Resources

- [Users](./users.md) - User registration, authentication, profile management
- [Videos](./videos.md) - Video upload, listing, viewing, and management
- [Comments](./comments.md) - Comment creation, listing, and management
- [Likes](./likes.md) - Like/dislike functionality for videos and comments
- [Playlists](./playlists.md) - Creating and managing playlists
- [Subscriptions](./subscriptions.md) - Subscribe to channels/users
- [Tweets](./tweets.md) - Post and manage tweets
- [Health Check](./health-check.md) - API health status
