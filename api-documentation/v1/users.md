# User API

The User API provides endpoints for user registration, authentication, profile management, and watch history.

## Endpoints

- [Register User](#register-user)
- [Login User](#login-user)
- [Logout User](#logout-user)
- [Update Avatar](#update-avatar)
- [Update Cover Image](#update-cover-image)
- [Get Channel Profile](#get-channel-profile)
- [Get Watch History](#get-watch-history)

---

## Register User

```
POST /api/v1/users/register
```

Registers a new user with the platform.

### Request Body

The request must be a `multipart/form-data` request with the following fields:

| Field      | Type   | Required | Description                        |
|------------|--------|----------|------------------------------------|
| fullname   | String | Yes      | User's full name                   |
| email      | String | Yes      | User's email address               |
| username   | String | Yes      | Unique username                    |
| password   | String | Yes      | User's password                    |
| avatar     | File   | No       | Profile picture                    |
| coverImage | File   | No       | Cover image for the user's channel |

### Response

```json
{
  "statusCode": 201,
  "data": {
    "user": {
      "_id": "user_id",
      "username": "username",
      "email": "user@example.com",
      "fullname": "Full Name",
      "avatar": "avatar_url",
      "coverImage": "cover_image_url",
      "watchHistory": []
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  },
  "message": "User registered successfully",
  "success": true
}
```

### Error Responses

- **400 Bad Request**: If required fields are missing
- **409 Conflict**: If username or email already exists
- **500 Internal Server Error**: If there's a server error during registration

### Notes

- Password is hashed before saving to the database
- Avatar and cover image files are uploaded to Cloudinary
- JWT tokens are generated for immediate authentication after registration

---

## Login User

```
POST /api/v1/users/login
```

Authenticates a user and provides access tokens.

### Request Body

| Field    | Type   | Required | Description         |
|----------|--------|----------|---------------------|
| email    | String | Yes*     | User's email address|
| username | String | Yes*     | User's username     |
| password | String | Yes      | User's password     |

*Either email or username must be provided

### Response

```json
{
  "statusCode": 200,
  "data": {
    "user": {
      "_id": "user_id",
      "username": "username",
      "email": "user@example.com",
      "fullname": "Full Name",
      "avatar": "avatar_url",
      "coverImage": "cover_image_url"
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  },
  "message": "User logged in successfully",
  "success": true
}
```

### Error Responses

- **400 Bad Request**: If email/username or password is missing
- **401 Unauthorized**: If email/username doesn't exist or password is incorrect
- **500 Internal Server Error**: If there's a server error during login

### Notes

- You can login using either email or username
- JWT tokens are provided for authentication
- Password verification is done securely

---

## Logout User

```
POST /api/v1/users/logout
```

Logs out the currently authenticated user by invalidating their refresh token.

### Authentication

This endpoint requires authentication. Include the authentication token in the request header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

### Response

```json
{
  "statusCode": 200,
  "data": {},
  "message": "User logged out successfully",
  "success": true
}
```

### Error Responses

- **401 Unauthorized**: If user is not authenticated
- **500 Internal Server Error**: If there's a server error during logout

### Notes

- The user's refresh token is cleared from the database
- Access token will still be valid until it expires

---

## Update Avatar

```
PATCH /api/v1/users/updateAvatar
```

Updates the user's profile picture (avatar).

### Authentication

This endpoint requires authentication. Include the authentication token in the request header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

### Request Body

The request must be a `multipart/form-data` request with the following field:

| Field  | Type | Required | Description      |
|--------|------|----------|------------------|
| avatar | File | Yes      | New avatar image |

### Response

```json
{
  "statusCode": 200,
  "data": {
    "avatar": "new_avatar_url"
  },
  "message": "Avatar updated successfully",
  "success": true
}
```

### Error Responses

- **400 Bad Request**: If avatar file is missing or upload fails
- **401 Unauthorized**: If user is not authenticated
- **500 Internal Server Error**: If there's a server error

### Notes

- The old avatar is deleted from Cloudinary
- The user's avatar URL is updated in the database

---

## Update Cover Image

```
PATCH /api/v1/users/cover-image
```

Updates the user's channel cover image.

### Authentication

This endpoint requires authentication. Include the authentication token in the request header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

### Request Body

The request must be a `multipart/form-data` request with the following field:

| Field      | Type | Required | Description          |
|------------|------|----------|----------------------|
| coverImage | File | Yes      | New cover image file |

### Response

```json
{
  "statusCode": 200,
  "data": {
    "coverImage": "new_cover_image_url"
  },
  "message": "Cover image updated successfully",
  "success": true
}
```

### Error Responses

- **400 Bad Request**: If cover image file is missing or upload fails
- **401 Unauthorized**: If user is not authenticated
- **500 Internal Server Error**: If there's a server error

### Notes

- The old cover image is deleted from Cloudinary
- The user's cover image URL is updated in the database

---

## Get Channel Profile

```
GET /api/v1/users/c/:username
```

Retrieves a user's channel profile including subscriber count and subscriptions.

### Authentication

This endpoint requires authentication. Include the authentication token in the request header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

### URL Parameters

| Parameter | Type   | Description              |
|-----------|--------|--------------------------|
| username  | String | Username of the channel  |

### Response

```json
{
  "statusCode": 200,
  "data": {
    "_id": "user_id",
    "username": "username",
    "email": "user@example.com",
    "fullname": "Full Name",
    "avatar": "avatar_url",
    "coverImage": "cover_image_url",
    "subscribersCount": 1000,
    "channelsSubscribedToCount": 50,
    "isSubscribed": true
  },
  "message": "User channel fetched successfully",
  "success": true
}
```

### Error Responses

- **400 Bad Request**: If username parameter is missing
- **401 Unauthorized**: If user is not authenticated
- **404 Not Found**: If the channel does not exist
- **500 Internal Server Error**: If there's a server error

### Notes

- The `isSubscribed` field indicates whether the requesting user is subscribed to this channel
- Subscriber counts are calculated in real-time
- Email and other sensitive information might be hidden for privacy

---

## Get Watch History

```
GET /api/v1/users/history
```

Retrieves the authenticated user's video watch history.

### Authentication

This endpoint requires authentication. Include the authentication token in the request header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

### Response

```json
{
  "statusCode": 200,
  "data": {
    "watchHistory": [
      {
        "_id": "video_id",
        "title": "Video Title",
        "description": "Video description",
        "duration": 120,
        "views": 1000,
        "thumbnail": "thumbnail_url",
        "owner": {
          "_id": "user_id",
          "username": "username",
          "fullname": "Full Name",
          "avatar": "avatar_url"
        },
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ]
  },
  "message": "Watch history fetched successfully",
  "success": true
}
```

### Error Responses

- **401 Unauthorized**: If user is not authenticated
- **500 Internal Server Error**: If there's a server error

### Notes

- Watch history is populated with video details and video owner information
- History is typically ordered with most recently watched videos first
