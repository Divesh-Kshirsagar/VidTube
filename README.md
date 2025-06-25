# 🎬 VidTube - Your Personal Video & Tweet Hub! 🚀

## ✍️ Author: Divesh Sanjay Kshirsagar

👋 Hello there! I'm excited to share VidTube, a practice project inspired by the functionality of YouTube, built with industry-standard coding practices in mind. It's a platform where you can share videos 📹, upload thumbnails 🖼️, create playlists 🎞️, and even post short text updates similar to tweets 🐦!

## 🛠️ Built With:

* **Backend:** Node.js (v18+)
* **Framework:** Express.js 🌐
* **Database:** MongoDB 🍃
* **Cloud Media Storage:** Cloudinary ☁️
* **Authentication:** JWT (JSON Web Tokens) 🔑
* **Media Processing:** Fluent-FFMPEG 🎬
* **File Handling:** Multer 📁

## ✨ Features:

* **User Management:** 
  * Register and login with secure authentication 🔒
  * Customizable user profiles with avatars and cover images 👤
  * Channel pages to showcase user content 📺

* **Video Platform:**
  * Upload videos with custom thumbnails ⬆️
  * Efficiently stream videos using FFMPEG for optimized playback 🎞️
  * Video search, filtering, and sorting capabilities 🔍
  * View count tracking and analytics 📊

* **Social Features:**
  * Comment on videos with threaded replies �
  * Like/dislike videos and comments 👍👎
  * Subscribe to channels for updates 🔔
  * Post tweet-like updates for quick sharing 🐦

* **Content Organization:**
  * Create and manage playlists 📋
  * Watch history tracking 📜
  * Dynamic feed based on subscriptions 📱

* **API Architecture:**
  * RESTful API with comprehensive documentation �
  * Standardized response formats 📊
  * Error handling with descriptive messages ⚠️
  * Middleware for authentication and file processing �

## 🚀 Getting Started:

To run VidTube on your local machine, follow these steps:

1. **Clone the repository:**
    ```bash
    git clone <YOUR_REPOSITORY_URL>
    cd vidtube
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Set up your environment variables:**
    * Create a `.env` file in the root directory of the project.
    * Add the following environment variables:

        ```env
        # Server Configuration
        PORT=8000                           # Your preferred port
        CORS_ORIGIN=*                       # CORS settings

        # Database Configuration
        MONGODB_URI=mongodb://localhost:27017/vidtube   # Your MongoDB connection string

        # Authentication
        ACCESS_TOKEN_SECRET=your-access-token-secret    # JWT secret for access tokens
        ACCESS_TOKEN_EXPIRY=1d                          # Access token expiry
        REFRESH_TOKEN_SECRET=your-refresh-token-secret  # JWT secret for refresh tokens
        REFRESH_TOKEN_EXPIRY=10d                        # Refresh token expiry

        # Cloudinary Configuration
        CLOUDINARY_CLOUD_NAME=your-cloud-name           # Cloudinary cloud name
        CLOUDINARY_API_KEY=your-api-key                 # Cloudinary API key
        CLOUDINARY_API_SECRET=your-api-secret           # Cloudinary API secret
        ```

4. **Run the development server:**
    ```bash
    npm run dev
    ```

    This will start the server with nodemon, and you should be able to access the application at `http://localhost:8000`.

5. **Production deployment:**
    ```bash
    npm start
    ```

## 📡 API Reference:

VidTube provides a comprehensive RESTful API with the following main resources:

* **Users**: Registration, authentication, profile management
* **Videos**: Upload, stream, search, and manage videos
* **Comments**: Create and manage comments on videos
* **Likes**: Like/dislike functionality for videos and comments
* **Playlists**: Create and manage collections of videos
* **Subscriptions**: Subscribe to channels/users
* **Tweets**: Post and manage short text updates

Full API documentation is available in the [api-documentation](./api-documentation/index.md) directory.

### Base URL

```
http://localhost:8000/api/v1
```

### Authentication

Most endpoints require authentication using JWT. Include the token in the Authorization header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

## � Testing:

Currently, manual testing is used for the API endpoints. You can use tools like Postman or Insomnia to test the API endpoints according to the documentation.

## 🔧 Project Structure:

```
src/
├── app.js                 # Express app configuration
├── constants.js           # Application constants
├── index.js               # Application entry point
├── controllers/           # Request handlers
├── db/                    # Database connection
├── middlewares/           # Custom middleware
│   ├── auth.middleware.js # Authentication middleware
│   ├── error.middleware.js# Error handling middleware
│   └── multer.middleware.js# File upload middleware
├── models/                # Mongoose models
├── routes/                # API routes
└── utils/                 # Utility functions
    ├── ApiError.js        # Custom error handling
    ├── ApiResponse.js     # Standardized API responses
    ├── asyncHandler.js    # Async function wrapper
    └── cloudinary.js      # Cloudinary configuration
```

## 🤝 Contributing:

Contributions to improve VidTube are welcome! Here's how you can contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines:
- Ensure your code follows the project's coding style
- Add appropriate comments to your code
- Update documentation as needed
- Write meaningful commit messages

## 📜 License:

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC)

## 🎉 Acknowledgements:

- This project was inspired by YouTube's functionality and architecture
- Thanks to all the open-source libraries and tools that made this project possible
- Special appreciation for MongoDB, Express, and Node.js communities

-----

Thank you for checking out VidTube! Feel free to explore the API documentation and code structure. If you have any questions or feedback, please open an issue on the repository. Happy coding! 👨‍💻🚀