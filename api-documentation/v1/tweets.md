# Tweet API

The Tweet API provides endpoints for creating and managing tweets, a simpler form of content sharing on the platform.

## Endpoints

- [Create Tweet](#create-tweet)
- [Get All Tweets](#get-all-tweets)
- [Get User Tweets](#get-user-tweets)
- [Update Tweet](#update-tweet)
- [Delete Tweet](#delete-tweet)

---

## Create Tweet

```
POST /api/v1/tweets
```

Creates a new tweet.

### Authentication

This endpoint requires authentication. Include the authentication token in the request header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

### Request Body

| Field   | Type   | Required | Description           |
|---------|--------|----------|-----------------------|
| content | String | Yes      | Content of the tweet  |

### Response

```json
{
  "statusCode": 201,
  "data": {
    "_id": "tweet_id",
    "content": "Tweet content",
    "owner": "user_id",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  },
  "message": "Tweet created successfully",
  "success": true
}
```

### Error Responses

- **400 Bad Request**: If content is missing or empty
- **401 Unauthorized**: If user is not authenticated
- **500 Internal Server Error**: If there's a server error

### Notes

- Tweets have a character limit (typically 280 characters)
- The authenticated user is automatically set as the tweet owner

---

## Get All Tweets

```
GET /api/v1/tweets
```

Retrieves all tweets, with the newest tweets first.

### Query Parameters

| Parameter | Type   | Default | Description                |
|-----------|--------|---------|----------------------------|
| page      | Number | 1       | Page number for pagination |
| limit     | Number | 10      | Number of tweets per page  |

### Response

```json
{
  "statusCode": 200,
  "data": {
    "docs": [
      {
        "_id": "tweet_id",
        "content": "Tweet content",
        "owner": {
          "_id": "user_id",
          "username": "username",
          "fullName": "Full Name",
          "avatar": "avatar_url"
        },
        "likesCount": 42,
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "totalDocs": 200,
    "limit": 10,
    "totalPages": 20,
    "page": 1,
    "pagingCounter": 1,
    "hasPrevPage": false,
    "hasNextPage": true,
    "prevPage": null,
    "nextPage": 2
  },
  "message": "Tweets fetched successfully",
  "success": true
}
```

### Error Responses

- **500 Internal Server Error**: If there's a server error

### Notes

- Results include owner information for each tweet
- Results are paginated
- Tweets are sorted with newest first
- The `likesCount` field shows the number of likes for each tweet

---

## Get User Tweets

```
GET /api/v1/tweets/user/:userId
```

Retrieves all tweets by a specific user.

### URL Parameters

| Parameter | Type   | Description          |
|-----------|--------|----------------------|
| userId    | String | ID of the user       |

### Query Parameters

| Parameter | Type   | Default | Description                |
|-----------|--------|---------|----------------------------|
| page      | Number | 1       | Page number for pagination |
| limit     | Number | 10      | Number of tweets per page  |

### Response

```json
{
  "statusCode": 200,
  "data": {
    "docs": [
      {
        "_id": "tweet_id",
        "content": "Tweet content",
        "owner": {
          "_id": "user_id",
          "username": "username",
          "fullName": "Full Name",
          "avatar": "avatar_url"
        },
        "likesCount": 42,
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
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
  "message": "User tweets fetched successfully",
  "success": true
}
```

### Error Responses

- **400 Bad Request**:
  - If userId is not provided
  - If userId format is invalid
- **404 Not Found**: If the user does not exist
- **500 Internal Server Error**: If there's a server error

### Notes

- Results include owner information for each tweet
- Results are paginated
- Tweets are sorted with newest first
- The `likesCount` field shows the number of likes for each tweet

---

## Update Tweet

```
PUT /api/v1/tweets/:tweetId
```

Updates the content of a tweet.

### Authentication

This endpoint requires authentication. Include the authentication token in the request header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

### URL Parameters

| Parameter | Type   | Description         |
|-----------|--------|---------------------|
| tweetId   | String | ID of the tweet     |

### Request Body

| Field   | Type   | Required | Description                |
|---------|--------|----------|----------------------------|
| content | String | Yes      | New content of the tweet   |

### Response

```json
{
  "statusCode": 200,
  "data": {
    "_id": "tweet_id",
    "content": "Updated tweet content",
    "owner": "user_id",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T01:00:00.000Z"
  },
  "message": "Tweet updated successfully",
  "success": true
}
```

### Error Responses

- **400 Bad Request**:
  - If tweetId is not provided
  - If tweetId format is invalid
  - If content is missing or empty
- **401 Unauthorized**: If user is not authenticated
- **403 Forbidden**: If the user is not the owner of the tweet
- **404 Not Found**: If the tweet does not exist
- **500 Internal Server Error**: If there's a server error

### Notes

- Only the tweet owner can update the tweet
- Tweets have a character limit (typically 280 characters)
- The updatedAt timestamp is automatically updated

---

## Delete Tweet

```
DELETE /api/v1/tweets/:tweetId
```

Deletes a tweet.

### Authentication

This endpoint requires authentication. Include the authentication token in the request header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

### URL Parameters

| Parameter | Type   | Description         |
|-----------|--------|---------------------|
| tweetId   | String | ID of the tweet     |

### Response

```json
{
  "statusCode": 200,
  "data": {},
  "message": "Tweet deleted successfully",
  "success": true
}
```

### Error Responses

- **400 Bad Request**:
  - If tweetId is not provided
  - If tweetId format is invalid
- **401 Unauthorized**: If user is not authenticated
- **403 Forbidden**: If the user is not the owner of the tweet
- **404 Not Found**: If the tweet does not exist
- **500 Internal Server Error**: If there's a server error

### Notes

- Only the tweet owner can delete the tweet
- The tweet and all associated likes are permanently removed from the database
