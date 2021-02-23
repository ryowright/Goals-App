const app = require('../src/app');
const request = require('supertest');
const User = require('../src/models/user');
const crypto = require('crypto');

const testUser = {
    name: 'Ryo',
    email: 'ryo131@example.com',
    password: '23what!!32'
}

const testUserWithResetToken = {
    name: 'ryow',
    email: 'ryow@gmail.com',
    password: '23what!!32',
    resetToken: crypto.randomBytes(64).toString('hex')
}

beforeEach(async () => {
    await User.deleteMany();
    await new User(testUser).save();
    await new User(testUserWithResetToken).save();
});

afterEach(async () => {
    await User.deleteMany();
});

test('Successfully send password reset email', async () => {
    await request(app).post('/api/user/reset-password-email').send({ email: testUser.email })
    .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Password reset email has been sent.');
    }).catch((e) => {

    });
});

test('Send invalid email format in request body', async () => {
    await request(app).post('/api/user/reset-password-email').send({ email: 'ryo123.com' })
    .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Password reset failed.');
    }).catch((e) => {

    });
});

test('Send email that does not exist in database', async () => {
    await request(app).post('/api/user/reset-password-email').send({ email: 'ryo123@email.com' })
    .then((res) => {
        expect(res.status).toBe(404);
        expect(res.body.error).toMatch(/email does not exist/);
    }).catch((e) => {

    });
});

test('Reset password successfully', async () => {
    await request(app).post('/api/user/reset-password').send({
        resetToken: testUserWithResetToken.resetToken,
        password: 'newpassword'
    })
    .then((res) => {
        expect(res.status).toBe(200);
    }).catch((e) => {

    });
});

test('Attempt password reset with invalid resetToken', async () => {
    await request(app).post('/api/user/reset-password').send({
        resetToken: crypto.randomBytes(64).toString('hex'),
        password: 'newpassword'
    })
    .then((res) => {
        expect(res.status).toBe(404);
    }).catch((e) => {

    });
});

test('Attempt password reset with password that is too short', async () => {
    await request(app).post('/api/user/reset-password').send({
        resetToken: crypto.randomBytes(64).toString('hex'),
        password: 'pass2'
    })
    .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/Password must be at least/);
    }).catch((e) => {

    });
});