# Like API

The Like API provides endpoints for managing likes on videos, comments, and tweets, as well as retrieving information about likes.

## Endpoints

- [Get Video Likes](#get-video-likes)
- [Get Comment Likes](#get-comment-likes)
- [Get Tweet Likes](#get-tweet-likes)
- [Toggle Video Like](#toggle-video-like)
- [Toggle Comment Like](#toggle-comment-like)
- [Toggle Tweet Like](#toggle-tweet-like)
- [Get Liked Videos](#get-liked-videos)

---

## Get Video Likes

```
GET /api/v1/likes/videos/:videoId
```

Retrieves the likes for a specific video.

### URL Parameters

| Parameter | Type   | Description         |
|-----------|--------|---------------------|
| videoId   | String | ID of the video     |

### Query Parameters

| Parameter | Type   | Default | Description                 |
|-----------|--------|---------|-----------------------------|
| page      | Number | 1       | Page number for pagination  |
| limit     | Number | 10      | Number of likes per page    |

### Response

```json
{
  "statusCode": 200,
  "data": {
    "docs": [
      {
        "_id": "like_id",
        "video": "video_id",
        "likedBy": {
          "_id": "user_id",
          "username": "username",
          "fullName": "Full Name",
          "avatar": "avatar_url"
        },
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "totalDocs": 100,
    "limit": 10,
    "totalPages": 10,
    "page": 1,
    "pagingCounter": 1,
    "hasPrevPage": false,
    "hasNextPage": true,
    "prevPage": null,
    "nextPage": 2
  },
  "message": "Video likes fetched successfully",
  "success": true
}
```

### Error Responses

- **400 Bad Request**: 
  - If videoId is not provided
  - If videoId format is invalid
- **404 Not Found**: If the video does not exist
- **500 Internal Server Error**: If there's a server error

### Notes

- Results include basic information about users who liked the video
- Results are paginated

---

## Get Comment Likes

```
GET /api/v1/likes/comments/:commentId
```

Retrieves the likes for a specific comment.

### URL Parameters

| Parameter | Type   | Description         |
|-----------|--------|---------------------|
| commentId | String | ID of the comment   |

### Query Parameters

| Parameter | Type   | Default | Description                 |
|-----------|--------|---------|-----------------------------|
| page      | Number | 1       | Page number for pagination  |
| limit     | Number | 10      | Number of likes per page    |

### Response

```json
{
  "statusCode": 200,
  "data": {
    "docs": [
      {
        "_id": "like_id",
        "comment": "comment_id",
        "likedBy": {
          "_id": "user_id",
          "username": "username",
          "fullName": "Full Name",
          "avatar": "avatar_url"
        },
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "totalDocs": 100,
    "limit": 10,
    "totalPages": 10,
    "page": 1,
    "pagingCounter": 1,
    "hasPrevPage": false,
    "hasNextPage": true,
    "prevPage": null,
    "nextPage": 2
  },
  "message": "Comment likes fetched successfully",
  "success": true
}
```

### Error Responses

- **400 Bad Request**: 
  - If commentId is not provided
  - If commentId format is invalid
- **404 Not Found**: If the comment does not exist
- **500 Internal Server Error**: If there's a server error

### Notes

- Results include basic information about users who liked the comment
- Results are paginated

---

## Get Tweet Likes

```
GET /api/v1/likes/tweets/:tweetId
```

Retrieves the likes for a specific tweet.

### URL Parameters

| Parameter | Type   | Description         |
|-----------|--------|---------------------|
| tweetId   | String | ID of the tweet     |

### Query Parameters

| Parameter | Type   | Default | Description                 |
|-----------|--------|---------|-----------------------------|
| page      | Number | 1       | Page number for pagination  |
| limit     | Number | 10      | Number of likes per page    |

### Response

```json
{
  "statusCode": 200,
  "data": {
    "docs": [
      {
        "_id": "like_id",
        "tweet": "tweet_id",
        "likedBy": {
          "_id": "user_id",
          "username": "username",
          "fullName": "Full Name",
          "avatar": "avatar_url"
        },
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "totalDocs": 100,
    "limit": 10,
    "totalPages": 10,
    "page": 1,
    "pagingCounter": 1,
    "hasPrevPage": false,
    "hasNextPage": true,
    "prevPage": null,
    "nextPage": 2
  },
  "message": "Tweet likes fetched successfully",
  "success": true
}
```

### Error Responses

- **400 Bad Request**: 
  - If tweetId is not provided
  - If tweetId format is invalid
- **404 Not Found**: If the tweet does not exist
- **500 Internal Server Error**: If there's a server error

### Notes

- Results include basic information about users who liked the tweet
- Results are paginated

---

## Toggle Video Like

```
POST /api/v1/likes/toggle/video/:videoId
```

Toggles a like on a video (adds like if not already liked, removes like if already liked).

### Authentication

This endpoint requires authentication. Include the authentication token in the request header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

### URL Parameters

| Parameter | Type   | Description         |
|-----------|--------|---------------------|
| videoId   | String | ID of the video     |

### Response (When like is added)

```json
{
  "statusCode": 200,
  "data": {
    "_id": "like_id",
    "video": "video_id",
    "likedBy": "user_id",
    "createdAt": "2023-01-01T00:00:00.000Z"
  },
  "message": "Video liked successfully",
  "success": true
}
```

### Response (When like is removed)

```json
{
  "statusCode": 200,
  "data": {},
  "message": "Video unliked successfully",
  "success": true
}
```

### Error Responses

- **400 Bad Request**: 
  - If videoId is not provided
  - If videoId format is invalid
- **401 Unauthorized**: If user is not authenticated
- **404 Not Found**: If the video does not exist
- **500 Internal Server Error**: If there's a server error

### Notes

- If the user has already liked the video, the like will be removed (unlike)
- If the user has not liked the video, a new like will be added

---

## Toggle Comment Like

```
POST /api/v1/likes/toggle/comment/:commentId
```

Toggles a like on a comment (adds like if not already liked, removes like if already liked).

### Authentication

This endpoint requires authentication. Include the authentication token in the request header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

### URL Parameters

| Parameter | Type   | Description         |
|-----------|--------|---------------------|
| commentId | String | ID of the comment   |

### Response (When like is added)

```json
{
  "statusCode": 200,
  "data": {
    "_id": "like_id",
    "comment": "comment_id",
    "likedBy": "user_id",
    "createdAt": "2023-01-01T00:00:00.000Z"
  },
  "message": "Comment liked successfully",
  "success": true
}
```

### Response (When like is removed)

```json
{
  "statusCode": 200,
  "data": {},
  "message": "Comment unliked successfully",
  "success": true
}
```

### Error Responses

- **400 Bad Request**: 
  - If commentId is not provided
  - If commentId format is invalid
- **401 Unauthorized**: If user is not authenticated
- **404 Not Found**: If the comment does not exist
- **500 Internal Server Error**: If there's a server error

### Notes

- If the user has already liked the comment, the like will be removed (unlike)
- If the user has not liked the comment, a new like will be added

---

## Toggle Tweet Like

```
POST /api/v1/likes/toggle/tweet/:tweetId
```

Toggles a like on a tweet (adds like if not already liked, removes like if already liked).

### Authentication

This endpoint requires authentication. Include the authentication token in the request header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

### URL Parameters

| Parameter | Type   | Description         |
|-----------|--------|---------------------|
| tweetId   | String | ID of the tweet     |

### Response (When like is added)

```json
{
  "statusCode": 200,
  "data": {
    "_id": "like_id",
    "tweet": "tweet_id",
    "likedBy": "user_id",
    "createdAt": "2023-01-01T00:00:00.000Z"
  },
  "message": "Tweet liked successfully",
  "success": true
}
```

### Response (When like is removed)

```json
{
  "statusCode": 200,
  "data": {},
  "message": "Tweet unliked successfully",
  "success": true
}
```

### Error Responses

- **400 Bad Request**: 
  - If tweetId is not provided
  - If tweetId format is invalid
- **401 Unauthorized**: If user is not authenticated
- **404 Not Found**: If the tweet does not exist
- **500 Internal Server Error**: If there's a server error

### Notes

- If the user has already liked the tweet, the like will be removed (unlike)
- If the user has not liked the tweet, a new like will be added

---

## Get Liked Videos

```
GET /api/v1/likes/user/liked-videos
```

Retrieves all videos liked by the authenticated user.

### Authentication

This endpoint requires authentication. Include the authentication token in the request header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

### Query Parameters

| Parameter | Type   | Default | Description                 |
|-----------|--------|---------|-----------------------------|
| page      | Number | 1       | Page number for pagination  |
| limit     | Number | 10      | Number of videos per page   |

### Response

```json
{
  "statusCode": 200,
  "data": {
    "docs": [
      {
        "_id": "video_id",
        "title": "Video Title",
        "description": "Video description",
        "thumbnail": "thumbnail_url",
        "duration": 120,
        "views": 1000,
        "owner": {
          "_id": "user_id",
          "username": "username",
          "fullName": "Full Name",
          "avatar": "avatar_url"
        },
        "createdAt": "2023-01-01T00:00:00.000Z",
        "likedAt": "2023-01-02T00:00:00.000Z"
      }
    ],
    "totalDocs": 50,
    "limit": 10,
    "totalPages": 5,
    "page": 1,
    "pagingCounter": 1,
    "hasPrevPage": false,
    "hasNextPage": true,
    "prevPage": null,
    "nextPage": 2
  },
  "message": "Liked videos fetched successfully",
  "success": true
}
```

### Error Responses

- **401 Unauthorized**: If user is not authenticated
- **500 Internal Server Error**: If there's a server error

### Notes

- Results include detailed information about the liked videos
- Videos are typically sorted with most recently liked videos first
- Results are paginated
