# Video API

The Video API allows you to manage videos in the VidTube platform. This includes uploading, retrieving, updating, and deleting videos.

## Endpoints

- [Get All Videos](#get-all-videos)
- [Publish a Video](#publish-a-video)
- [Get Video by ID](#get-video-by-id)
- [Stream Video](#stream-video)
- [Update Video](#update-video)
- [Delete Video](#delete-video)
- [Toggle Publish Status](#toggle-publish-status)

---

## Get All Videos

```
GET /api/v1/videos
```

Retrieves a list of published videos with filtering, sorting, and pagination capabilities.

### Query Parameters

| Parameter | Type   | Default    | Description                                           |
|-----------|--------|------------|-------------------------------------------------------|
| page      | Number | 1          | Page number for pagination                            |
| limit     | Number | 10         | Number of videos per page                             |
| query     | String | -          | Search term for video title and description           |
| sortBy    | String | "createdAt"| Field to sort by (e.g., "views", "createdAt")        |
| sortType  | String | "desc"     | Sort direction: "asc" (ascending) or "desc" (descending) |
| userId    | String | -          | Filter videos by a specific user ID                   |

### Response

```json
{
  "statusCode": 200,
  "data": {
    "docs": [
      {
        "_id": "video_id",
        "videoFile": "video_url",
        "thumbnail": "thumbnail_url",
        "title": "Video Title",
        "description": "Video description",
        "duration": 120,
        "views": 1000,
        "isPublished": true,
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
  "message": "Videos fetched successfully",
  "success": true
}
```

### Error Responses

- **400 Bad Request**: If userId is provided but is not a valid ObjectId
- **500 Internal Server Error**: If there's a server error

### Notes

- Only published videos are returned
- Results are paginated
- Owner's sensitive information is excluded

---

## Publish a Video

```
POST /api/v1/videos
```

Uploads and publishes a new video.

### Authentication

This endpoint requires authentication. Include the authentication token in the request header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

### Request Body

The request must be a `multipart/form-data` request with the following fields:

| Field       | Type   | Required | Description                        |
|-------------|--------|----------|------------------------------------|
| title       | String | Yes      | Title of the video                 |
| description | String | Yes      | Description of the video           |
| duration    | Number | No       | Duration of the video in seconds   |
| videoFile   | File   | Yes      | Video file to upload               |
| thumbnail   | File   | Yes      | Thumbnail image for the video      |

### Response

```json
{
  "statusCode": 201,
  "data": {
    "_id": "video_id",
    "videoFile": "video_url",
    "thumbnail": "thumbnail_url",
    "title": "Video Title",
    "description": "Video description",
    "duration": 120,
    "views": 0,
    "Owner": "user_id",
    "isPublished": true,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  },
  "message": "Video published successfully",
  "success": true
}
```

### Error Responses

- **400 Bad Request**: 
  - If title or description is missing
  - If video or thumbnail files are not provided
  - If file upload fails
  - If error occurs during cloudinary upload
- **401 Unauthorized**: If user is not authenticated
- **500 Internal Server Error**: If there's a server error during video creation

### Notes

- Both video and thumbnail files are required
- Files are uploaded to Cloudinary
- The video is published immediately (isPublished = true)

---

## Get Video by ID

```
GET /api/v1/videos/:videoId
```

Retrieves a specific video by its ID and increments its view count.

### URL Parameters

| Parameter | Type   | Description       |
|-----------|--------|-------------------|
| videoId   | String | ID of the video   |

### Response

```json
{
  "statusCode": 200,
  "data": {
    "_id": "video_id",
    "videoFile": "video_url",
    "thumbnail": "thumbnail_url",
    "title": "Video Title",
    "description": "Video description",
    "duration": 120,
    "views": 1001,
    "isPublished": true,
    "owner": {
      "_id": "user_id",
      "username": "username",
      "fullName": "Full Name",
      "avatar": "avatar_url"
    },
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  },
  "message": "Video fetched successfully",
  "success": true
}
```

### Error Responses

- **400 Bad Request**:
  - If videoId is not provided
  - If videoId format is invalid
- **404 Not Found**: If the video does not exist or is not published
- **500 Internal Server Error**: If there's a server error

### Notes

- Each request to this endpoint increments the video's view count
- Only published videos can be retrieved
- Owner's sensitive information is excluded

---

## Stream Video

```
GET /api/v1/videos/:videoId/stream
```

Streams a video in chunks using HTTP range requests. This endpoint utilizes ffmpeg to process the video and send it in manageable packets, optimizing bandwidth usage and improving playback experience.

### URL Parameters

| Parameter | Type   | Description     |
|-----------|--------|-----------------|
| videoId   | String | ID of the video |

### Required Headers

| Header | Description                                                |
|--------|------------------------------------------------------------|
| Range  | Byte range of the video to stream (e.g., "bytes=0-1048576") |

### Response

- **Status Code**: 206 Partial Content
- **Content-Type**: video/mp4
- **Content-Range**: bytes start-end/*
- **Accept-Ranges**: bytes
- **Content-Length**: Length of the chunk being streamed

The response body contains the requested chunk of the video file.

### Error Responses

- **400 Bad Request**:
  - If videoId is not provided
  - If videoId format is invalid
- **404 Not Found**: If the video does not exist or is not published
- **416 Range Not Satisfiable**: If the Range header is missing
- **500 Internal Server Error**: If there's an error streaming the video

### Notes

- This endpoint requires the Range header for proper streaming
- It uses ffmpeg to process the video into packets
- Each request returns a chunk of the video based on the Range header
- The client (video player) typically makes multiple requests to get the full video
- This implementation optimizes for bandwidth and improves playback performance
- No video quality options are available in this version (coming in future updates)

---

## Update Video

```
PATCH /api/v1/videos/:videoId
```

Updates a video's details including title, description, and thumbnail.

### Authentication

This endpoint requires authentication. Include the authentication token in the request header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

### URL Parameters

| Parameter | Type   | Description       |
|-----------|--------|-------------------|
| videoId   | String | ID of the video   |

### Request Body

The request can be a `multipart/form-data` request with the following fields:

| Field       | Type   | Required | Description                        |
|-------------|--------|----------|------------------------------------|
| title       | String | No       | New title of the video             |
| description | String | No       | New description of the video       |
| thumbnail   | File   | No       | New thumbnail image for the video  |

### Response

```json
{
  "statusCode": 200,
  "data": {
    "_id": "video_id",
    "videoFile": "video_url",
    "thumbnail": "thumbnail_url",
    "title": "Updated Video Title",
    "description": "Updated video description",
    "duration": 120,
    "views": 1001,
    "Owner": "user_id",
    "isPublished": true,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T01:00:00.000Z"
  },
  "message": "Video updated successfully",
  "success": true
}
```

### Error Responses

- **400 Bad Request**:
  - If videoId is not provided
  - If videoId format is invalid
  - If error occurs during thumbnail upload
- **401 Unauthorized**: If user is not authenticated
- **403 Forbidden**: If the user is not the owner of the video
- **404 Not Found**: If the video does not exist
- **500 Internal Server Error**: If there's a server error

### Notes

- Only the video owner can update the video
- When a new thumbnail is uploaded, the old one is deleted from Cloudinary
- At least one field (title, description, or thumbnail) must be provided for update

---

## Delete Video

```
DELETE /api/v1/videos/:videoId
```

Deletes a video and its associated files from Cloudinary.

### Authentication

This endpoint requires authentication. Include the authentication token in the request header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

### URL Parameters

| Parameter | Type   | Description       |
|-----------|--------|-------------------|
| videoId   | String | ID of the video   |

### Response

```json
{
  "statusCode": 200,
  "data": {},
  "message": "Video deleted successfully",
  "success": true
}
```

### Error Responses

- **400 Bad Request**:
  - If videoId is not provided
  - If videoId format is invalid
- **401 Unauthorized**: If user is not authenticated
- **403 Forbidden**: If the user is not the owner of the video
- **404 Not Found**: If the video does not exist
- **500 Internal Server Error**: If there's a server error

### Notes

- Only the video owner can delete the video
- Both the video file and thumbnail are deleted from Cloudinary
- The video document is permanently removed from the database

---

## Toggle Publish Status

```
PATCH /api/v1/videos/toggle/publish/:videoId
```

Toggles the publish status of a video (published/unpublished).

### Authentication

This endpoint requires authentication. Include the authentication token in the request header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

### URL Parameters

| Parameter | Type   | Description       |
|-----------|--------|-------------------|
| videoId   | String | ID of the video   |

### Response

```json
{
  "statusCode": 200,
  "data": {
    "_id": "video_id",
    "videoFile": "video_url",
    "thumbnail": "thumbnail_url",
    "title": "Video Title",
    "description": "Video description",
    "duration": 120,
    "views": 1001,
    "Owner": "user_id",
    "isPublished": false,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T01:00:00.000Z"
  },
  "message": "Video unpublished successfully",
  "success": true
}
```

### Error Responses

- **400 Bad Request**:
  - If videoId is not provided
  - If videoId format is invalid
- **401 Unauthorized**: If user is not authenticated
- **403 Forbidden**: If the user is not the owner of the video
- **404 Not Found**: If the video does not exist
- **500 Internal Server Error**: If there's a server error

### Notes

- Only the video owner can toggle the publish status
- If the video is currently published, it will be unpublished, and vice versa
- Unpublished videos are not visible in the general video listings
