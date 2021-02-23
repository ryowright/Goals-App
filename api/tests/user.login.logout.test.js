const app = require('../src/app');
const request = require('supertest');
const User = require('../src/models/user');

const testUserRegister = {
    name: 'Ryo',
    email: 'ryo131@example.com',
    password: '23what!!32'
}

const testUserLogin = {
    name: 'RyoW',
    email: 'ryo132@example.com',
    password: '23what!!3244',
    isVerified: true
}

const loginPath = '/api/user/login';


beforeAll(async () => {
    await User.deleteMany();
    await new User(testUserLogin).save();
    await new User(testUserRegister).save();
});

afterAll(async () => {
    await User.deleteMany();
});

// TESTS FOR LOGIN AND LOGOUT ROUTES
test('Login a user', async () => {
    await request(app).post(loginPath).send({
        ...testUserLogin
    }).then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Login successful!');
    })
});

test('Incorrect username login', async () => {
    await request(app).post(loginPath).send({
        ...testUserLogin,
        name: 'ryoH23'
    }).then((res) => {
        expect(res.status).toBe(401);
        expect(res.body.error).toBe('Incorrect Username and/or Password.');
    });
});


test('Incorrect password login', async () => {
    await request(app).post(loginPath).send({
        ...testUserLogin,
        password: '23hello!!'
    }).then((res) => {
        expect(res.status).toBe(401);
        expect(res.body.error).toBe('Incorrect Username and/or Password.');
    });
});


test('Login of unverified user should fail', async () => {
    await request(app).post(loginPath).send({
        ...testUserRegister
    }).then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/User is not yet verified./)
    })
});

test('Logout', async () => {
    const user = await User.findOne({name: testUserLogin.name});

    await request(app).post('/api/user/logout').set('Authorization', `Bearer ${user.tokens[0].token}`).send({
        ...testUserLogin,
    }).then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Logout successful.');
    })
});