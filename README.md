# Personal Task Manager API
> NOTICE! this doesn't use cookies currently so use is only from postman using bearer token
## Description
This API is designed to help individuals manage their personal tasks. It is built with Node.js and MongoDB and allows users to perform CRUD operations on their tasks.

## Features
- User authentication with JWT
- CRUD operations for task management
- Task categorization for better organization (those are shared as of now)

## Installation

Before installing, make sure you have Node.js and MongoDB installed on your system.

```bash
git clone https://github.com/icestorm8/personal-task-manager-api
cd personal-task-manager-api
npm install
```
Configuration
Create a .env file in the root directory and add the following variables:

```.env
PORT=3000
MONGO_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>
MONGO_DB_NAME=<your_mongodb_db_name>
```

## Usage
> to start the server:
> ``` node.js
> npm start // to starrt the server
> npm run dev // for dev mode
> npm run resetDB // for clearing the db collections
> ```

### API Endpoints
#### Public Endpoints
User endpoints
- POST /api/users/register - Register a new user
- POST /api/users/login - Login an existing user
#### Protected Endpoints
User endpoints
- GET /api/users/profile - Retrieve the current user’s profile
- PATCH /api/users/profile - Update the current user’s profile
- DELETE /api/users/profile - Delete the current user’s profile
  
Task Endpoints
- POST /api/tasks - Create a new task
- GET /api/tasks - Retrieve all tasks
- GET /api/tasks/:id - Retrieve a task by ID
- PATCH /api/tasks/:id - Update a task
- DELETE /api/tasks/:id - Delete a task
  
Category Endpoints
- POST /api/categories - Create a new category
- GET /api/categories - Retrieve all categories
- GET /api/categories/:id - Retrieve a category by ID
- PATCH /api/categories/:id - Update a category
- DELETE /api/categories/:id - Delete a category
