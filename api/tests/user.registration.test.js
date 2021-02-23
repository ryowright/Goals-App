const app = require('../src/app');
const request = require('supertest');
const User = require('../src/models/user');

const testUserRegister = {
    name: 'Ryo',
    email: 'ryo131@example.com',
    password: '23what!!32'
}

const testExistingUser = {
    name: 'RyoW',
    email: 'ryo132@example.com',
    password: '23what!!3244',
    isVerified: true
}

const path = '/api/user/register';

beforeEach(async () => {
    await User.deleteMany();
    await new User(testExistingUser).save();
});

afterAll(async () => {
    await User.deleteMany();
})

// TESTS FOR REGISTRATION ROUTE
test('Signup a new user successfully', async () => {
    await request(app).post(path).send({
        ...testUserRegister
    }).then((res) => {
        expect(res.status).toBe(201);
        expect(res.body.message).toBe('Verification email has been sent.');
    });
});

test('Attempt to use name that already exists', async () => {
    await request(app).post(path).send({
        ...testExistingUser
    }).then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Username already taken.');
    });
});

test('Attempt to use email that already exists', async () => {
    await request(app).post(path).send({
        name: 'ryowright',
        email: testExistingUser.email,
        password: 'qwerty123'
    }).then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('There is already an account registered with this email.');
    });
});

test('Attempt to use invalid email', async () => {
    await request(app).post(path).send({
        ...testUserRegister,
        name: 'ryoooo',
        email: 'ryooooo@'
    }).then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Invalid email address.');
    });
});


test('Attempt to use password that is too short', async () => {
    await request(app).post(path).send({
        ...testUserRegister,
        password: 'test1'
    }).then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Password must be at least 6 characters long.');
    });
});
