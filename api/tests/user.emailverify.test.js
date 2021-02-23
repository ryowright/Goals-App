const app = require('../src/app');
const request = require('supertest');
const User = require('../src/models/user');
const crypto = require('crypto');

const testUserRegister = {
    name: 'Ryo',
    email: 'ryo131@example.com',
    password: '23what!!32',
    emailToken: crypto.randomBytes(64).toString('hex')
}

beforeEach(async () => {
    await User.deleteMany();
    await new User(testUserRegister).save();
});

afterEach(async () => {
    await User.deleteMany();
});

test('Should hit email verification endpoint successfully', async () => {
    request(app).get('/api/user/verify-email').query({ emailToken: testUserRegister.emailToken })
    .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body.message).toMathch(/success/);
    }).catch((e) => {

    });
});

test('Hit email verification endpoint with invalid emailToken', async () => {
    request(app).get('/api/user/verify-email').query({ emailToken: crypto.randomBytes(64).toString('hex') })
    .then((res) => {
        expect(res.status).toBe(404);
    }).catch((e) => {

    });
});