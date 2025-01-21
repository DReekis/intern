
# **User Management System API**

A RESTful API for managing users, built with **Node.js**, **Express.js**, and **MongoDB**.

## **Features**
- User registration and login.
- View and update user profiles.
- Deactivate user accounts (soft delete).
- Admin can view all users.
- Secure password hashing and JWT-based authentication.

## **Setup Instructions**
1. **Install Prerequisites**:
   - Node.js
   - MongoDB
2. **Clone the Repository**:
   ```bash
   git clone <repository_url>
   cd <repository_folder>
   ```
3. **Install Dependencies**:
   ```bash
   npm install
   ```
4. **Set Environment Variables**:
   - Create a `.env` file with:
     ```plaintext
     PORT=3000
     MONGO_URI=<your_mongo_connection_string>
     JWT_SECRET=<your_jwt_secret>
     ```
5. **Start the Server**:
   ```bash
   node index.js
   ```
   Server will run at `http://localhost:3000`.

## **API Endpoints**
| Method | Endpoint             | Description                |
|--------|----------------------|----------------------------|
| POST   | `/api/user/register` | Register a new user        |
| POST   | `/api/user/login`    | Login and get a token      |
| GET    | `/api/user/profile`  | Get user profile (Auth)    |
| PUT    | `/api/user/profile`  | Update user profile (Auth) |
| DELETE | `/api/user/deactivate` | Deactivate user account (Auth) |
| GET    | `/api/admin/users`   | Get all users (Admin only) |

## **Postman Collection**
Import the provided Postman collection: [Postman Collection URL]
