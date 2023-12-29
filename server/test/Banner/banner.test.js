const request = require('supertest');
const app = require('../../index');
const path = require('path');

const { Banner, sequelize } = require('../../models/index');
const { up: upUser, down: downUser } = require('../../seeders/20231205021723-user');
const { up: upPassenger, down: downPassenger } = require('../../seeders/20231205023546-passenger');
const { up: upBanner, down: downBanner } = require('../../seeders/20231215035650-banner');
const { encrypt } = require('../../utils/handleCrypto');
const { queryInterface } = sequelize;

jest.mock("ioredis", () => require("ioredis-mock"));

// Mock node-cron
jest.mock('node-cron', () => ({
  schedule: jest.fn(),
}));

let tokenAdmin;

const dummyAdmin = {
  usernameOrEmail: 'bangjoe',
  password: '123456',
};
const encryptedObjAdmin = encrypt(JSON.stringify(dummyAdmin));

beforeAll(async () => {
  await upUser(queryInterface, sequelize);
  await upPassenger(queryInterface, sequelize);
  await upBanner(queryInterface, sequelize);
  const loginResponseAdmin = await request(app).post('/api/user/login').send({ encryptedObj: encryptedObjAdmin });
  tokenAdmin = loginResponseAdmin.body.token;
});

afterAll(async () => {
  await downUser(queryInterface, sequelize);
  await downPassenger(queryInterface, sequelize);
  await downBanner(queryInterface, sequelize);
});

describe('Get All Banners', () => {
  test('Success get all banners with status 200', async () => {
    let response;
    try {
      response = await request(app).get('/api/banner');
    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(200);

    const { data } = response.body;
    data.forEach(obj => {
      expect(obj).toHaveProperty("id");
      expect(obj).toHaveProperty("imageDesktop");
      expect(obj).toHaveProperty("imageMobile");
    });
  });
});

describe('Get Banner', () => {
  test('Success get banner with status 200', async () => {
    let response;
    const bannerId = 1;
    try {
      response = await request(app).get(`/api/banner/${bannerId}`);
    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(200);

    const { data } = response.body;
    expect(data).toHaveProperty("id");
    expect(data).toHaveProperty("imageDesktop");
    expect(data).toHaveProperty("imageMobile");
  });
});

describe('Create Banner', () => {
  test('Success create banner with status 200', async () => {
    let response;
    let isIncrease;

    const desktopImagePath = path.join(__dirname, '..', '..', 'backupPics', 'Frame 8 - Desktop.png');
    const mobileImagePath = path.join(__dirname, '..', '..', 'backupPics', 'Frame 8 - Mobile.png');

    try {
      const bannersBeforeAdded = await Banner.findAll();

      response =
        await request(app)
          .post('/api/banner')
          .set('authorization', `Bearer ${tokenAdmin}`)
          .attach('imageDesktop', desktopImagePath)
          .attach('imageMobile', mobileImagePath);

      const bannersAfterAdded = await Banner.findAll();
      isIncrease = bannersAfterAdded.length === bannersBeforeAdded.length + 1;

    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(201);
    expect(isIncrease).toBe(true);
  });

  test('Failed create banner: User Not Authorized with status 400', async () => {
    let response;
    let isIncrease;

    const desktopImagePath = path.join(__dirname, '..', '..', 'backupPics', 'Frame 8 - Desktop.png');
    const mobileImagePath = path.join(__dirname, '..', '..', 'backupPics', 'Frame 8 - Mobile.png');

    try {
      const dummyUser = {
        usernameOrEmail: 'johndoe',
        password: '123456',
      };
      const encryptedObj = encrypt(JSON.stringify(dummyUser));

      const bannersBeforeAdded = await Banner.findAll();
      const loginResponse = await request(app).post('/api/user/login').send({ encryptedObj });

      console.log('wait....');
      response =
        await request(app)
          .post('/api/banner')
          .set('authorization', `Bearer ${loginResponse.body.token}`)
          .attach('imageDesktop', desktopImagePath)
          .attach('imageMobile', mobileImagePath);

      const bannersAfterAdded = await Banner.findAll();
      isIncrease = bannersAfterAdded.length === bannersBeforeAdded.length + 1;

    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(400);
    const { message } = response.body;
    const messageLowerCase = message.toLowerCase();
    expect(messageLowerCase).toContain('authorized');

    expect(isIncrease).toBe(false);
  })
});

describe('Update Banner', () => {
  test('Success update banner with status 200', async () => {
    let response;

    const desktopImagePath = path.join(__dirname, '..', '..', 'backupPics', 'Frame 7 - Desktop.png');
    const mobileImagePath = path.join(__dirname, '..', '..', 'backupPics', 'Frame 7 - Mobile.png');

    try {
      const lastBanner = await Banner.findOne({ order: [['id', 'DESC']] })

      response =
        await request(app)
          .put(`/api/banner/${lastBanner.id}`)
          .set('authorization', `Bearer ${tokenAdmin}`)
          .attach('imageDesktop', desktopImagePath)
          .attach('imageMobile', mobileImagePath);

    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(200);
  });

  test('Failed update banner: Banner Not Found with status 404', async () => {
    let response;

    const bannerId = 1000;
    const desktopImagePath = path.join(__dirname, '..', '..', 'backupPics', 'Frame 7 - Desktop.png');
    const mobileImagePath = path.join(__dirname, '..', '..', 'backupPics', 'Frame 7 - Mobile.png');

    try {
      response =
        await request(app)
          .put(`/api/banner/${bannerId}`)
          .set('authorization', `Bearer ${tokenAdmin}`)
          .attach('imageDesktop', desktopImagePath)
          .attach('imageMobile', mobileImagePath);

    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(404);
  })
});

describe('Delete Banner', () => {
  test('Success delete banner with status 200', async () => {
    let response;
    let isDecrease;

    try {
      const bannersBeforeAdded = await Banner.findAll();
      const lastBanner = await Banner.findOne({ order: [['id', 'DESC']] })

      response =
        await request(app)
          .delete(`/api/banner/${lastBanner.id}`)
          .set('authorization', `Bearer ${tokenAdmin}`);

      const bannersAfterAdded = await Banner.findAll();
      isDecrease = bannersAfterAdded.length === bannersBeforeAdded.length - 1;

    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(200);
    expect(isDecrease).toBe(true);
  });

  test('Failed delete banner: Banner Not Found with status 404', async () => {
    let response;
    const bannerId = 1000;

    try {
      response =
        await request(app)
          .delete(`/api/banner/${bannerId}`)
          .set('authorization', `Bearer ${tokenAdmin}`);

    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(404);
  })
});