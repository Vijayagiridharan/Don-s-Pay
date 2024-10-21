
```
# Development Environment Setup for Don's Pay

## Prerequisites
Before setting up the project, make sure you have the following installed:
- **Java JDK 17**
- **Apache Maven**
- **Node.js** and **npm**
- **Physical Device** (Android or iOS) for testing

## Backend Setup (Spring Boot)
1. **Clone the Backend Repository**:
   ```bash
   git clone <backend-repository-url>
   ```
2. **Navigate to the Backend Folder**:
   ```bash
   cd dons-pay-backend
   ```
3. **Install Dependencies and Run the Application**:
   - Make sure Maven is installed and run the application:
     ```bash
     mvn clean install
     mvn spring-boot:run
     ```
   - The Spring Boot application will start on `http://localhost:8080`.

4. **Note**: If you're developing without a database (temporary setup), ensure the `DataSourceAutoConfiguration` is excluded in your Spring Boot application (`DonsPayBackendApplication.java`).

## Frontend Setup (React Native)
1. **Clone the Frontend Repository**:
   ```bash
   git clone <frontend-repository-url>
   ```
2. **Navigate to the Frontend Folder**:
   ```bash
   cd DonsPayApp
   ```
3. **Install Dependencies**:
   ```bash
   npm install
   ```

## Running the App on a Physical Device

### For Android Devices
1. **Enable Developer Mode** on your Android device:
   - Go to **Settings** > **About phone** and tap on **Build number** 7 times until you see "You are now a developer!"
2. **Enable USB Debugging**:
   - Go back to **Settings** > **System** > **Developer options** and enable **USB Debugging**.
3. **Connect your device** to your computer via USB and allow access when prompted.
4. **Run the Application**:
   ```bash
   npx react-native run-android
   ```

## Version Control
1. **Branching Strategy**:
   - Following the branching strategy using feature branches for each task (e.g., `feature/setup-environment`).
2. **Create a New Branch**:
   ```bash
   git checkout -b feature/setup-environment
   ```
3. **Commit and Push Changes**:
   ```bash
   git add .
   git commit -m "Set up development environment"
   git push origin feature/setup-environment
   ```

## Notes
- If you encounter any issues during setup or running the application, consult the [React Native documentation](https://reactnative.dev/docs/environment-setup) or [Spring Boot documentation](https://spring.io/projects/spring-boot) for further troubleshooting.

## Additional Resources
- **Postman**: Useful for testing API endpoints of the Spring Boot backend.
- **VS Code** or **WebStorm**: Recommended editors for working on the React Native frontend.

By following these steps, you will have a fully set up development environment for both the backend and frontend. Ensure you have all the prerequisites installed and configured for a seamless development experience.
```
