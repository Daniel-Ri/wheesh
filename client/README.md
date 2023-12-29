# Routes

If `Allowed Roles` is empty than all roles are allowed.

| Path                                     | Name              | Protected | Allowed Roles |
| ---------------------------------------- | ----------------- | --------- | -------------- |
| `/`                                      | Home              | false     |                |
| `/my-tickets`                            | My Tickets        | false     |                |
| `/me`                                    | Me                | false     |                |
| `/login`                                 | Login             | false     |                |
| `/register`                              | Register          | false     |                |
| `/myPassengers`                          | My Passengers     | true      |                |
| `/createPassenger`                       | Create Passenger  | true      |                |
| `/passenger/:passengerId`                | Passenger         | true      |                |
| `/profile`                               | Profile           | true      |                |
| `/changePassword`                        | Change Password   | true      |                |
| `/changeEmail`                           | Change Email      | true      |                |
| `/schedule/:departureStationId/:arrivalStationId/:date` | Schedule   | false     |                |
| `/book/:scheduleId/:seatClass`           | Book              | true      |                |
| `/unpaid/:orderId`                       | Unpaid            | true      |                |
| `/order/:orderId`                        | Order             | true      |                |
| `/history/:orderId`                      | History           | true      |                |
| `/banner`                                | Banner            | true      | admin          |
| `/addBanner`                             | Add Banner        | true      | admin          |
| `/changeBanner/:bannerId`                | Change Banner     | true      | admin          |
| `/gate`                                  | Gate              | false     |                |
| `/test`                                  | Test              | false     |                |
| `*`                                      | Not Found         | false     |                |