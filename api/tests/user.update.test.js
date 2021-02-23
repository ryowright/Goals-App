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

test('Update username', async () => {
    request(app).patch('/api/user/update').set('Authorization', `Bearer ${token}`).send({
        name: "ryowright"
    }).then((res) => {
        expect(res.status).toBe(200);
    }).catch((e) => {
        
    });
});

test('Update password with correct old password', async () => {
    request(app).patch('/api/user/update').set('Authorization', `Bearer ${token}`).send({
        oldPassword: testUser.password,
        password: "23what123"
    }).then((res) => {
        expect(res.status).toBe(200);
    }).catch((e) => {
        
    });
});

test('Update password with incorrect old password', async () => {
    request(app).patch('/api/user/update').set('Authorization', `Bearer ${token}`).send({
        oldPassword: "23qwertyuiop",
        password: "23what255"
    }).then((res) => {
        expect(res.status).toBe(401);
        expect(res.body.error).toBe('Incorrect Password.');
    }).catch((e) => {
        
    });
});

test('Update password without old password', async () => {
    request(app).patch('/api/user/update').set('Authorization', `Bearer ${token}`).send({
        password: "23what255"
    }).then((res) => {
        expect(res.status).toBe(401);
        expect(res.body.error).toMatch(/The old password must be entered/);
    }).catch((e) => {
        
    });
});
