const app = require('../src/app');
const request = require('supertest');
const User = require('../src/models/user');
const Goal = require('../src/models/goal');

let token;
let goal;
let user;

const testUser = {
    name: 'ryo',
    email: 'ryow@example.com',
    password: '23what!!32',
}

const newGoal = {
    goal: 'test',
    renewable: false,
    setNumericGoal: false,
    deadline: null,
    renewType: null,
    progress: null,
    numericGoal: null
}

beforeAll(async () => {
    await Goal.deleteMany();
    await User.deleteMany();
    user = new User(testUser);
    token = await user.generateAuthToken();
    await user.save();
});

beforeEach(async () => {
    goal = await new Goal({ ...newGoal, owner: user._id }).save();
});

afterAll(async () => {
    await Goal.deleteMany();
    await User.deleteMany();
});

test('Successfully delete one goal', async () => {
    await request(app).delete(`/api/goal/delete-one/${goal._id}`).set('Authorization', `Bearer ${token}`)
    .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).toMatch(/Goal succesfully deleted./);
    });
});

test('Attempt to delete one goal with invalid id', async () => {
    await request(app).delete(`/api/goal/delete-one/abc123`).set('Authorization', `Bearer ${token}`)
    .then((res) => {
        expect(res.status == 404 || res.status == 500);
    });
});

test('Successfully delete all goals', async () => {
    await request(app).delete('/api/goal/delete-all').set('Authorization', `Bearer ${token}`)
    .send({
        password: testUser.password
    }).then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).toMatch(/Deleted all goals successfully./);
    });
});

test('Attempt to delete all goals with incorrect password', async () => {
    await request(app).delete('/api/goal/delete-all').set('Authorization', `Bearer ${token}`)
    .send({
        password: 'wrongpassword123',
    }).then((res) => {
        expect(res.status == 401 || res.status == 400);
    });
});

