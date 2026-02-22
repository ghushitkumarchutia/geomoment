process.env.JWT_SECRET = 'test_jwt_secret_minimum_32_characters_long';
process.env.JWT_EXPIRY = '7d';
process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../src/app');
const Moment = require('../src/models/Moment');
const { connectDB, disconnectDB, clearDB } = require('./setup');

let token;
let otherToken;

beforeAll(async () => {
  await connectDB();

  const res = await request(app).post('/api/auth/register').send({
    name: 'Moment User',
    email: 'moment@test.com',
    password: 'password123',
  });
  token = res.body.data.accessToken;

  const res2 = await request(app).post('/api/auth/register').send({
    name: 'Other User',
    email: 'other@test.com',
    password: 'password123',
  });
  otherToken = res2.body.data.accessToken;
});

afterAll(async () => {
  await disconnectDB();
});

describe('POST /api/moments', () => {
  it('should submit moment when authenticated', async () => {
    const res = await request(app)
      .post('/api/moments')
      .set('Authorization', `Bearer ${token}`)
      .send({ lat: 28.631, lng: 77.211, tag: 'safe', dayOfWeek: 1, hourSlot: 14 });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.tag).toBe('safe');
    expect(res.body.data.geohashCell).toBeDefined();
    expect(res.body.data.location.coordinates).toEqual([77.211, 28.631]);
  });

  it('should reject without authentication', async () => {
    const res = await request(app)
      .post('/api/moments')
      .send({ lat: 28.631, lng: 77.211, tag: 'safe', dayOfWeek: 1, hourSlot: 14 });

    expect(res.status).toBe(401);
  });

  it('should reject invalid tag', async () => {
    const res = await request(app)
      .post('/api/moments')
      .set('Authorization', `Bearer ${token}`)
      .send({ lat: 28.631, lng: 77.211, tag: 'invalid', dayOfWeek: 1, hourSlot: 14 });

    expect(res.status).toBe(422);
  });

  it('should reject out-of-range coordinates', async () => {
    const res = await request(app)
      .post('/api/moments')
      .set('Authorization', `Bearer ${token}`)
      .send({ lat: 999, lng: 77.211, tag: 'safe', dayOfWeek: 1, hourSlot: 14 });

    expect(res.status).toBe(422);
    expect(res.body.errors.some((e) => e.field === 'lat')).toBe(true);
  });
});

describe('GET /api/moments/heatmap', () => {
  beforeAll(async () => {
    await Moment.deleteMany({});
    for (let i = 0; i < 4; i++) {
      await request(app)
        .post('/api/moments')
        .set('Authorization', `Bearer ${token}`)
        .send({ lat: 28.631, lng: 77.211, tag: 'safe', dayOfWeek: 5, hourSlot: 18 });
    }
  });

  it('should return heatmap data with correct shape', async () => {
    const res = await request(app).get('/api/moments/heatmap').query({
      swLat: 28.62,
      swLng: 77.2,
      neLat: 28.64,
      neLng: 77.22,
      day: 5,
      hour: 18,
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    if (res.body.data.length > 0) {
      const cell = res.body.data[0];
      expect(cell).toHaveProperty('geohashCell');
      expect(cell).toHaveProperty('centerLat');
      expect(cell).toHaveProperty('centerLng');
      expect(cell).toHaveProperty('dominantTag');
      expect(cell).toHaveProperty('score');
      expect(cell).toHaveProperty('totalCount');
    }
  });

  it('should reject too-large bounding box', async () => {
    const res = await request(app).get('/api/moments/heatmap').query({
      swLat: 20,
      swLng: 70,
      neLat: 30,
      neLng: 80,
      day: 1,
      hour: 14,
    });

    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/moments/:id', () => {
  it('should delete own moment', async () => {
    const submitRes = await request(app)
      .post('/api/moments')
      .set('Authorization', `Bearer ${token}`)
      .send({ lat: 28.632, lng: 77.212, tag: 'calm', dayOfWeek: 3, hourSlot: 8 });

    const res = await request(app)
      .delete(`/api/moments/${submitRes.body.data._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should reject deleting another users moment', async () => {
    const submitRes = await request(app)
      .post('/api/moments')
      .set('Authorization', `Bearer ${token}`)
      .send({ lat: 28.633, lng: 77.213, tag: 'lively', dayOfWeek: 4, hourSlot: 20 });

    const res = await request(app)
      .delete(`/api/moments/${submitRes.body.data._id}`)
      .set('Authorization', `Bearer ${otherToken}`);

    expect(res.status).toBe(403);
  });
});

describe('PATCH /api/moments/:id', () => {
  it('should update note on own moment', async () => {
    const submitRes = await request(app)
      .post('/api/moments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        lat: 28.634,
        lng: 77.214,
        tag: 'crowded',
        note: 'Original',
        dayOfWeek: 0,
        hourSlot: 12,
      });

    const res = await request(app)
      .patch(`/api/moments/${submitRes.body.data._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ note: 'Updated note' });

    expect(res.status).toBe(200);
    expect(res.body.data.note).toBe('Updated note');
  });
});
