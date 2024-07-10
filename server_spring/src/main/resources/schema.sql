-- Drop tables if they exist
DROP TABLE IF EXISTS "Banners";
DROP TABLE IF EXISTS "Payments";
DROP TABLE IF EXISTS "OrderedSeats";
DROP TABLE IF EXISTS "Orders";
DROP TABLE IF EXISTS "Seats";
DROP TABLE IF EXISTS "Carriages";
DROP TABLE IF EXISTS "SchedulePrices";
DROP TABLE IF EXISTS "Schedules";
DROP TABLE IF EXISTS "Trains";
DROP TABLE IF EXISTS "ScheduleDays";
DROP TABLE IF EXISTS "Stations";
DROP TABLE IF EXISTS "EmailTokens";
DROP TABLE IF EXISTS "Passengers";
DROP TABLE IF EXISTS "Users";

-- Create users table
CREATE TABLE "Users" (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL DEFAULT 'user',
  email VARCHAR(255) NOT NULL,
  "createdAt" TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL,
  UNIQUE (username),
  UNIQUE (email)
);

-- Create passengers table
CREATE TABLE "Passengers" (
  id SERIAL PRIMARY KEY,
  "userId" INT NOT NULL,
  "isUser" BOOLEAN NOT NULL,
  gender VARCHAR(255) NOT NULL,
  "dateOfBirth" DATE NOT NULL,
  "idCard" VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  "createdAt" TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "Users" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create emailtokens table
CREATE TABLE "EmailTokens" (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL,
  "expiredAt" TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL,
  UNIQUE (email)
);

-- Create stations table
CREATE TABLE "Stations" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  "createdAt" TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL,
  UNIQUE (name)
);

-- Create scheduledays table
CREATE TABLE "ScheduleDays" (
  id SERIAL PRIMARY KEY,
  "departureStationId" INT NOT NULL,
  "arrivalStationId" INT NOT NULL,
  "departureTime" TIME NOT NULL,
  "arrivalTime" TIME NOT NULL,
  "createdAt" TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL,
  FOREIGN KEY ("departureStationId") REFERENCES "Stations" (id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("arrivalStationId") REFERENCES "Stations" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create trains table
CREATE TABLE "Trains" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  "createdAt" TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL,
  UNIQUE (name)
);

-- Create schedules table
CREATE TABLE "Schedules" (
  id SERIAL PRIMARY KEY,
  "trainId" INT NOT NULL,
  "departureStationId" INT NOT NULL,
  "arrivalStationId" INT NOT NULL,
  "departureTime" TIMESTAMP NOT NULL,
  "arrivalTime" TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL,
  FOREIGN KEY ("trainId") REFERENCES "Trains" (id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("departureStationId") REFERENCES "Stations" (id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("arrivalStationId") REFERENCES "Stations" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create scheduleprices table
CREATE TABLE "SchedulePrices" (
  id SERIAL PRIMARY KEY,
  "scheduleId" INT NOT NULL,
  "seatClass" VARCHAR(255) NOT NULL,
  price INT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL,
  FOREIGN KEY ("scheduleId") REFERENCES "Schedules" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create carriages table
CREATE TABLE "Carriages" (
  id SERIAL PRIMARY KEY,
  "trainId" INT,
  "carriageNumber" INT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL,
  FOREIGN KEY ("trainId") REFERENCES "Trains" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create seats table
CREATE TABLE "Seats" (
  id SERIAL PRIMARY KEY,
  "carriageId" INT,
  "seatNumber" VARCHAR(255) NOT NULL,
  "seatClass" VARCHAR(255) NOT NULL,
  "createdAt" TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL,
  FOREIGN KEY ("carriageId") REFERENCES "Carriages" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create orders table
CREATE TABLE "Orders" (
  id SERIAL PRIMARY KEY,
  "userId" INT NOT NULL,
  "scheduleId" INT NOT NULL,
  "isNotified" BOOLEAN DEFAULT FALSE,
  "createdAt" TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "Users" (id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("scheduleId") REFERENCES "Schedules" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create orderedseats table
CREATE TABLE "OrderedSeats" (
  id SERIAL PRIMARY KEY,
  "orderId" INT NOT NULL,
  "seatId" INT NOT NULL,
  price INT NOT NULL,
  gender VARCHAR(255) NOT NULL,
  "dateOfBirth" DATE NOT NULL,
  "idCard" VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  secret VARCHAR(255) NOT NULL,
  "createdAt" TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL,
  FOREIGN KEY ("orderId") REFERENCES "Orders" (id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("seatId") REFERENCES "Seats" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create payments table
CREATE TABLE "Payments" (
  id SERIAL PRIMARY KEY,
  "orderId" INT NOT NULL,
  amount INT NOT NULL,
  "isPaid" BOOLEAN NOT NULL,
  "duePayment" TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL,
  FOREIGN KEY ("orderId") REFERENCES "Orders" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create banners table
CREATE TABLE "Banners" (
  id SERIAL PRIMARY KEY,
  "imageDesktop" VARCHAR(255) NOT NULL,
  "imageMobile" VARCHAR(255) NOT NULL,
  "createdAt" TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL
);
