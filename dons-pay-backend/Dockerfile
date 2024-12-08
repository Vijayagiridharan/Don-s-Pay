# Build Stage
FROM maven:3-eclipse-temurin-17 AS build
WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src
RUN mvn clean package -DskipTests

# Runtime Stage
FROM eclipse-temurin:17-alpine
WORKDIR /app

# Copy the packaged jar
COPY --from=build /app/target/dons-pay-backend-0.0.1-SNAPSHOT.jar app.jar

# Expose the application's port
EXPOSE 8080

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Environment variables for database configuration
ENV SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/DonsPayDB \
    SPRING_DATASOURCE_USERNAME=root \
    SPRING_DATASOURCE_PASSWORD=password

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]

# Optional: Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s \
  CMD curl --fail http://localhost:8080/actuator/health || exit 1
