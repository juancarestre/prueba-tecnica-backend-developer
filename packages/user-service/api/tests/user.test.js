const request = require('supertest');
const {
    app
} = require('../app');
const expect = require('expect');

const {
    User
} = require('../models/userModel');

const {
    users,
    populateUsers
} = require('./seeds/user.test.seed');

beforeEach(populateUsers);

describe('GET user/me', () => {
    it('user/me Should get a user with the token', (done) => {
        request(app)
            .get('/user/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                expect(res.status).toBe(200);
                expect(res.body.email).toBe(users[0].email);
                expect(res.body.password).not.toBe(users[0].password);
                expect(res.body.name).toBe(users[0].name);
                done();
            });
    });

    it('user/me Should not get a user with invalid token', (done) => {
        request(app)
            .get('/user/me')
            .set('x-auth', 'asdsadsad')
            .expect(401)
            .end((err, res) => {
                expect(res.status).toBe(401);
                done();
            });
    });

    it('user/me Should not get a user with incorrect token', (done) => {
        request(app)
            .get('/user/me')
            .set('x-auth', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YzkxNGRhZWM2MzAxMjAwMmFmMWY3YWQiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTUzMDI2NDc4LCJleHAiOjE1NTU2MTg0Nzh9.30EyVud7wNPVs2BzTIW-lVyk4ZwDFQ_mE_YRvlRG_gj')
            .expect(401)
            .end((err, res) => {
                expect(res.status).toBe(401);
                done();
            });
    });
});

describe('POST user/create', () => {
    it('user/ Should create a new user', (done) => {
        const testUser = {
            email: 'restrepo@hotmail.com',
            password: '123456',
            name: 'restrepo',
        };

        request(app)
            .post('/user/create')
            .send(testUser)
            .expect(200)
            .end((err, res) => {
                expect(res.status).toBe(200);
                expect(res.body.email).toBe(testUser.email);
                expect(res.body.name).toBe(testUser.name);
                done();
            });
    });

    it('user/ Should not create user with an invalid password', (done) => {
        const testUser = {
            email: 'restrepo@hotmail.com',
            password: '1',
            name: 'restrepo',
        };

        request(app)
            .post('/user/create')
            .send(testUser)
            .expect(400)
            .end((err, res) => {
                expect(res.status).toBe(400);
                expect(res.body.password.name).toBe('ValidatorError');
                done();
            });
    });

    it('user/ Should not create user for invalid email', (done) => {
        const testUser = {
            email: 'rest@repo@hotmail.com',
            password: '1',
            name: 'restrepo',
        };

        request(app)
            .post('/user/create')
            .send(testUser)
            .expect(400)
            .end((err, res) => {
                expect(res.status).toBe(400);
                expect(res.body.email.name).toBe('ValidatorError');
                done();
            });
    });

});


describe('POST user/login', () => {

    it('user/login get logged a user', (done) => {
        const email = users[0].email
        const password = users[0].password
        const name = users[0].name
        request(app)
            .post('/user/login')
            .send({
                email,
                password
            })
            .expect(200)
            .end((err, res) => {
                expect(res.status).toBe(200);
                expect(res.body.email).toBe(email);
                expect(res.body.name).toBe(name);
                expect(res.body.token).toBeTruthy();
                done();
            });
    });

    it('user/login should no get logged a user', (done) => {
        const email = users[0].email
        const password = 'asdasd'
        const name = users[0].name
        request(app)
            .post('/user/login')
            .send({
                email,
                password
            })
            .expect(200)
            .end((err, res) => {
                expect(res.status).not.toBe(200);
                expect(res.body.email).not.toBe(email);
                expect(res.body.name).not.toBe(name);
                expect(res.body.token).toBeFalsy();
                done();
            });
    });

});

describe('GET user/me/cart', () => {

    it('user/me/cart', (done) => {

        request(app)
            .get('/user/me/cart')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                expect(res.status).toBe(200);
                expect(res.body.cartList.map(element => {
                    return element
                }).join(',')).toContain(users[0].cart);
                done();
            });
    });

});