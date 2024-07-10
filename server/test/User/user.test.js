const request = require('supertest');
const app = require('../../index');
const { User, EmailToken, sequelize } = require('../../models/index');
const { up: upUser, down: downUser } = require('../../seeders/20231205021723-user');
const { up: upPassenger, down: downPassenger } = require('../../seeders/20231205023546-passenger');
const { signToken } = require('../../utils/handleToken');
const { encrypt } = require('../../utils/handleCrypto');
const { queryInterface } = sequelize;

jest.mock("ioredis", () => require("ioredis-mock"));

// Mock node-cron
jest.mock('node-cron', () => ({
  schedule: jest.fn(),
}));

// Mock the entire handleMail module
jest.mock("../../utils/handleMail", () => ({
  transporter: {
    sendMail: jest.fn(),
  },
  generateMailOptionsForNewEmail: jest.fn(),
  generateMailOptionsForUpdateEmail: jest.fn(),
  generateMailOptionsForRemindSchedule: jest.fn(),
}));

beforeAll(async () => {
  await upUser(queryInterface, sequelize);
  await upPassenger(queryInterface, sequelize);
});

afterAll(async () => {
  await downUser(queryInterface, sequelize);
  await downPassenger(queryInterface, sequelize);
  await queryInterface.bulkDelete('EmailTokens', null, {});
});

// Use beforeEach to clear mock state before each test
beforeEach(() => {
  jest.clearAllMocks(); // Clear all mocks (including the mock functions in handleMail)
  // Alternatively, you can use mockClear on specific mock functions:
  // handleMail.transporter.sendMail.mockClear();
});

describe('Login', () => {
  test('Success login with status 200', async () => {
    let response;
    try {
      const dummyData = {
        usernameOrEmail: 'johndoe',
        password: '123456',
      };

      response = await request(app).post('/api/user/login').send(dummyData);
    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');

    const decryptedUser = response.body.user;
    expect(decryptedUser).toHaveProperty('id');
    expect(decryptedUser).toHaveProperty('username');
    expect(decryptedUser).toHaveProperty('email');
    expect(decryptedUser).toHaveProperty('role');
  });

  test('Failed login: Validation Error with status 400', async () => {
    let response;
    try {
      const dummyData = {
        username: 'johndoe',
        password: '123456',
      };

      response = await request(app).post('/api/user/login').send(dummyData);
    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(400);
  });

  test('Failed login: Username Not Found with status 400', async () => {
    let response;
    try {
      const dummyData = {
        usernameOrEmail: 'jamesbond',
        password: '123456',
      };

      response = await request(app).post('/api/user/login').send(dummyData);
    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(400);
  });

  test('Failed login: Password Invalid with status 400', async () => {
    let response;
    try {
      const dummyData = {
        usernameOrEmail: 'johndoe',
        password: '1234567',
      };

      response = await request(app).post('/api/user/login').send(dummyData);
    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(400);
  });
});

describe('Send Email Token', () => {
  test('Success send email token with status 200', async () => {
    let response;
    let emailToken;

    const dummyData = {
      email: 'daniel@gmail.com',
      action: 'create'
    };

    try {
      response = await request(app).post('/api/user/sendEmailToken').send(dummyData);
      emailToken = await EmailToken.findOne({ where: {email: dummyData.email} });
    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(200);
    expect(emailToken.email).toEqual(dummyData.email);
    expect(emailToken).toHaveProperty('token');
  });

  test('Failed send email token: Validation Error with status 400', async () => {
    let response;

    const dummyData = {
      email: 'daniel@gmail.com'
    };

    try {
      response = await request(app).post('/api/user/sendEmailToken').send(dummyData);
    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(400);
  });

  test('Failed send email token: Email already exist with status 400', async () => {
    let response;
    let emailToken;

    const dummyData = {
      email: 'johndoe@gmail.com',
      action: 'create'
    };

    try {
      response = await request(app).post('/api/user/sendEmailToken').send(dummyData);
      emailToken = await EmailToken.findOne({ where: {email: dummyData.email} });
    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(400);
    expect(emailToken).toBe(null);
  });
})

describe('Register', () => {
  test('Success register with status 201', async () => {
    const dummyData = {
      username: "daniel",
      password: "123456",
      gender: "Male",
      dateOfBirth: "2000-07-19",
      idCard: "1207235534253543",
      name: "Daniel Riyanto",
      email: "daniel@gmail.com",
    };

    let response;
    let emailToken;
    let user;

    try {
      await request(app)
            .post('/api/user/sendEmailToken').send({ email: dummyData.email, action: "create" });
      emailToken = await EmailToken.findOne({ where: {email: dummyData.email} });
      dummyData.emailToken = emailToken.token;

      response = await request(app).post('/api/user/register').send(dummyData);

      // Check the email is still in database
      emailToken = await EmailToken.findOne({ where: {email: dummyData.email} });

      // Check user is added on database
      user = await User.findOne({ where: {username: dummyData.username} }); 

    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(201);
    const responseData = response.body.data;
    expect(responseData.username).toEqual(dummyData.username);
    expect(responseData.email).toEqual(dummyData.email);
    expect(responseData.Passengers[0].isUser).toBe(true);
    expect(responseData.Passengers[0].name).toEqual(dummyData.name);
    expect(emailToken).toBeNull();
    expect(user).not.toBeNull();
  });

  test('Failed register: Validation Error with status 400', async () => {
    const dummyData = {
      username: "darwin",
      password: "123456",
      gender: "Male",
      dateOfBirth: "2000-07-19",
      idCard: "1207235534253543",
      name: "Daniel Riyanto",
      email: "darwin@gmail.com",
    };

    let response;
    let user;

    try {
      const encryptedObj = encrypt(JSON.stringify(dummyData));
      response = await request(app).post('/api/user/register').send({ encryptedObj });

      // Check user is added on database
      user = await User.findOne({ where: {username: dummyData.username} }); 

    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(400);
    expect(user).toBeNull();
  })
});

describe('Verify Token', () => {
  test('Success verify token with status 200', async () => {
    let response;
    try {
      const dummyData = {
        usernameOrEmail: 'johndoe',
        password: '123456',
      };
      const loginResponse = await request(app).post('/api/user/login').send(dummyData);

      response = 
        await request(app)
          .post('/api/user/verifyToken')
          .set('authorization', `Bearer ${loginResponse.body.token}`);
    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(200);
  });

  test('Failed verify token with status 400', async () => {
    let response;
    const invalidToken = 'lolololo';

    try {
      response = 
        await request(app)
          .post('/api/user/verifyToken')
          .set('authorization', `Bearer ${invalidToken}`);
    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(400);
  });

  test('Failed verify token: User ID is not in database with status 400', async () => {
    let response;
    const userId = 1000;
    const userRole = 'admin';

    try {
      const token = signToken(userId, userRole);
      response = 
        await request(app)
          .post('/api/user/verifyToken')
          .set('authorization', `Bearer ${token}`);

    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(400);
  });
});

describe('Get Profile', () => {
  test('Success get profile with status 200', async () => {
    let response;

    const dummyData = {
      usernameOrEmail: 'johndoe',
      password: '123456',
    };
    try {
      const loginResponse = await request(app).post('/api/user/login').send(dummyData);

      response = 
        await request(app)
          .get('/api/user')
          .set('authorization', `Bearer ${loginResponse.body.token}`);
    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(200);

    const { body } = response;

    expect(body.data).toHaveProperty("id");
    expect(body.data).toHaveProperty("role");
    expect(body.data).toHaveProperty("email");
    expect(body.data.username).toEqual(dummyData.usernameOrEmail);
    expect(body.data).toHaveProperty("Passengers");
    expect(body.data.Passengers.length).toEqual(1);
    body.data.Passengers.forEach(obj => {
      expect(obj).toHaveProperty('id');
      expect(obj).toHaveProperty('userId');
      expect(obj.isUser).toBe(true);
      expect(obj).toHaveProperty('gender');
      expect(obj).toHaveProperty('dateOfBirth');
      expect(obj).toHaveProperty('idCard');
      expect(obj).toHaveProperty('name');
      expect(obj).toHaveProperty('email');
    });
  })
});

describe('Update Profile', () => {
  test('Success update profile with status 200', async () => {
    let response;

    const dummyData = {
      username: 'johndoe2',
      gender: 'Female',
      dateOfBirth: '2000-07-18',
      idCard: '1234876590123456',
      name: 'John Doe 2',
    };

    try {
      const dummyUser = {
        usernameOrEmail: 'johndoe',
        password: '123456',
      };
      const loginResponse = await request(app).post('/api/user/login').send(dummyUser);

      response = 
        await request(app)
          .put('/api/user')
          .set('authorization', `Bearer ${loginResponse.body.token}`).send(dummyData);
    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(200);

    const { body } = response;
    expect(body.data).toHaveProperty("id");
    expect(body.data).toHaveProperty("role");
    expect(body.data).toHaveProperty("email");
    expect(body.data.username).toEqual(dummyData.username);
  });

  test('Failed update profile: Validation Error (Invalid Format ID Card) with status 200', async () => {
    let response;

    const dummyData = {
      username: 'johndoe2',
      gender: 'Female',
      dateOfBirth: '2000-07-18',
      idCard: '123487659012345',
      name: 'John Doe 2',
    };

    try {
      const dummyUser = {
        usernameOrEmail: 'johndoe@gmail.com',
        password: '123456',
      };
      const loginResponse = await request(app).post('/api/user/login').send(dummyUser);

      response = 
        await request(app)
          .put('/api/user')
          .set('authorization', `Bearer ${loginResponse.body.token}`).send(dummyData);
    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(400);
  });
})

describe('Change Password', () => {
  test('Success change password with status 200', async () => {
    let response;
    let loginResponseAgain;

    const dummyData = {
      oldPassword: '123456',
      newPassword: '1234567',
    };

    try {
      const dummyUser = {
        usernameOrEmail: 'johndoe@gmail.com',
        password: dummyData.oldPassword,
      };
      const loginResponse = await request(app).post('/api/user/login').send(dummyUser);

      response = 
        await request(app)
          .put('/api/user/changePassword')
          .set('authorization', `Bearer ${loginResponse.body.token}`).send(dummyData);

      const dummyUserWithNewPassword = {
        usernameOrEmail: dummyUser.usernameOrEmail,
        password: dummyData.newPassword,
      };
      loginResponseAgain = await request(app).post('/api/user/login').send(dummyUserWithNewPassword);

    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(200);
    expect(loginResponseAgain.status).toBe(200);
  });
});

describe('Change Email', () => {
  test('Success change email with status 200', async () => {
    let response;
    let loginResponseAgain;
    let emailToken;

    const newEmail = 'johndoe2@gmail.com';

    try {
      await request(app)
            .post('/api/user/sendEmailToken').send({ email: newEmail, action: "update" });

      const dummyUser = {
        usernameOrEmail: 'johndoe@gmail.com',
        password: '1234567',
      };
      const loginResponse = await request(app).post('/api/user/login').send(dummyUser);

      emailToken = await EmailToken.findOne({ where: {email: newEmail} });

      response = 
        await request(app)
          .put('/api/user/changeEmail')
          .set('authorization', `Bearer ${loginResponse.body.token}`)
          .send({ email: newEmail, emailToken: emailToken.token });

      emailToken = await EmailToken.findOne({ where: {email: newEmail} });

      const newDummyUser = { usernameOrEmail: newEmail, password: dummyUser.password };

      loginResponseAgain = 
        await request(app).post('/api/user/login').send(newDummyUser);

    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(200);
    const { body } = response;
    expect(body.data).toHaveProperty("id");
    expect(body.data).toHaveProperty("role");
    expect(body.data).toHaveProperty("email");
    expect(body.data).toHaveProperty("username");
    expect(body.data.email).toEqual(newEmail);

    expect(emailToken).toBeNull();
    expect(loginResponseAgain.status).toBe(200);
  });
})