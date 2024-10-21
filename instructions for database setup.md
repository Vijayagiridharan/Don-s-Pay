# Implementation Guide for Setting Up MySQL

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Setting Up MySQL](#setting-up-mysql)
3. [Creating the Database and Tables](#creating-the-database-and-tables)
4. [Seeding the Database with Sample Data](#seeding-the-database-with-sample-data)
5. [Connecting MySQL to Spring Boot Application](#connecting-mysql-to-spring-boot-application)
6. [Testing the Database and Application](#testing-the-database-and-application)

---

## Prerequisites
- MySQL Server installed and running.
- MySQL Workbench or any MySQL client to execute SQL commands.
- Spring Boot application set up with Maven.

## Setting Up MySQL
1. **Open MySQL Command Line or Workbench.**
2. **Login with your MySQL credentials:**
   ```bash
   mysql -u your_username -p
   ```

## Creating the Database and Tables

### 1. Create Database
```sql
CREATE DATABASE user_transactions_db;
USE user_transactions_db;
```

### 2. Create Users Table
```sql
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    don_dollars_balance DECIMAL(10, 2) DEFAULT 0,
    meal_swipes_balance INT DEFAULT 0
);
```

### 3. Create Transactions Table
```sql
CREATE TABLE Transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    amount DECIMAL(10, 2) NOT NULL,
    type ENUM('Don Dollars', 'Meal Swipes') NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);
```

## Seeding the Database with Sample Data
Create a file named `data.sql` in the `src/main/resources` directory of your Spring Boot project and add the following SQL statements:

```sql
INSERT INTO Users (name, student_id, email, don_dollars_balance, meal_swipes_balance) 
VALUES 
('Alice Johnson', 'S12347', 'alice.johnson@example.com', 120.50, 15),
('Bob Brown', 'S12348', 'bob.brown@example.com', 80.00, 8);

INSERT INTO Transactions (user_id, amount, type) 
VALUES 
(1, 15.00, 'Don Dollars'), 
(2, 7.00, 'Meal Swipes'),
(1, 5.50, 'Don Dollars');
```

## Connecting MySQL to Spring Boot Application
1. Open the `application.properties` (or `application.yml`) file in your Spring Boot application and add the following configuration:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/user_transactions_db
spring.datasource.username=Donspay
spring.datasource.password=donspay@123
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update
```

2. Ensure that the MySQL connector dependency is added to your `pom.xml`:

```xml
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <scope>runtime</scope>
</dependency>
```

## Testing the Database and Application
1. **Start your Spring Boot application.**
2. **Verify Database Connection:**
   - Access any SQL client and run the following queries to check if data has been inserted correctly:
   
   ### Check Data in `Users` Table
   ```sql
   SELECT * FROM Users;
   ```

   ### Check Data in `Transactions` Table
   ```sql
   SELECT * FROM Transactions;
   ```

3. **Test REST Endpoints:**
   - Create endpoints in your Spring Boot application to fetch users and transactions.
   - Use Postman or a web browser to test the endpoints.

   ### Example Endpoint to Get Users
   ```
   GET http://localhost:8080/api/users
   ```

   ### Example Endpoint to Get Transactions
   ```
   GET http://localhost:8080/api/transactions
   ```

4. **Confirm Expected Responses:**
   - Ensure that the responses from the endpoints match the sample data you seeded in the database.

## Conclusion
Following these procedures will set up MySQL for your application, create the necessary database structure, and seed it with sample data for development and testing purposes.
```

