# Weather API Wrapper Service

This project is a Wrapper Service for the Weather API, built using Node.js for the backend and React for the frontend. It includes authentication with JWT, password hashing with bcrypt, and OAuth authentication using GitHub. SQLite3 is used as the database for storing user data.

## Technologies Used

- **Backend**: Node.js, Express
- **Frontend**: React
- **Authentication**: JWT, bcrypt, OAuth (GitHub)
- **Weather API**: [WeatherAPI](https://www.weatherapi.com/my/)
- **Database**: SQLite3
- **Docker**: Used for containerizing the project

## Features

- **User Authentication**:
  - User registration and login with secure passwords using bcrypt.
  - Authentication using JSON Web Tokens (JWT) to protect API routes.
  - Login with GitHub using OAuth for easy access.
- **Weather Information**:
  - Fetch weather data for any city using the WeatherAPI.
  - User-friendly interface in React for users to check the weather.

## Running the Project

### Requirements

- Node.js (v14+)
- Docker
- Account on [WeatherAPI](https://www.weatherapi.com/) to get the API key
- GitHub account to configure OAuth

### Backend

1. Clone the repository and navigate to the backend folder:

   ```bash
   git clone https://github.com/oondels/weather-service.git
   cd weather-backend
   ```

2. Install backend dependencies:

   ```bash
   cd server/
   npm install
   ```

3. Create a `.env` file in the root of the backend and add the following environment variables:

   ```env
   WEATHER_API_KEY=your_weatherapi_key
   PORT=5000
   JWT_SECRET=your_secret_key
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   EMAIL=your_email
   PASS=your_email_app_pass
   HOST_MAIL="smtp.gmail.com" -> for gmail accounts
   HOST_PORT=465
   ```

4. Create the database:

   ```sql
   CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      username TEXT NOT NULL,
      password TEXT,
      user_github INTEGER,
      account_validation BOOLEAN,
      created_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP),
      updated_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
   );
   ```

5. Run the backend locally:
   ```bash
   npm run dev
   ```

### Frontend

1. Navigate to the frontend folder:

   ```bash
   cd ../client
   ```

2. Install frontend dependencies:

   ```bash
   npm install
   ```

3. Run the frontend locally:
   ```bash
   npm start
   ```

### Docker

1. To build the Docker images for both backend and frontend, from the project root:
   ```bash
   docker-compose up --build
   ```
2. The application will be accessible at `http://localhost:3000` (frontend) and the backend at `http://localhost:5000`.

## Authentication Flow

- **Register/Login with Password**: Users can register or log in using email and password. Passwords are hashed using bcrypt, and a JWT is generated to authenticate the user.
- **Login with GitHub**: Users can log in using their GitHub account. OAuth is used to authorize the user and generate a JWT.

## API Endpoints

- **POST /api/register**: Registers a new user.
- **POST /api/login**: Authenticates the user and returns a JWT.
- **GET /api/weather**: Retrieves weather information for the specified city.

## Project Structure

- **weather-backend**: Contains backend code (Node.js).
- **weather-frontend**: Contains frontend code (React).
- **docker-compose.yml**: Configures and runs both services using Docker.

## Contribution

Feel free to open issues and pull requests to contribute to improvements.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
