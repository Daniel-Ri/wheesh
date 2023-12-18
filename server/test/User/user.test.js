const request = require('supertest');
const app = require('../../index');
const { User, EmailToken, sequelize } = require('../../models/index');
const { hash } = require('../../utils/handlePassword');
const { queryInterface } = sequelize;

beforeAll(async () => {
  await queryInterface.bulkInsert('Users', [
    {
      username: "bangjoe",
      password: hash("123456"),
      role: "admin",
      email: "bangjoe@gmail.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      username: "johndoe",
      password: hash("123456"),
      role: "user",
      email: "johndoe@gmail.com",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      username: "jeandoe",
      password: hash("123456"),
      role: "user",
      email: "jeandoe@gmail.com",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      username: "agus",
      password: hash("123456"),
      role: "user",
      email: "agus@gmail.com",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      username: "asep",
      password: hash("123456"),
      role: "user",
      email: "asep@gmail.com",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      username: "slamet",
      password: hash("123456"),
      role: "user",
      email: "slamet@gmail.com",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ], {});
});

afterAll(async () => {
  await queryInterface.bulkDelete('Users', null, {});
  await queryInterface.bulkDelete('EmailTokens', null, {});
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
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user).toHaveProperty('username');
    expect(response.body.user).toHaveProperty('email');
    expect(response.body.user).toHaveProperty('role');
  })
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
  })
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
    expect(response.body.data.username).toEqual(dummyData.username);
    expect(response.body.data.email).toEqual(dummyData.email);
    expect(response.body.data.Passengers[0].isUser).toBe(true);
    expect(response.body.data.Passengers[0].name).toEqual(dummyData.name);
    expect(emailToken).toBeNull();
    expect(user).not.toBeNull();
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
  })
});

describe('Get Profile', () => {
  test.only('Success get profile with status 200', async () => {
    let response;

    try {
      const dummyData = {
        usernameOrEmail: 'johndoe',
        password: '123456',
      };
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

    console.log(body, '<< BODY');

    expect(body.data).toHaveProperty("id");
    expect(body.data).toHaveProperty("role");
    expect(body.data).toHaveProperty("email");
    expect(body.data).toHaveProperty("Passengers");
  })
});

describe('Update Profile', () => {
  test('Success update profile with status 200', async () => {
    let response;

    try {

    } catch (err) {

    }
  })
})