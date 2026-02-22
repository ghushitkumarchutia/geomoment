process.env.JWT_SECRET = 'test_jwt_secret_minimum_32_characters_long';
process.env.JWT_EXPIRY = '7d';
process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../src/app');
const { connectDB, disconnectDB } = require('./setup');

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

describe('POST /api/route/score', () => {
  it('should return score object for valid points', async () => {
    const res = await request(app)
      .post('/api/route/score')
      .send({
        points: [
          { lat: 28.63, lng: 77.21 },
          { lat: 28.635, lng: 77.215 },
          { lat: 28.64, lng: 77.22 },
        ],
        day: 1,
        hour: 14,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('overallScore');
    expect(res.body.data).toHaveProperty('overallDominantTag');
    expect(res.body.data).toHaveProperty('coverage');
    expect(Array.isArray(res.body.data.segments)).toBe(true);
    expect(res.body.data.segments).toHaveLength(3);
  });

  it('should reject empty points array', async () => {
    const res = await request(app).post('/api/route/score').send({ points: [], day: 1, hour: 14 });

    expect(res.status).toBe(422);
  });

  it('should reject single point', async () => {
    const res = await request(app)
      .post('/api/route/score')
      .send({ points: [{ lat: 28.63, lng: 77.21 }], day: 1, hour: 14 });

    expect(res.status).toBe(422);
  });

  it('should reject too many points', async () => {
    const points = Array.from({ length: 101 }, (_, i) => ({
      lat: 28.63 + i * 0.001,
      lng: 77.21,
    }));

    const res = await request(app).post('/api/route/score').send({ points, day: 1, hour: 14 });

    expect(res.status).toBe(422);
  });

  it('should reject missing day/hour', async () => {
    const res = await request(app)
      .post('/api/route/score')
      .send({
        points: [
          { lat: 28.63, lng: 77.21 },
          { lat: 28.64, lng: 77.22 },
        ],
      });

    expect(res.status).toBe(422);
  });
});
