const app = require('../src/app');
const request = require('supertest');
const User = require('../src/models/user');

const testUser = {
    name: "Ryo",
    email: "ryo@example.com",
    password: "23qwerty!!44",
}

let token;

beforeAll(async () => {
    await User.deleteMany();
    const user = new User(testUser);
    token = await user.generateAuthToken();
    await user.save();
});

afterAll(async () => {
    await User.deleteMany();
});

test('Successfully delete user', async () => {
    request(app).delete('/api/user/me').set('Authorization', `Bearer ${token}`).send({
        password: testUser.password
    }).then((res) => {
        expect(res.body.message).toBe('Account successfully deleted.');
    }).catch((e) => {

    });
});

test('Attempt delete with incorrect password', async () => {
    request(app).delete('/api/user/me').set('Authorization', `Bearer ${token}`).send({
        password: "qwertyuiop"
    }).then((res) => {
        expect(res.status).toBe(401);
        expect(res.body.error).toBe('Incorrect Password.');
    }).catch((e) => {

    });
});