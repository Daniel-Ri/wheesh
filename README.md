# wheesh

## How to Setup

### Server

1. Create `uploads` folder on `server` folder
2. Copy these files from `backupPics` to `public` folder
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
3. Setup `.env` file
   ```
   PORT=<PORT>
   JWT_SECRET=<JWT_SECRET>
   USERNAME_NODEMAILER=<EMAIL_THAT_IS_SET_TO_SEND_EMAIL>
   PASSWORD_NODEMAILER=<PASSWORD_EMAIL_FOR_SEND_EMAIL>
   ```

4. Setup the database
   ```
   npx sequelize-cli db:drop
   npx sequelize-cli db:create
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```

### Client

No need to setup anything, but if the style of the website is weird, try to delete the local storage of the website (`localhost:3000`) to reset the theme to be `light`.

## How to run

### Server

1. Run the redis-server

2. Run the backend
   ```
   npm run dev
   ```

### Client

```
npm start
```

## How to test

### Server

1. Setup the database first (no need to repeat this step after migrate the **test** database)
   ```
   npx sequelize-cli db:drop --env test
   npx sequelize-cli db:create --env test
   npx sequelize-cli db:migrate --env test
   ```

2. Run the test
   ```
   npm run test
   ```

### Client

```
npm run test
```