# Playlist API

The Playlist API provides endpoints for creating and managing playlists, as well as adding and removing videos from playlists.

## Endpoints

- [Create Playlist](#create-playlist)
- [Get User Playlists](#get-user-playlists)
- [Get Playlist by ID](#get-playlist-by-id)
- [Get User Playlists by User ID](#get-user-playlists-by-user-id)
- [Update Playlist](#update-playlist)
- [Delete Playlist](#delete-playlist)
- [Add Video to Playlist](#add-video-to-playlist)
- [Remove Video from Playlist](#remove-video-from-playlist)

---

## Create Playlist

```
POST /api/v1/playlists
```

Creates a new playlist.

### Authentication

This endpoint requires authentication. Include the authentication token in the request header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

### Request Body

| Field       | Type    | Required | Description                        |
|-------------|---------|----------|------------------------------------|
| name        | String  | Yes      | Name of the playlist               |
| description | String  | No       | Description of the playlist        |
| isPrivate   | Boolean | No       | Whether the playlist is private (default: false) |

### Response

```json
{
  "statusCode": 201,
  "data": {
    "_id": "playlist_id",
    "name": "Playlist Name",
    "description": "Playlist description",
    "isPrivate": false,
    "owner": "user_id",
    "videos": [],
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  },
  "message": "Playlist created successfully",
  "success": true
}
```

### Error Responses

- **400 Bad Request**: If name is missing or empty
- **401 Unauthorized**: If user is not authenticated
- **500 Internal Server Error**: If there's a server error

### Notes

- The authenticated user is automatically set as the playlist owner
- A playlist is initially created with no videos

---

## Get User Playlists

```
GET /api/v1/playlists
```

Retrieves all playlists owned by the authenticated user.

### Authentication

This endpoint requires authentication. Include the authentication token in the request header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

### Query Parameters

| Parameter | Type   | Default | Description                  |
|-----------|--------|---------|------------------------------|
| page      | Number | 1       | Page number for pagination   |
| limit     | Number | 10      | Number of playlists per page |

### Response

```json
{
  "statusCode": 200,
  "data": {
    "docs": [
      {
        "_id": "playlist_id",
        "name": "Playlist Name",
        "description": "Playlist description",
        "isPrivate": false,
        "owner": "user_id",
        "videoCount": 10,
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "totalDocs": 30,
    "limit": 10,
    "totalPages": 3,
    "page": 1,
    "pagingCounter": 1,
    "hasPrevPage": false,
    "hasNextPage": true,
    "prevPage": null,
    "nextPage": 2
  },
  "message": "Playlists fetched successfully",
  "success": true
}
```

### Error Responses

- **401 Unauthorized**: If user is not authenticated
- **500 Internal Server Error**: If there's a server error

### Notes

- Results include the count of videos in each playlist
- Results are paginated
- Both private and public playlists are included (as they all belong to the authenticated user)

---

## Get Playlist by ID

```
GET /api/v1/playlists/:playlistId
```

Retrieves a specific playlist by its ID, including the videos in the playlist.

### URL Parameters

| Parameter  | Type   | Description          |
|------------|--------|----------------------|
| playlistId | String | ID of the playlist   |

### Query Parameters

| Parameter | Type   | Default | Description                |
|-----------|--------|---------|----------------------------|
| page      | Number | 1       | Page number for pagination |
| limit     | Number | 10      | Number of videos per page  |

### Response

```json
{
  "statusCode": 200,
  "data": {
    "playlist": {
      "_id": "playlist_id",
      "name": "Playlist Name",
      "description": "Playlist description",
      "isPrivate": false,
      "owner": {
        "_id": "user_id",
        "username": "username",
        "fullName": "Full Name",
        "avatar": "avatar_url"
      },
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    },
    "videos": {
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
          "createdAt": "2023-01-01T00:00:00.000Z"
        }
      ],
      "totalDocs": 25,
      "limit": 10,
      "totalPages": 3,
      "page": 1,
      "pagingCounter": 1,
      "hasPrevPage": false,
      "hasNextPage": true,
      "prevPage": null,
      "nextPage": 2
    }
  },
  "message": "Playlist fetched successfully",
  "success": true
}
```

### Error Responses

- **400 Bad Request**: 
  - If playlistId is not provided
  - If playlistId format is invalid
- **403 Forbidden**: If the playlist is private and requester is not the owner
- **404 Not Found**: If the playlist does not exist
- **500 Internal Server Error**: If there's a server error

### Notes

- If the playlist is private, only the owner can view it
- Videos in the playlist are paginated
- Detailed information about the playlist owner and video owners is included

---

## Get User Playlists by User ID

```
GET /api/v1/playlists/user/:userId
```

Retrieves all public playlists owned by a specific user.

### URL Parameters

| Parameter | Type   | Description         |
|-----------|--------|---------------------|
| userId    | String | ID of the user      |

### Query Parameters

| Parameter | Type   | Default | Description                  |
|-----------|--------|---------|------------------------------|
| page      | Number | 1       | Page number for pagination   |
| limit     | Number | 10      | Number of playlists per page |

### Response

```json
{
  "statusCode": 200,
  "data": {
    "docs": [
      {
        "_id": "playlist_id",
        "name": "Playlist Name",
        "description": "Playlist description",
        "owner": {
          "_id": "user_id",
          "username": "username",
          "fullName": "Full Name",
          "avatar": "avatar_url"
        },
        "videoCount": 15,
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "totalDocs": 20,
    "limit": 10,
    "totalPages": 2,
    "page": 1,
    "pagingCounter": 1,
    "hasPrevPage": false,
    "hasNextPage": true,
    "prevPage": null,
    "nextPage": 2
  },
  "message": "User playlists fetched successfully",
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

- Only public playlists are included in the response
- Results include the count of videos in each playlist
- Results are paginated
- Detailed information about the playlist owner is included

---

## Update Playlist

```
PUT /api/v1/playlists/:playlistId
```

Updates a playlist's details.

### Authentication

This endpoint requires authentication. Include the authentication token in the request header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

### URL Parameters

| Parameter  | Type   | Description          |
|------------|--------|----------------------|
| playlistId | String | ID of the playlist   |

### Request Body

| Field       | Type    | Required | Description                        |
|-------------|---------|----------|------------------------------------|
| name        | String  | No       | New name of the playlist           |
| description | String  | No       | New description of the playlist    |
| isPrivate   | Boolean | No       | Whether the playlist is private    |

### Response

```json
{
  "statusCode": 200,
  "data": {
    "_id": "playlist_id",
    "name": "Updated Playlist Name",
    "description": "Updated playlist description",
    "isPrivate": true,
    "owner": "user_id",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T01:00:00.000Z"
  },
  "message": "Playlist updated successfully",
  "success": true
}
```

### Error Responses

- **400 Bad Request**: 
  - If playlistId is not provided
  - If playlistId format is invalid
  - If no update fields are provided
- **401 Unauthorized**: If user is not authenticated
- **403 Forbidden**: If the user is not the owner of the playlist
- **404 Not Found**: If the playlist does not exist
- **500 Internal Server Error**: If there's a server error

### Notes

- Only the playlist owner can update the playlist
- At least one field (name, description, or isPrivate) must be provided for update
- The videos in the playlist remain unchanged

---

## Delete Playlist

```
DELETE /api/v1/playlists/:playlistId
```

Deletes a playlist.

### Authentication

This endpoint requires authentication. Include the authentication token in the request header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

### URL Parameters

| Parameter  | Type   | Description          |
|------------|--------|----------------------|
| playlistId | String | ID of the playlist   |

### Response

```json
{
  "statusCode": 200,
  "data": {},
  "message": "Playlist deleted successfully",
  "success": true
}
```

### Error Responses

- **400 Bad Request**: 
  - If playlistId is not provided
  - If playlistId format is invalid
- **401 Unauthorized**: If user is not authenticated
- **403 Forbidden**: If the user is not the owner of the playlist
- **404 Not Found**: If the playlist does not exist
- **500 Internal Server Error**: If there's a server error

### Notes

- Only the playlist owner can delete the playlist
- The playlist and all its video references are permanently removed from the database
- The actual videos are not deleted, only their references in the playlist

---

## Add Video to Playlist

```
POST /api/v1/playlists/:playlistId/videos/:videoId
```

Adds a video to a playlist.

### Authentication

This endpoint requires authentication. Include the authentication token in the request header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

### URL Parameters

| Parameter  | Type   | Description          |
|------------|--------|----------------------|
| playlistId | String | ID of the playlist   |
| videoId    | String | ID of the video      |

### Response

```json
{
  "statusCode": 200,
  "data": {
    "playlist": "playlist_id",
    "video": "video_id",
    "addedAt": "2023-01-01T00:00:00.000Z"
  },
  "message": "Video added to playlist successfully",
  "success": true
}
```

### Error Responses

- **400 Bad Request**: 
  - If playlistId or videoId is not provided
  - If playlistId or videoId format is invalid
  - If video is already in the playlist
- **401 Unauthorized**: If user is not authenticated
- **403 Forbidden**: If the user is not the owner of the playlist
- **404 Not Found**: If the playlist or video does not exist
- **500 Internal Server Error**: If there's a server error

### Notes

- Only the playlist owner can add videos to the playlist
- A video cannot be added to a playlist more than once
- The video must exist in the database

---

## Remove Video from Playlist

```
DELETE /api/v1/playlists/:playlistId/videos/:videoId
```

Removes a video from a playlist.

### Authentication

This endpoint requires authentication. Include the authentication token in the request header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

### URL Parameters

| Parameter  | Type   | Description          |
|------------|--------|----------------------|
| playlistId | String | ID of the playlist   |
| videoId    | String | ID of the video      |

### Response

```json
{
  "statusCode": 200,
  "data": {},
  "message": "Video removed from playlist successfully",
  "success": true
}
```

### Error Responses

- **400 Bad Request**: 
  - If playlistId or videoId is not provided
  - If playlistId or videoId format is invalid
- **401 Unauthorized**: If user is not authenticated
- **403 Forbidden**: If the user is not the owner of the playlist
- **404 Not Found**: 
  - If the playlist does not exist
  - If the video is not in the playlist
- **500 Internal Server Error**: If there's a server error

### Notes

- Only the playlist owner can remove videos from the playlist
- The video reference is removed from the playlist, but the video itself remains in the database
