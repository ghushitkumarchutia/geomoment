process.env.JWT_SECRET = 'test_jwt_secret_minimum_32_characters_long';
process.env.JWT_EXPIRY = '7d';
process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../src/app');
const { connectDB, disconnectDB, clearDB } = require('./setup');

const validUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
};

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

beforeEach(async () => {
  await clearDB();
});

describe('POST /api/auth/register', () => {
  it('should register with valid data and return token', async () => {
    const res = await request(app).post('/api/auth/register').send(validUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(validUser.email);
    expect(res.body.data.user.name).toBe(validUser.name);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.user.password).toBeUndefined();
  });

  it('should reject duplicate email with 409', async () => {
    await request(app).post('/api/auth/register').send(validUser);
    const res = await request(app).post('/api/auth/register').send(validUser);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('should reject invalid email with 422', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...validUser, email: 'not-an-email' });

    expect(res.status).toBe(422);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors.some((e) => e.field === 'email')).toBe(true);
  });

  it('should reject short password with 422', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...validUser, password: '123' });

    expect(res.status).toBe(422);
    expect(res.body.errors.some((e) => e.field === 'password')).toBe(true);
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/register').send(validUser);
  });

  it('should login with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: validUser.email, password: validUser.password });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.user.email).toBe(validUser.email);
  });

  it('should reject wrong password with 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: validUser.email, password: 'wrongpassword' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should reject non-existent email with 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'password123' });

    expect(res.status).toBe(401);
  });
});

describe('Protected route access', () => {
  it('should reject without token', async () => {
    const res = await request(app).get('/api/users/me/profile');

    expect(res.status).toBe(401);
  });

  it('should reject with invalid token', async () => {
    const res = await request(app)
      .get('/api/users/me/profile')
      .set('Authorization', 'Bearer invalidtoken123');

    expect(res.status).toBe(401);
  });

  it('should accept with valid token', async () => {
    const regRes = await request(app).post('/api/auth/register').send(validUser);
    const token = regRes.body.data.accessToken;

    const res = await request(app)
      .get('/api/users/me/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe(validUser.name);
    expect(res.body.data.email).toBe(validUser.email);
  });
});
