# Health Check API

The Health Check API provides a simple endpoint to verify the operational status of the API.

## Endpoints

- [Health Check](#health-check)

---

## Health Check

```
GET /api/v1/health-check
```

Checks if the API is operational.

### Response

```json
{
  "statusCode": 200,
  "data": {
    "status": "ok",
    "uptime": "1h 23m 45s",
    "timestamp": "2023-01-01T00:00:00.000Z"
  },
  "message": "Health check passed",
  "success": true
}
```

### Error Responses

- **500 Internal Server Error**: If there's a server issue

### Notes

- This endpoint can be used to monitor the health of the API
- It's useful for uptime monitoring services and load balancers
- No authentication is required for this endpoint
