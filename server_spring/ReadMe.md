# Server - Spring Boot & PostgreSQL

## How to Setup

1. Create the `images` folder in `src/main/resources`
2. Copy these files from `backup` to `images` folder
   ```
   Frame 1 - Desktop.png
   Frame 1 - Mobile.png
   Frame 2 - Desktop.png
   Frame 2 - Mobile.png
   Frame 3 - Desktop.png
   Frame 3 - Mobile.png
   Frame 4 - Desktop.png
   Frame 4 - Mobile.png
   Frame 5 - Desktop.png
   Frame 5 - Mobile.png
   ```
3. Make sure the PostgreSQL is installed
4. Create the database for development and testing in PostgreSQL
5. Setup `.env` file
   ```
   JWT_SECRET=<JWT_SECRET>
   CRYPTO_KEY=  // It's okay if empty (it should be deleted)
   USERNAME_NODEMAILER=<EMAIL_THAT_IS_SET_TO_SEND_EMAIL>
   PASSWORD_NODEMAILER=<PASSWORD_EMAIL_FOR_SEND_EMAIL>
   DATABASE_DEV_URL=jdbc:postgresql://localhost:5432/DB_DEV_NAME?user=USER&password=PASSWORD
   DATABASE_TEST_URL=jdbc:postgresql://localhost:5432/DB_TEST_NAME?user=USER&password=PASSWORD
   DATABASE_PROD_URL=<DATABASE_PROD_URL>   // It's okay to be empty if not running in production mode
   ```

## How to Run

You can use IntelliJ to run the main application or use `mnvw`.  
Example of using `mvnw`:
```
./mvnw spring-boot:run
```

## How to Test

You can use IntelliJ to run the testing or use `mvnw`.
Example of using `mvnw`:
```
./mvnw test
```


