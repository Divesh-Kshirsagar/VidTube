# VidTube API Documentation

## Overview

The VidTube API provides endpoints for managing videos, users, comments, likes, playlists, subscriptions, and tweets. This documentation will help frontend developers integrate with the backend API.

## API Versions

- [API v1](./v1/index.md) - Current stable version

## Authentication

Most endpoints require authentication. Authentication is handled using JWT (JSON Web Tokens). 

When a user logs in or registers, they receive a token which should be included in subsequent requests in the Authorization header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

## Common Response Format

All API responses follow a standard format:

```json
{
  "statusCode": 200,
  "data": {},
  "message": "Operation successful",
  "success": true
}
```

## Error Handling

Errors are returned in the following format:

```json
{
  "statusCode": 400,
  "data": null,
  "message": "Error message describing the issue",
  "success": false
}
```

Common HTTP status codes:
- 200: OK - Request successful
- 201: Created - Resource created successfully
- 400: Bad Request - Invalid input
- 401: Unauthorized - Authentication required
- 403: Forbidden - Not allowed to access
- 404: Not Found - Resource not found
- 500: Internal Server Error - Server-side error

## API Resources

- [Users](./v1/users.md)
- [Videos](./v1/videos.md)
- [Comments](./v1/comments.md)
- [Likes](./v1/likes.md)
- [Playlists](./v1/playlists.md)
- [Subscriptions](./v1/subscriptions.md)
- [Tweets](./v1/tweets.md)
- [Health Check](./v1/health-check.md)
