const app = require('../src/app');
const request = require('supertest');
const User = require('../src/models/user');
const Goal = require('../src/models/goal');

let token;

const path = '/api/goal/create';

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
});

afterEach(async () => {
    await Goal.deleteMany();
});

afterAll(async () => {
    await User.deleteMany();
})

test('Create goal successfully', async () => {
    await request(app).post(path).set('Authorization', `Bearer ${token}`)
    .send({...newGoal})
    .then((res) => {
        expect(res.status).toBe(201);
    });
});

test('Create goal with empty string as goal', async () => {
    await request(app).post(path).set('Authorization', `Bearer ${token}`)
    .send({
        goal: ""
    }).then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/Required fields must be/);
    }).catch();
});

test('Create goal with renewable = true and no renewType', async () => {
    await request(app).post(path).set('Authorization', `Bearer ${token}`)
    .send({
        goal: "test",
        renewable: true
    }).then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/Required fields must be/);
    }).catch();
});

test('Create goal with setNumericGoal = true and no progress', async () => {
    await request(app).post(path).set('Authorization', `Bearer ${token}`)
    .send({
        goal: "test",
        setNumericGoal: true
    }).then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/Required fields must be/);
    }).catch();
});

test('Create goal with progress greater than numeric goal', async () => {
    await request(app).post(path).set('Authorization', `Bearer ${token}`)
    .send({
        goal: "test",
        setNumericGoal: true,
        progress: 10,
        numericGoal: 5
    }).then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/Current progress cannot be greater than/);
    }).catch();
});