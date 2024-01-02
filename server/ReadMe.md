# API Documentation

## Crypto

I create 4 files that help encryption and decryption for readers.

1. genEncryption.js  
   Create encryption of text  
   How to Use:  
   `node genEncryption.js <text>`

2. genDecryption.js  
   Create decryption of text  
   How to Use:  
   `node genDecryption.js <encrypted_text>`

3. genObjectEncryption.js  
   Create encryption of object (in file)  
   How to Use:  
   `node genObjectEncryption.js <file_path>`  
   Example:  
   `node genObjectEncryption.js ./demo.js`

4. genObjectDecryption.js  
   Create decryption of text into object  
   How to Use:  
   `node genObjectDecryption.js <encrypted_text>`

## URL

_Server_
```
http://localhost:3300/api
```
---

## Global Response

_Response (500 - Internal Server Error)_
```
{
  "message": "Internal Server Error"
}
```

_Response (400 - Authentication)_
```
{
  "message": "Authentication failed, you need token"
}
```

_Response (400 - Invalid Token)_
```
{
  "message": "Token is invalid",
}
```

_Response (404 - API Not Found)_
```
{
  "message": "API not found",
}
```

## RESTful endpoints

### Hello World

#### GET /

> Test an endpoint

_Request Header_
```
not needed
```

_Request Body_
```
not needed
```

_Response (200)_
```
Hello, wheesh's client!
```

---

### Public Images

#### GET /public/:imagePath

> Get an image

_Request Header_
```
not needed
```

_Request Params_
```
/<imagePath>
```

_Request Body_
```
not needed
```

_Response (200)_
```
<image>
```

---

### User

#### POST /user/login

> Login

_Request Header_
```
not needed
```

_Request Body_
```
{
  "encryptedObj": <encryptedObj>
}
```

Note: `encryptedObj` is the encryption text that contains
```
{
  "usernameOrEmail": <username_or_email>,
  "password": <password>
}
```

_Response (200)_
```
{
  "token": <jwt.token>,
  "user": <encrypted_user>,
  "status": "Success"
}
```

Note: `encryptedUser` is the encryption text that contains
```
{
  "id": <id>,
  "username": <username>,
  "email": <email>,
  "role": <role>
}
```

_Response (400 - Username / email or Password Invalid)_
```
{
  "message": "Username / email or password is invalid"
}
```

---

#### POST /user/register

> Register

_Request Header_
```
not needed
```

_Request Body_
```
{
  "encryptedObj": <encryptedObj>
}
```

Note: `encryptedObj` is the encryption text that contains
```
{
  "username": <username>,
  "password": <password>,
  "gender": <gender>,          // 'Male' or 'Female'
  "dateOfBirth": <dateOfBirth, // 'yyyy-mm-dd' (at least 17 years old)
  "idCard": <idCard>,          // 'Indonesia ID Card'
  "name": <name>,
  "email": <email>,
  "emailToken": <emailToken>   // gotten from email after send request `sendEmailToken`
}
```

_Response (201)_
```
{
  "data": <encryptedData>,
  "status": "Success"
}
```

Note: `encryptedData` is the encryption text that contains
```
{
  "id": <userId>,
  "username": <username>,
  "role": <role>,
  "email": <email>,
  "Passengers": [
    {
      "id": <passengerId>,
      "userId": <userId>,
      "isUser": true,
      "gender": <gender>,
      "dateOfBirth": <dateOfBirth>,
      "idCard": <idCard>,
      "name": <name>,
      "email": <email>
    }
  ]
}
```

_Response (400 - Validation Error)_
```
{
  "status": "Validation Failed",
  "message": <message>
}
```

_Response (400 - Username Already Exist)_
```
{
  "message": "Username already exist!"
}
```

_Response (400 - Email Token is Expired or Invalid)_
```
{
  "message": "Email token is expired or invalid!"
}
```

---

#### POST /user/sendEmailToken

> Send email token

_Request Header_
```
not needed
```

_Request Body_
```
{
  "email": <email>,   // not registered email
  "action": <action>  // 'create' or 'update'
}
```

_Response (200)_
```
{
  "message": "Email sent successfully"
}
```

_Response (400 - Validation Error)_
```
{
  "status": "Validation Failed",
  "message": <message>
}
```

_Response (400 - Email Already Exist)_
```
{
  "message": "Email already exist!"
}
```

---

#### POST /user/verifyToken

> Verify the token

_Request Header_
```
{
  "authorization": "Bearer <token>"
}
```

_Request Body_
```
not needed
```

_Response (200)_
```
{
  "status": "Success"
}
```

---

#### GET /user

> Get profile

_Request Header_
```
{
  "authorization": "Bearer <token>"
}
```

_Request Body_
```
not needed
```

_Response (200)_
```
{
  "data": {
    "id": <userId>,
    "username": <username>,
    "role": <role>,
    "email": <email>,
    "Passengers": [
      {
        "id": <passengerId>,
        "userId": <userId>,
        "isUser": true,
        "gender": <gender>,
        "dateOfBirth": <dateOfBirth>,
        "idCard": <idCard>,
        "name": <name>,
        "email": <email>
      }
    ]
  },
  "status": "Success"
}
```

---

#### PUT /user

> Change profile

_Request Header_
```
{
  "authorization": "Bearer <token>"
}
```

_Request Body_
```
{
  "username": <username>,      // optional
  "gender": <gender>,          // 'Male' or 'Female' (optional)
  "dateOfBirth": <dateOfBirth, // 'yyyy-mm-dd' (at least 17 years old) (optional)
  "idCard": <idCard>,          // 'Indonesia ID Card' (optional)
  "name": <name>               // optional
}
```

_Response (200)_
```
{
  "data": {
    "id": <userId>,
    "username": <username>,
    "email": <email>,
    "role": <role>
  },
  "status": "Success"
}
```

_Response (400 - Validation Error)_
```
{
  "status": "Validation Failed",
  "message": <message>
}
```

_Response (400 - Username Already Exist)_
```
{
  "message": "Username already exist!"
}
```

---

#### PUT /user/changePassword

> Change user's password

_Request Header_
```
{
  "authorization": "Bearer <token>"
}
```

_Request Body_
```
{
  "oldPassword": <oldPassword>,
  "newPassword": <newPassword>
}
```

_Response (200)_
```
{
  "message": "Change password successfully"
}
```

_Response (400 - Validation Error)_
```
{
  "status": "Validation Failed",
  "message": <message>
}
```

_Response (400 - Invalid Old Password)_
```
{
  "message": "Invalid old password"
}
```

---

#### PUT /user/changeEmail

> Change user's email

_Request Header_
```
{
  "authorization": "Bearer <token>"
}
```

_Request Body_
```
{
  "email": <email>,           // not registered email
  "emailToken": <emailToken>, // gotten from email after send request `sendEmailToken`
}
```

_Response (200)_
```
{
  "data": {
    "id": <userId>,
    "username": <username>,
    "email": <email>,
    "role": <role>
  },
  "status": "Success"
}
```

_Response (400 - Validation Error)_
```
{
  "status": "Validation Failed",
  "message": <message>
}
```

_Response (400 - Email Token is Expired or Invalid)_
```
{
  "message": "Email token is expired or invalid!"
}
```

---

### Passenger

#### GET /passenger

> Get user's passengers

_Request Header_
```
{
  "authorization": "Bearer <token>"
}
```

_Request Body_
```
not needed
```

_Response (200)_
```
{
  "data": [
    {
      "id": <passengerId>,
      "userId": <userId>,
      "isUser": <isUser>,
      "gender": <gender>,
      "dateOfBirth": <dateOfBirth>,
      "idCard": <idCard>,
      "name": <name>,
      "email": <email>
    },
    ...<sameObject>
  ],
  "status": "Success"
}
```

---

#### GET /passenger/:passengerId

> Get passenger data (can only fetch user's passenger data)

_Request Header_
```
{
  "authorization": "Bearer <token>"
}
```

_Request Params_
```
/<passengerId>
```

_Request Body_
```
not needed
```

_Response (200)_
```
{
  "data": {
    "id": <passengerId>,
    "userId": <userId>,
    "isUser": <isUser>,
    "gender": <gender>,
    "dateOfBirth": <dateOfBirth>,
    "idCard": <idCard>,
    "name": <name>,
    "email": <email>
  },
  "status": "Success"
}
```

_Response (404 - Passenger Not Found)_
```
{
  "message": "Passenger Not Found"
}
```

_Response (400 - Not Authorized)_
```
{
  "message": "Not Authorized"
}
```

---

#### POST /passenger

> Create passenger (maximum passengers can be added: 15 (including the user))

_Request Header_
```
{
  "authorization": "Bearer <token>"
}
```

_Request Body_
```
{
  "gender": <gender>,           // 'Male' or 'Female'
  "dateOfBirth": <dateOfBirth>, // 'yyyy-mm-dd' (at least 17 years old)
  "idCard": <idCard>,           // 'Indonesia ID Card' (unique in user's passengers)
  "name": <name>,       
  "email": <email>              // optional
}
```

_Response (201)_
```
{
  "data": {
    "id": <passengerId>,
    "gender": <gender>,
    "dateOfBirth": <dateOfBirth>,
    "idCard": <idCard>,
    "name": <name>,
    "email": <email>,
    "userId": <userId>,
    "isUser": false,
    "updatedAt": <updatedAt>,
    "createdAt": <createdAt>
  },
  "status": "Success"
}
```

_Response (400 - Validation Error)_
```
{
  "status": "Validation Failed",
  "message": <message>
}
```

_Response (400 - Already Added Passenger's ID Card)_
```
{
  "message": "You have already added this ID Card"
}
```

_Response (400 - Reach Limit)_
```
{
  "message": "You have reached the limit of creating passengers"
}
```

---

#### PUT /passenger/:passengerId

> Update the user's passenger (cannot be done by other user and cannot update self data (where `isUser` is true))

_Request Header_
```
{
  "authorization": "Bearer <token>"
}
```

_Request Params_
```
/<passengerId>
```

_Request Body_
```
{
  "gender": <gender>,           // 'Male' or 'Female' (optional)
  "dateOfBirth": <dateOfBirth>, // 'yyyy-mm-dd' (at least 17 years old) (optional)
  "idCard": <idCard>,           // 'Indonesia ID Card' (unique in user's passengers) (optional)
  "name": <name>,               // optional
  "email": <email>              // optional
}
```

_Response (200)_
```
{
  "data": {
    "id": <passengerId>,
    "userId": <userId>,
    "isUser": false,
    "gender": <gender>,
    "dateOfBirth": <dateOfBirth>,
    "idCard": <idCard>,
    "name": <name>,
    "email": <email>,
  },
  "status": "Success"
}
```

_Response (400 - Validation Error)_
```
{
  "status": "Validation Failed",
  "message": <message>
}
```

_Response (404 - Passenger Not Found)_
```
{
  "message": "Passenger Not Found"
}
```

_Response (400 - Not Authorized)_
```
{
  "message": "Not Authorized"
}
```

_Response (400 - Cannot Change Self Data)_
```
{
  "message": "You cannot change your data with this endpoint"
}
```

_Response (400 - Already Added Passenger's ID Card)_
```
{
  "message": "You have already added this ID Card"
}
```

---

#### DELETE /passenger/:passengerId

> Delete the user's passenger (cannot be done by other user and cannot delete self data (where `isUser` is true))

_Request Header_
```
{
  "authorization": "Bearer <token>"
}
```

_Request Params_
```
/<passengerId>
```

_Request Body_
```
not needed
```

_Response (200)_
```
{
  "message": "Successfully delete <passengerName>"
}
```

_Response (404 - Passenger Not Found)_
```
{
  "message": "Passenger Not Found"
}
```

_Response (400 - Not Authorized)_
```
{
  "message": "Not Authorized"
}
```

_Response (400 - Cannot Delete Self Data)_
```
{
  "message": "You cannot delete your data with this endpoint"
}
```

---

### Station

#### GET /station

> Get all stations

_Request Header_
```
not needed
```

_Request Body_
```
not needed
```

_Response (200)_
```
{
  "data": [
    {
      "id": <stationId>,
      "name": <name>
    },
    ...<sameObject>
  ],
  "status": "Success"
}
```

---

### Schedule

#### GET /schedule/latestDate

> Get latest date schedule

_Request Header_
```
not needed
```

_Request Body_
```
not needed
```

_Response (200)_
```
{
  "data": <latestDatetime>,
  "status": "Success"
}
```

---

#### GET /schedule/:departureStationId/:arrivalStationId/:date

> Get schedules

_Request Header_
```
not needed
```

_Request Params_
```
/<departureStationId>/<arrivalStationId>/<date>
```

_Request Body_
```
not needed
```

_Response (200)_
```
{
  "data": [
    {
      "id": <scheduleId>,
      "Train": {
        "id": <trainId>,
        "name": <trainName>
      },
      "departureStation": {
        "id": <stationId>,
        "name": <stationName>
      },
      "arrivalStation": {
        "id": <stationId>,
        "name": <stationName>
      },
      "departureTime": <departureTime>,
      "arrivalTime": <arrivalTime>,
      "firstSeatAvailable": <firstSeatAvailable>,       // 'None', 'Few' (if less than equal 25%), 'Available'
      "businessSeatAvailable": <businessSeatAvailable>, // 'None', 'Few' (if less than equal 25%), 'Available'
      "economySeatAvailable": <economySeatAvailable>,   // 'None', 'Few' (if less than equal 25%), 'Available'
      "prices": [
        {
          "id": <schedulePriceId>,
          "scheduleId": <scheduleId>,
          "seatClass": "economy",
          "price": <price>
        },
        {
          "id": <schedulePriceId>,
          "scheduleId": <scheduleId>,
          "seatClass": "business",
          "price": <price>
        },
        {
          "id": <schedulePriceId>,
          "scheduleId": <scheduleId>,
          "seatClass": "first",
          "price": <price>
        }
      ]
    },
    ...<sameObject>
  ],
  status: 'Success'
}
```

_Response (400 - Cannot Get Schedules Before Today)_
```
{
  "message": "Cannot get before today's schedules"
}
```

---

#### GET /schedule/:scheduleId

> Get schedule

_Request Header_
```
not needed
```

_Request Params_
```
/<scheduleId>
```

_Request Body_
```
not needed
```

_Response (200)_
```
{
  "fromCache": <isFromRedis>,
  "data": {
    "id": <scheduleId>,
    "Train": {
      "id": <trainId>,
      "name": <trainName>
    },
    "departureStation": {
      "id": <stationId>,
      "name": <stationName>
    },
    "arrivalStation": {
      "id": <stationId>,
      "name": <stationName>
    },
    "departureTime": <departureTime>,
    "arrivalTime": <arrivalTime>,
    "firstSeatAvailable": <firstSeatAvailable>,       // 'None', 'Few' (if less than equal 25%), 'Available'
    "businessSeatAvailable": <businessSeatAvailable>, // 'None', 'Few' (if less than equal 25%), 'Available'
    "economySeatAvailable": <economySeatAvailable>,   // 'None', 'Few' (if less than equal 25%), 'Available'
    "prices": [
      {
        "id": <schedulePriceId>,
        "scheduleId": <scheduleId>,
        "seatClass": "economy",
        "price": <price>
      },
      {
        "id": <schedulePriceId>,
        "scheduleId": <scheduleId>,
        "seatClass": "business",
        "price": <price>
      },
      {
        "id": <schedulePriceId>,
        "scheduleId": <scheduleId>,
        "seatClass": "first",
        "price": <price>
      }
    ],
    carriages: [
      {
        "id": <carriageId>,
        "trainId": <trainId>,
        "carriageNumber": <carriageNumber>,
        "Seats": [
          {
            "id": <seatId>,
            "carriageId": <carriageId>,
            "seatNumber": <seatNumber>,
            "seatClass": <seatClass>,
            "isBooked": <isBooked>
          },
          ...<sameObject>
        ]
      },
      ...<sameObject>
    ]
  },
  status: 'Success'
}
```

_Response (404 - Schedule Not Found)_
```
{
  "message": "Schedule Not Found"
}
```

---

### Order

#### GET /order/unpaid

> Get user's unpaid orders

_Request Header_
```
{
  "authorization": "Bearer <token>"
}
```

_Request Body_
```
not needed
```

_Response (200)_
```
{
  "data": [
    {
      "id": <orderId>,
      "userId": <userId>,
      "scheduleId": <scheduleId>,
      "isNotified": false,
      "createdAt": <createdAt>,
      "Payment": {
        "id": <paymentId>,
        "orderId": <orderId>,
        "amount": <amount>,
        "isPaid": false,
        "duePayment": <duePayment>
      },
      "Schedule": {
        "id": <scheduleId>,
        "trainId": <trainId>,
        "departureStationId": <stationId>,
        "arrivalStationId": <stationId>,
        "departureTime": <departureTime>,
        "arrivalTime": <arrivalTime>,
        "departureStation": {
            "id": <stationId>,
            "name": <stationName>
        },
        "arrivalStation": {
            "id": <stationId>,
            "name": <stationName>
        },
        "Train": {
            "id": <trainId>,
            "name": <trainName>
        }
      },
      "OrderedSeats": [
        {
          "name": <passengerName>
        },
        ...<sameObject>
      ]
    },
    ...<sameObject>
  ],
  "status": "Success"
}
```

---

#### Get /order/paid

> Get user's paid orders

_Request Header_
```
{
  "authorization": "Bearer <token>"
}
```

_Request Body_
```
not needed
```

_Response (200)_
```
{
  "data": [
    {
      "id": <orderId>,
      "userId": <userId>,
      "scheduleId": <scheduleId>,
      "isNotified": <isNotified>,
      "createdAt": <createdAt>,
      "Payment": {
        "id": <paymentId>,
        "orderId": <orderId>,
        "amount": <amount>,
        "isPaid": true,
        "duePayment": <duePayment>
      },
      "Schedule": {
        "id": <scheduleId>,
        "trainId": <trainId>,
        "departureStationId": <stationId>,
        "arrivalStationId": <stationId>,
        "departureTime": <departureTime>,
        "arrivalTime": <arrivalTime>,
        "departureStation": {
            "id": <stationId>,
            "name": <stationName>
        },
        "arrivalStation": {
            "id": <stationId>,
            "name": <stationName>
        },
        "Train": {
            "id": <trainId>,
            "name": <trainName>
        }
      },
      "OrderedSeats": [
        {
          "name": <passengerName>
        },
        ...<sameObject>
      ]
    },
    ...<sameObject>
  ],
  "status": "Success"
}
```

---

#### Get /order/history

> Get user's history orders

_Request Header_
```
{
  "authorization": "Bearer <token>"
}
```

_Request Body_
```
not needed
```

_Response (200)_
```
{
  "data": [
    {
      "id": <orderId>,
      "userId": <userId>,
      "scheduleId": <scheduleId>,
      "isNotified": true,
      "createdAt": <createdAt>,
      "Payment": {
        "id": <paymentId>,
        "orderId": <orderId>,
        "amount": <amount>,
        "isPaid": true,
        "duePayment": <duePayment>
      },
      "Schedule": {
        "id": <scheduleId>,
        "trainId": <trainId>,
        "departureStationId": <stationId>,
        "arrivalStationId": <stationId>,
        "departureTime": <departureTime>,
        "arrivalTime": <arrivalTime>,
        "departureStation": {
            "id": <stationId>,
            "name": <stationName>
        },
        "arrivalStation": {
            "id": <stationId>,
            "name": <stationName>
        },
        "Train": {
            "id": <trainId>,
            "name": <trainName>
        }
      },
      "OrderedSeats": [
        {
          "name": <passengerName>
        },
        ...<sameObject>
      ]
    },
    ...<sameObject>
  ],
  "status": "Success"
}
```

---

#### GET /order/:orderId

> Get user's order (cannot be fetch by other user)

_Request Header_
```
{
  "authorization": "Bearer <token>"
}
```

_Request Params_
```
/<orderId>
```

_Request Body_
```
not needed
```

_Response (200)_
```
{
  "data": {
    "id": <orderId>,
    "userId": <userId>,
    "scheduleId": <scheduleId>,
    "isNotified": <isNotified>,
    "createdAt": <createdAt>,
    "Payment": {
      "id": <paymentId>,
      "orderId": <orderId>,
      "amount": <amount>,
      "isPaid": <isPaid>,
      "duePayment": <duePayment>
    },
    "Schedule": {
      "id": <scheduleId>,
      "trainId": <trainId>,
      "departureStationId": <stationId>,
      "arrivalStationId": <stationId>,
      "departureTime": <departureTime>,
      "arrivalTime": <arrivalTime>,
      "departureStation": {
          "id": <stationId>,
          "name": <stationName>
      },
      "arrivalStation": {
          "id": <stationId>,
          "name": <stationName>
      },
      "Train": {
          "id": <trainId>,
          "name": <trainName>
      }
    },
    "OrderedSeats": [
      {
        "id": <orderedSeatId>,
        "orderId": <orderId>,
        "seatId": <seatId>,
        "price": <price>,
        "gender": <gender>,
        "dateOfBirth": <dateOfBirth>,
        "idCard": <idCard>,
        "name": <passengerName>,
        "email": <email>,
        "secret": <secret>,           // `secret` shows up if the `order` is paid
        "Seat": {
          "id": <seatId>,
          "carriageId": <carriageId>,
          "seatNumber": <seatNumber>,
          "seatClass": <seatClass>,
          "Carriage": {
            "id": <carriageId>,
            "trainId": <trainId>,
            "carriageNumber": <carriageNumber>
          }
        }
      },
      ...<sameObject>
    ]
  }
}
```

_Response (404 - Order Not Found)_
```
{
  "message": "Order Not Found"
}
```

_Response (400 - Not Authorized)_
```
{
  "message": "Not Authorized"
}
```

---

#### POST /order

> Create order (no later than 30 minutes of schedule's departure time)

_Request Header_
```
{
  "authorization": "Bearer <token>"
}
```

_Request Body_
```
{
  "scheduleId": <scheduleId>,
  "orderedSeats": [
    {
      "seatId": <seatId>,
      "passengerId": <passengerId>   // cannot write other user's passenger
    },
    ...<sameObject>
  ]
}
```

_Response (201)_
```
{
  "data": <orderId>,
  "message": "Successfully booked seats",
  "status": "success"
}
```

_Response (404 - Schedule Not Found)_
```
{
  "message": "Schedule Not Found"
}
```

_Response (403 - Create Order Later Than 30 Minutes of Schedule's Departure Time)_
```
{
  "message": "The train will depart soon"
}
```

_Response (400 - Cannot Include Other User's Passenger)_
```
{
  "message": "You cannot not include other user's passengers"
}
```

_Response (409 - Cannot Book Booked Seats)_
```
{
    "message": "You cannot book booked seat <carriageNumber>-<seatNumber>"
}
```

---

#### PUT /order/:orderId

> Pay the order (cannot be done by other user)

_Request Header_
```
{
  "authorization": "Bearer <token>"
}
```

_Request Params_
```
/<orderId>
```

_Request Body_
```
not needed
```

_Response (200)_
```
{
  "message": "Successfully paid the order",
  "status": "Success"
}
```

_Response (404 - Order Not Found)_
```
{
  "message": "Order Not Found"
}
```

_Response (400 - Not Authorized)_
```
{
  "message": "Not Authorized"
}
```

_Response (400 - Order Was Paid)_
```
{
  "message": "The order was paid"
}
```

_Response (400 - Has Passed Due Payment Time)_
```
{
  "message": "The order has passed payment due time"
}
```

---

#### DELETE /order/:orderId

> Cancel the order (cannot be done by other user and cannot cancel paid order)

_Request Header_
```
{
  "authorization": "Bearer <token>"
}
```

_Request Params_
```
/<orderId>
```

_Request Body_
```
not needed
```

_Response (200)_
```
{
  "message": "Successfully cancel the order",
  "status": "Success"
}
```

_Response (404 - Order Not Found)_
```
{
  "message": "Order Not Found"
}
```

_Response (400 - Not Authorized)_
```
{
  "message": "Not Authorized"
}
```

_Response (400 - Can't Cancel Paid Order)_
```
{
  "message": "Cannot cancel paid order"
}
```

---

### Banner

#### GET /banner

> Get all banners

_Request Header_
```
not needed
```

_Request Body_
```
not needed
```

_Response (200)_
```
{
  "data": [
    {
      "id": <bannerId>,
      "imageDesktop": <imageDesktopPath>,
      "imageMobile": <imageMobilePath>
    },
    ...<sameObject>
  ],
  "status": "Success"
}
```

---

#### GET /banner/:bannerId

> Get banner

_Request Header_
```
not needed
```

_Request Params_
```
/<bannerId>
```

_Request Body_
```
not needed
```

_Response (200)_
```
{
  "data": {
    "id": <bannerId>,
    "imageDesktop": <imageDesktopPath>,
    "imageMobile": <imageMobilePath>
  },
  "status": "Success"
}
```

_Response (404 - Banner Not Found)_
```
{
  "message": "Banner Not Found"
}
```

---

#### POST /banner

> Create banner (can be done by admin only)

_Request Header_
```
{
  "authorization": "Bearer <token>"
}
```

_Request Params_
```
/<bannerId>
```

_Request Body (in `form-data`)_
```
{
  "imageDesktop": <desktopImageFile>,
  "imageMobile": <mobileImageFile>,
}
```

_Response (201)_
```
{
  "data": {
    "id": <bannerId>,
    "imageDesktop": <imageDesktopPath>,
    "imageMobile": <imageMobilePath>
    "updatedAt": <updatedAt>,
    "createdAt": <createdAt>
  },
  "status": "Success"
}
```

_Response (400 - Not Authorized)_
```
{
  "message": "Not authorized"
}
```

---

#### PUT /banner/:bannerId

> Change the banner (can be done by admin only)

_Request Header_
```
{
  "authorization": "Bearer <token>"
}
```

_Request Params_
```
/<bannerId>
```

_Request Body (in `form-data`)_
```
{
  "imageDesktop": <desktopImageFile>,
  "imageMobile": <mobileImageFile>,
}
```

_Response (200)_
```
{
  "data": {
    "id": <bannerId>,
    "imageDesktop": <imageDesktopPath>,
    "imageMobile": <imageMobilePath>
    "updatedAt": <updatedAt>,
    "createdAt": <createdAt>
  },
  "status": "Success"
}
```

_Response (404 - Banner Not Found)_
```
{
  "message": "Banner Not Found"
}
```

_Response (400 - Not Authorized)_
```
{
  "message": "Not authorized"
}
```

---

#### DELETE /banner/:bannerId

> Delete the banner (can be done by admin only and cannot delete all banners)

_Request Header_
```
{
  "authorization": "Bearer <token>"
}
```

_Request Params_
```
/<bannerId>
```

_Request Body_
```
not needed
```

_Response (200)_
```
{
  "message": "Successfully delete banner",
  "status": "Success"
}
```

_Response (400 - Not Authorized)_
```
{
  "message": "Not authorized"
}
```

_Response (404 - Banner Not Found)_
```
{
  "message": "Banner Not Found"
}
```

_Response (400 - Admin Try to Delete the Remaining One)_
```
{
  "message": "Should have minimum 1 banner"
}
```

---