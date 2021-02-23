const app = require('../src/app');
const request = require('supertest');
const User = require('../src/models/user');
const Goal = require('../src/models/goal');

let token;
let goal;

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
    const user = new User(testUser);
    token = await user.generateAuthToken();
    await user.save();
    goal = await new Goal({ ...newGoal, owner: user._id }).save();
});

afterAll(async () => {
    await Goal.deleteMany();
    await User.deleteMany();
});

test('Update a goal successfully', async () => {
    await request(app).patch(`/api/goal/update-one/${goal._id}`).set('Authorization', `Bearer ${token}`)
    .send({
        goal: 'Go to the gym at least three times this week',
        setNumericGoal: true,
        progress: 0,
        numericGoal: 3
    }).then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).toMatch(/Updated goal successfully./);
    });
});

test('Attempt to update a goal with invalid update keys', async () => {
    await request(app).patch(`/api/goal/update-one/${goal._id}`).set('Authorization', `Bearer ${token}`)
    .send({
        goal: 'Go to the gym at least three times this week',
        setNumericGoal: true,
        progress: 0,
        numericGoal: 3,
        description: 'this key should cause an error'
    }).then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/Invalid updates./);
    });
});

test('Attempt to update a goal with empty string as goal', async () => {
    await request(app).patch(`/api/goal/update-one/${goal._id}`).set('Authorization', `Bearer ${token}`)
    .send({
        goal: '',
        setNumericGoal: true,
        progress: 0,
        numericGoal: 3,
    }).then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/Required fields must be/);
    });
});

test('Attempt to update a goal with renewable = true and no renewType', async () => {
    await request(app).patch(`/api/goal/update-one/${goal._id}`).set('Authorization', `Bearer ${token}`)
    .send({
        goal: 'Go to the gym',
        setNumericGoal: true,
        progress: 0,
        numericGoal: 3,
        renewable: true
    }).then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/Required fields must be/);
    });
});

test('Attempt to update a goal with setNumericGoal = true and no progress', async () => {
    await request(app).patch(`/api/goal/update-one/${goal._id}`).set('Authorization', `Bearer ${token}`)
    .send({
        goal: 'Go to the gym',
        setNumericGoal: true,
        numericGoal: 3,
    }).then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/Required fields must be/);
    });
});

test('Attempt to update a goal with progress greater than numeric goal', async () => {
    await request(app).patch(`/api/goal/update-one/${goal._id}`).set('Authorization', `Bearer ${token}`)
    .send({
        goal: 'Go to the gym',
        setNumericGoal: true,
        progress: 5,
        numericGoal: 3,
    }).then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/Current progress cannot be/);
    });
});

test('Attempt to update a goal with invalid goal id', async () => {
    request(app).patch(`/api/goal/update-one/abc123`).set('Authorization', `Bearer ${token}`)
    .send({
        goal: 'Go to the gym',
        setNumericGoal: true,
        progress: 2,
        numericGoal: 3,
    }).then((res) => {
        expect(res.status == 400 || res.status == 404);
    });
});