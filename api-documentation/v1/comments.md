# Comment API

The Comment API provides endpoints for managing comments on videos, including creating, retrieving, updating, and deleting comments.

## Endpoints

- [Get Video Comments](#get-video-comments)
- [Add Comment](#add-comment)
- [Update Comment](#update-comment)
- [Delete Comment](#delete-comment)

---

## Get Video Comments

```
GET /api/v1/comments/:videoId
```

Retrieves all comments for a specific video.

### URL Parameters

| Parameter | Type   | Description          |
|-----------|--------|----------------------|
| videoId   | String | ID of the video      |

### Query Parameters

| Parameter | Type   | Default | Description                                           |
|-----------|--------|---------|-------------------------------------------------------|
| page      | Number | 1       | Page number for pagination                            |
| limit     | Number | 10      | Number of comments per page                           |
| sort      | String | "desc"  | Sort direction: "asc" (oldest first) or "desc" (newest first) |

### Response

```json
{
  "statusCode": 200,
  "data": {
    "docs": [
      {
        "_id": "comment_id",
        "content": "Comment text",
        "video": "video_id",
        "owner": {
          "_id": "user_id",
          "username": "username",
          "fullName": "Full Name",
          "avatar": "avatar_url"
        },
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
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
  "message": "Comments fetched successfully",
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

- Comments are returned with the owner's basic information
- Results are paginated and typically sorted with newest comments first

---

## Add Comment

```
POST /api/v1/comments/:videoId
```

Adds a new comment to a specific video.

### Authentication

This endpoint requires authentication. Include the authentication token in the request header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

### URL Parameters

| Parameter | Type   | Description          |
|-----------|--------|----------------------|
| videoId   | String | ID of the video      |

### Request Body

| Field   | Type   | Required | Description                |
|---------|--------|----------|----------------------------|
| content | String | Yes      | Text content of the comment|

### Response

```json
{
  "statusCode": 201,
  "data": {
    "_id": "comment_id",
    "content": "Comment text",
    "video": "video_id",
    "owner": "user_id",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  },
  "message": "Comment added successfully",
  "success": true
}
```

### Error Responses

- **400 Bad Request**: 
  - If videoId is not provided
  - If videoId format is invalid
  - If comment content is missing or empty
- **401 Unauthorized**: If user is not authenticated
- **404 Not Found**: If the video does not exist
- **500 Internal Server Error**: If there's a server error

### Notes

- Comment content cannot be empty
- The authenticated user is automatically set as the comment owner

---

## Update Comment

```
PUT /api/v1/comments/:commentId
```

Updates an existing comment.

### Authentication

This endpoint requires authentication. Include the authentication token in the request header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

### URL Parameters

| Parameter | Type   | Description          |
|-----------|--------|----------------------|
| commentId | String | ID of the comment    |

### Request Body

| Field   | Type   | Required | Description                     |
|---------|--------|----------|---------------------------------|
| content | String | Yes      | New text content of the comment |

### Response

```json
{
  "statusCode": 200,
  "data": {
    "_id": "comment_id",
    "content": "Updated comment text",
    "video": "video_id",
    "owner": "user_id",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T01:00:00.000Z"
  },
  "message": "Comment updated successfully",
  "success": true
}
```

### Error Responses

- **400 Bad Request**: 
  - If commentId is not provided
  - If commentId format is invalid
  - If comment content is missing or empty
- **401 Unauthorized**: If user is not authenticated
- **403 Forbidden**: If the user is not the owner of the comment
- **404 Not Found**: If the comment does not exist
- **500 Internal Server Error**: If there's a server error

### Notes

- Only the comment owner can update the comment
- Comment content cannot be empty
- The updatedAt timestamp is automatically updated

---

## Delete Comment

```
DELETE /api/v1/comments/:commentId
```

Deletes a comment.

### Authentication

This endpoint requires authentication. Include the authentication token in the request header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

### URL Parameters

| Parameter | Type   | Description          |
|-----------|--------|----------------------|
| commentId | String | ID of the comment    |

### Response

```json
{
  "statusCode": 200,
  "data": {},
  "message": "Comment deleted successfully",
  "success": true
}
```

### Error Responses

- **400 Bad Request**: 
  - If commentId is not provided
  - If commentId format is invalid
- **401 Unauthorized**: If user is not authenticated
- **403 Forbidden**: If the user is not the owner of the comment
- **404 Not Found**: If the comment does not exist
- **500 Internal Server Error**: If there's a server error

### Notes

- Only the comment owner can delete the comment
- The comment is permanently removed from the database
