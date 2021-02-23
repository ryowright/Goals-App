const app = require('../src/app');
const request = require('supertest');
const User = require('../src/models/user');
const Goal = require('../src/models/goal');

let token;

const path = '/api/goal/get-all';

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
    await User.deleteMany();
    const user = new User(testUser);
    token = await user.generateAuthToken();
    await user.save();
    await new Goal({ ...newGoal, owner: user._id }).save();
});

afterAll(async () => {
    await Goal.deleteMany();
    await User.deleteMany();
});

test('Get all goals successfully', async () => {
    await request(app).get(path).set('Authorization', `Bearer ${token}`)
    .then((res) => {
        expect(res.status).toBe(200);
    });
});

test('Attempt to get all goals when there are none', async () => {
    await Goal.deleteMany();
    await request(app).get(path).set('Authorization', `Bearer ${token}`)
    .then((res) => {
        expect(res.status).toBe(400);
    });
});