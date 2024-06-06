# SupChat Backend

SupChat is a messaging application that allows users to send messages to each other and customize their user profiles. This repository contains the back-end code for the SupChat application.

## Features

- User authentication and authorization using JWT
- Endpoints for managing user profiles
- Endpoints for sending and receiving messages
- MongoDB for database management

## Technologies Used

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (jsonwebtoken)
- bcrypt
- CORS

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (v12 or higher)
- npm (v6 or higher) or yarn
- MongoDB (local instance or MongoDB Atlas)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/supchat-backend.git
   ```

2. Navigate to the project directory:

   ```bash
   cd supchat-backend
   ```

3. Install the dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

### Environment Variables

Create a `.env` file in the root directory and add the following variables:

```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Running the Application

To run the application locally, use the following command:

```bash
npm start
# or
yarn start
```

The server will start and listen on the port specified in the `.env` file. By default, it will be available at `http://localhost:5000`.

### API Endpoints

The following are the main API endpoints available in this application:

- **User Registration:** `POST /api/users/register`
- **User Login:** `POST /api/users/login`
- **Get User Profile:** `GET /api/users/:id`
- **Update User Profile:** `PUT /api/users/:id`
- **Get Conversations:** `GET /api/conversations`
- **Create Conversation:** `POST /api/conversations`
- **Delete Conversation:** `DELETE /api/conversations/:id`
- **Get Messages:** `GET /api/messages/:conversationId`
- **Send Message:** `POST /api/messages`

### Deployment

This project can be deployed using any hosting service that supports Node.js applications. Here is a basic deployment guide for Fly.io:

1. Install the Fly CLI and log in:

   ```bash
   flyctl auth login
   ```

2. Initialize a new Fly application:

   ```bash
   flyctl launch
   ```

3. Deploy the application:

   ```bash
   flyctl deploy
   ```

Ensure that the environment variables are set in your Fly.io application settings.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## License

This project is licensed under the MIT License.

