const request = require('supertest');
const app = require('../../index');
const { Passenger, sequelize } = require('../../models/index');
const { up: upUser, down: downUser } = require('../../seeders/20231205021723-user');
const { up: upPassenger, down: downPassenger } = require('../../seeders/20231205023546-passenger');
const { encrypt, decrypt } = require('../../utils/handleCrypto');
const { queryInterface } = sequelize;

jest.mock("ioredis", () => require("ioredis-mock"));

// Mock node-cron
jest.mock('node-cron', () => ({
  schedule: jest.fn(),
}));

let defaultToken;
let defaultDecryptedUser;

const defaultUserId = 2;
const defaultDummyUser = {
  usernameOrEmail: 'johndoe',
  password: '123456',
};
const defaultEncryptedObj = encrypt(JSON.stringify(defaultDummyUser));

beforeAll(async () => {
  await upUser(queryInterface, sequelize);
  await upPassenger(queryInterface, sequelize);

  const defaultLoginResponse = 
    await request(app).post('/api/user/login').send({ encryptedObj: defaultEncryptedObj });
  defaultToken = defaultLoginResponse.body.token;
  defaultDecryptedUser = JSON.parse(decrypt(defaultLoginResponse.body.user));
});

afterAll(async () => {
  await downUser(queryInterface, sequelize);
  await downPassenger(queryInterface, sequelize);
});

describe('Get My Passengers', () => {
  test('Success get my passengers with status 200', async () => {
    let response;
    try {
      response = 
        await request(app).get('/api/passenger').set('authorization', `Bearer ${defaultToken}`);
    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(200);

    const { body } = response;
    body.data.forEach(obj => {
      expect(obj).toHaveProperty('id');
      expect(obj).toHaveProperty('userId');
      expect(obj).toHaveProperty('isUser');
      expect(obj).toHaveProperty('gender');
      expect(obj).toHaveProperty('dateOfBirth');
      expect(obj).toHaveProperty('idCard');
      expect(obj).toHaveProperty('name');
      expect(obj).toHaveProperty('email');
    });
  });
});

describe('Get Passenger', () => {
  test('Success get passenger with status 200', async () => {
    let response;
    try {
      const passengerId = 2;

      response = 
        await request(app)
          .get(`/api/passenger/${passengerId}`)
          .set('authorization', `Bearer ${defaultToken}`);
    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(200);

    const { body } = response;
    expect(body.data).toHaveProperty('id');
    expect(body.data).toHaveProperty('userId');
    expect(body.data).toHaveProperty('isUser');
    expect(body.data).toHaveProperty('gender');
    expect(body.data).toHaveProperty('dateOfBirth');
    expect(body.data).toHaveProperty('idCard');
    expect(body.data).toHaveProperty('name');
    expect(body.data).toHaveProperty('email');
  });

  test('Failed get passenger: Not Found with status 404', async () => {
    let response;
    try {
      const passengerId = 1000;

      response = 
        await request(app)
          .get(`/api/passenger/${passengerId}`)
          .set('authorization', `Bearer ${defaultToken}`);
    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(404);
  });

  test('Failed get passenger: Not Authorized with status 400', async () => {
    let response;
    try {
      const otherUserId = 3;
      const otherUserPassenger = await Passenger.findOne({ where: { userId: otherUserId } });

      response = 
        await request(app)
          .get(`/api/passenger/${otherUserPassenger.id}`)
          .set('authorization', `Bearer ${defaultToken}`);
    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(400);
  })
});

describe('Create Passenger', () => {
  test('Success create passenger with status 200', async () => {
    let response;
    let passenger;
    const dummyData = {
      gender: "Male",
      dateOfBirth: "2000-07-19",
      idCard: "1233234323563257",
      name: "James Bond",
      email: "jamesbond@gmail.com",
    }

    try {
      response = 
        await request(app)
          .post('/api/passenger')
          .set('authorization', `Bearer ${defaultToken}`)
          .send(dummyData);

      passenger = await Passenger.findOne({ 
        where: {
          userId: defaultDecryptedUser.id,
          idCard: dummyData.idCard,
        }  
      });
      
    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(201);

    const { body } = response;
    expect(body.data).toHaveProperty('id');
    expect(body.data).toHaveProperty('userId');
    expect(body.data.isUser).toBe(false);
    expect(body.data).toHaveProperty('gender');
    expect(body.data).toHaveProperty('dateOfBirth');
    expect(body.data).toHaveProperty('idCard');
    expect(body.data).toHaveProperty('name');
    expect(body.data).toHaveProperty('email');

    expect(passenger).not.toBeNull();
  });

  test('Failed create passenger: Validation Error (ID Card Format) with status 400', async () => {
    let response;
    let passenger;
    const dummyData = {
      gender: "Male",
      dateOfBirth: "2000-07-19",
      idCard: "123323432356325",
      name: "James Doe",
      email: "jamesdoe@gmail.com",
    }

    try {
      response = 
          await request(app)
            .post('/api/passenger')
            .set('authorization', `Bearer ${defaultToken}`)
            .send(dummyData);

      passenger = await Passenger.findOne({ 
        where: {
          userId: defaultDecryptedUser.id,
          idCard: dummyData.idCard,
        }  
      });
      
    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(400);

    expect(passenger).toBeNull();
  });

  test('Failed created passenger: Reach limit with status 400', async () => {
    let response;
    let passenger;
    const dummyData = {
      gender: "Male",
      dateOfBirth: "2000-07-19",
      idCard: "1233234323563257",
      name: "James Doe",
      email: "jamesdoe@gmail.com",
    }

    try {
      const dummyUser = {
        usernameOrEmail: 'agus',
        password: '123456',
      };
  
      const encryptedObj = encrypt(JSON.stringify(dummyUser));
      const loginResponse = await request(app).post('/api/user/login').send({ encryptedObj });
  
      response = 
        await request(app)
          .post('/api/passenger')
          .set('authorization', `Bearer ${loginResponse.body.token}`)
          .send(dummyData);

      const decryptedUser = JSON.parse(decrypt(loginResponse.body.user));

      passenger = await Passenger.findOne({ 
        where: {
          userId: decryptedUser.id,
          idCard: dummyData.idCard,
        }  
      });
      
    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(400);
    expect(passenger).toBeNull();
  })
});

describe('Update Passenger', () => {
  test('Success update passenger with status 200', async () => {
    let response;
    let passenger;

    const dummyData = {
      gender: "Male",
      dateOfBirth: "2000-07-19",
      idCard: "1233234323563257",
      name: "James Bond",
      email: "jamesbond@gmail.com",
    }

    try {
      // Get the last passenger added of the user
      const passengerToBeUpdated = await Passenger.findOne({
        where: {
          userId: defaultUserId
        },
        order: [
          ['id', 'DESC'],
        ],
      });
      
      response = 
        await request(app)
          .put(`/api/passenger/${passengerToBeUpdated.id}`)
          .set('authorization', `Bearer ${defaultToken}`)
          .send(dummyData);

      passenger = await Passenger.findOne({ 
        where: {
          userId: defaultDecryptedUser.id,
          idCard: dummyData.idCard,
        }  
      });

    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(200);
    const { body } = response;
    expect(body.data).toHaveProperty('id');
    expect(body.data.userId).toEqual(defaultUserId);
    expect(body.data.isUser).toBe(false);
    expect(body.data.gender).toEqual(dummyData.gender);
    expect(body.data).toHaveProperty('dateOfBirth');
    expect(body.data.idCard).toEqual(dummyData.idCard);
    expect(body.data.name).toEqual(dummyData.name);
    expect(body.data.email).toEqual(dummyData.email);

    expect(passenger).not.toBeNull();
  });
});

describe('Delete Passenger', () => {
  test('Success delete passenger with status 200', async () => {
    let response;
    let passenger;

    try {
      // Get the last passenger added of the user
      const passengerToBeDeleted = await Passenger.findOne({
        where: {
          userId: defaultUserId
        },
        order: [
          ['id', 'DESC'],
        ],
      });
      
      response = 
        await request(app)
          .delete(`/api/passenger/${passengerToBeDeleted.id}`)
          .set('authorization', `Bearer ${defaultToken}`);

      passenger = await Passenger.findOne({ 
        where: {
          id: passengerToBeDeleted.id
        }  
      });

    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(200);
    expect(passenger).toBeNull();
  });

  test('Failed delete passenger: Not Found with status 404', async () => {
    let response;
    const passengerId = 1000;

    try {
      response = 
        await request(app)
          .delete(`/api/passenger/${passengerId}`)
          .set('authorization', `Bearer ${defaultToken}`);

    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(404);
  });

  test('Failed delete passenger: Not Authorized with status 400', async () => {
    let response;
    let passenger;
    const otherUserId = 3;

    try {
      const otherUserPassenger = await Passenger.findOne({ where: { userId: otherUserId } });

      response = 
        await request(app)
          .delete(`/api/passenger/${otherUserPassenger.id}`)
          .set('authorization', `Bearer ${defaultToken}`);

      passenger = await Passenger.findByPk(otherUserPassenger.id);

    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(400);
    expect(passenger).not.toBe(null);
  });

  test("Failed delete passenger: Cannot delete user's data with status 400", async () => {
    let response;
    let passenger;

    try {
      const userPassengerSelf =
      await Passenger.findOne({ where: { userId: defaultUserId, isUser: true } });

      response = 
        await request(app)
          .delete(`/api/passenger/${userPassengerSelf.id}`)
          .set('authorization', `Bearer ${defaultToken}`);

          passenger = await Passenger.findByPk(userPassengerSelf.id);
    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(400);
    expect(passenger).not.toBe(null);
  })
});