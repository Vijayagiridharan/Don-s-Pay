# Don's Pay Backend

This repository contains the backend for the Don's Pay project, developed using Java Spring Boot. The backend handles user authentication and registration and integrates with a MySQL database.

## Features
- User registration and login functionality.
- Password encryption using BCrypt.
- Integration with MySQL database.
- Secure authentication with Spring Security.

## Prerequisites
- Java 17 or higher.
- MySQL database server.
- Maven (for dependency management).

## Setup and Configuration

### 1. Clone the Repository
```bash
git clone https://github.com/Vijayagiridharan/Don-s-Pay.git
cd dons-pay-backend
```

### 2. Configure the Database
Create a MySQL database named `user_transactions_db`. Use the following credentials:

- **URL:** `jdbc:mysql://localhost:3306/user_transactions_db`
- **Username:** `Donspay`
- **Password:** `donspay@123`

Alternatively, update the database configuration in `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/user_transactions_db
spring.datasource.username=Donspay
spring.datasource.password=donspay@123
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### 3. Build and Run the Application
Use Maven to build and run the application:
```bash
mvn clean install
mvn spring-boot:run
```

### 4. Test the Endpoints
#### **Login Endpoint**
- **URL:** `POST /api/auth/login`
- **Request Body:**
  ```json
  {
    "email": "testuser@example.com",
    "password": "securepassword"
  }
  ```
- **Response:**
  - Success: `200 OK`
    ```json
    {
      "message": "Login successful for user: testuser@example.com"
    }
    ```
  - Failure: `401 Unauthorized` or other relevant error messages.

#### **Register Endpoint** (Optional)
- **URL:** `POST /api/auth/register`
- **Request Body:**
  ```json
  {
    "email": "testuser@example.com",
    "password": "securepassword"
  }
  ```
- **Response:**
  - Success: `201 Created`
    ```json
    {
      "message": "User registered successfully"
    }
    ```

### 5. Verify Database Records
Use a MySQL client or GUI to verify that users are stored in the `users` table with encrypted passwords.

## File Structure
- `src/main/java/com/acs560/dons_pay_backend`
  - `entity/User.java` - User entity class mapped to the database.
  - `repository/UserRepository.java` - Interface for database operations.
  - `service/AuthService.java` - Handles authentication logic.
  - `controller/AuthController.java` - REST controller for authentication endpoints.
  - `DonsPayBackendApplication.java` - Main Spring Boot application file.

## Troubleshooting
1. **Database Connection Issues:**
   - Ensure MySQL is running and accessible.
   - Verify database credentials in `application.properties`.

2. **Invalid Credentials:**
   - Ensure the password is correctly hashed during registration.
   - Use `BCryptPasswordEncoder` to verify passwords.

3. **Spring Security Configuration:**
   - Verify the `/api/auth/login` endpoint is allowed without prior authentication.

## Future Enhancements
- Add user roles and permissions.
- Integrate JWT for session management.
- Implement additional endpoints for transaction management.

## License
This project is licensed under the MIT License.

## Contact
For further assistance, contact [Anshul Abrol](mailto:abroa01@pfw.edu).
