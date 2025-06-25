# Subscription API

The Subscription API provides endpoints for managing subscriptions to channels, including subscribing/unsubscribing, and retrieving subscription information.

## Endpoints

- [Toggle Subscription](#toggle-subscription)
- [Get User Subscribed Channels](#get-user-subscribed-channels)
- [Get Channel Subscribers](#get-channel-subscribers)
- [Get Channel Subscribers Count](#get-channel-subscribers-count)

---

## Toggle Subscription

```
POST /api/v1/subscriptions/toggle/:channelId
```

Toggles a subscription to a channel (subscribes if not already subscribed, unsubscribes if already subscribed).

### Authentication

This endpoint requires authentication. Include the authentication token in the request header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

### URL Parameters

| Parameter | Type   | Description                                |
|-----------|--------|--------------------------------------------|
| channelId | String | ID of the channel (user) to subscribe to   |

### Response (When subscribing)

```json
{
  "statusCode": 200,
  "data": {
    "_id": "subscription_id",
    "subscriber": "user_id",
    "channel": "channel_id",
    "createdAt": "2023-01-01T00:00:00.000Z"
  },
  "message": "Subscribed successfully",
  "success": true
}
```

### Response (When unsubscribing)

```json
{
  "statusCode": 200,
  "data": {},
  "message": "Unsubscribed successfully",
  "success": true
}
```

### Error Responses

- **400 Bad Request**: 
  - If channelId is not provided
  - If channelId format is invalid
  - If user tries to subscribe to their own channel
- **401 Unauthorized**: If user is not authenticated
- **404 Not Found**: If the channel does not exist
- **500 Internal Server Error**: If there's a server error

### Notes

- A user cannot subscribe to their own channel
- If the user is already subscribed to the channel, the subscription will be removed
- If the user is not subscribed to the channel, a new subscription will be created

---

## Get User Subscribed Channels

```
GET /api/v1/subscriptions/user/:userId
```

Retrieves all channels that a specific user has subscribed to.

### URL Parameters

| Parameter | Type   | Description          |
|-----------|--------|----------------------|
| userId    | String | ID of the user       |

### Query Parameters

| Parameter | Type   | Default | Description                  |
|-----------|--------|---------|------------------------------|
| page      | Number | 1       | Page number for pagination   |
| limit     | Number | 10      | Number of channels per page  |

### Response

```json
{
  "statusCode": 200,
  "data": {
    "docs": [
      {
        "_id": "channel_id",
        "username": "channel_username",
        "fullName": "Channel Full Name",
        "avatar": "avatar_url",
        "subscribedAt": "2023-01-01T00:00:00.000Z"
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
  "message": "Subscribed channels fetched successfully",
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

- Results include basic information about each channel
- Results are paginated
- The `subscribedAt` field indicates when the user subscribed to the channel

---

## Get Channel Subscribers

```
GET /api/v1/subscriptions/channel/:channelId
```

Retrieves all subscribers of a specific channel.

### URL Parameters

| Parameter | Type   | Description          |
|-----------|--------|----------------------|
| channelId | String | ID of the channel    |

### Query Parameters

| Parameter | Type   | Default | Description                   |
|-----------|--------|---------|-------------------------------|
| page      | Number | 1       | Page number for pagination    |
| limit     | Number | 10      | Number of subscribers per page|

### Response

```json
{
  "statusCode": 200,
  "data": {
    "docs": [
      {
        "_id": "user_id",
        "username": "subscriber_username",
        "fullName": "Subscriber Full Name",
        "avatar": "avatar_url",
        "subscribedAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "totalDocs": 1000,
    "limit": 10,
    "totalPages": 100,
    "page": 1,
    "pagingCounter": 1,
    "hasPrevPage": false,
    "hasNextPage": true,
    "prevPage": null,
    "nextPage": 2
  },
  "message": "Channel subscribers fetched successfully",
  "success": true
}
```

### Error Responses

- **400 Bad Request**: 
  - If channelId is not provided
  - If channelId format is invalid
- **404 Not Found**: If the channel does not exist
- **500 Internal Server Error**: If there's a server error

### Notes

- Results include basic information about each subscriber
- Results are paginated
- The `subscribedAt` field indicates when each user subscribed to the channel

---

## Get Channel Subscribers Count

```
GET /api/v1/subscriptions/channel/:channelId/count
```

Retrieves the total number of subscribers for a specific channel.

### URL Parameters

| Parameter | Type   | Description          |
|-----------|--------|----------------------|
| channelId | String | ID of the channel    |

### Response

```json
{
  "statusCode": 200,
  "data": {
    "subscribersCount": 1000
  },
  "message": "Channel subscribers count fetched successfully",
  "success": true
}
```

### Error Responses

- **400 Bad Request**: 
  - If channelId is not provided
  - If channelId format is invalid
- **404 Not Found**: If the channel does not exist
- **500 Internal Server Error**: If there's a server error

### Notes

- This endpoint is optimized for quickly retrieving just the subscriber count
- Useful for displaying subscriber counts without needing the full subscriber list
