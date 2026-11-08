const request = require('supertest')
const app = require('../../app')
const { resetTestDB } = require('./config')
// const { response } = require('express')
// const expectCookies = require('supertest/lib/cookies')

describe('Goat API endpoints', () => {
let api

    beforeEach(async () => {
        await resetTestDB()     //calling the function that reset the database that was written in the config file
    })    //before each single test is run this function will run 

    beforeAll(() => {
        api = app.listen(5000, () => {
            console.log('Test server running on the port 5000')
        })      //before all the test we will call app to listen 
    })
    afterAll((done) => {
        console.log('Gracefully stopping the test server')
        api.close(done)
    })      //ran after all the test

    describe('GET /', () => {
        it('responds to GET / with a message and a description', async () => {
            const response = await request(api).get('/')

            expect (response.statusCode).toBe(200)
            expect(response.body.message).toBe('welcome')
            expect(response.body.description).toBe('GOAT API')
        })
    })

    describe('GET /goats', () => {
        it('it should return all goats with a status code 200', async () => {
            const response = await request(api).get('/goats')

            expect(response.status).toBe(200)
            expect(response.body.data).toBeInstanceOf(Array)
            expect(response.body.data.length).toBeGreaterThan(0)
        })
    })
    describe('GET /goats/:id', () => {
        it('should return a specific goat by ID', async () => {
            const goatId = 1
            const response = await request(api).get(`/goats/${goatId}`)

            expect(response.status).toBe(200)
            expect(response.body.data).toHaveProperty('id', goatId)

        })

        it('should return a 404 if goat is not found', async () => {
            const nonGoatId = 999
            const response = await request(api).get(`/goats/${nonGoatId}`)

            expect(response.status).toBe(404)
            expect(response.body.error).toBe('This goat does not exist!')
        })
    })

    describe('POST /goats', () => {
        it('should create a new goat and return it', async () => {
            const newGoat = { name: 'Becca', age: 3}
            const response = await request(api)
                .post('/goats')
                .send(newGoat)

            expect(response.status).toBe(201)
            expect(response.body.data).toHaveProperty('name', 'Becca')
            expect(response.body.data).toHaveProperty('age', 3)
        })
        it('should return 400 if required fields are missing', async () => {
            const incompleteGoat = {name: 'Becca'}
            const response = await request(api)
                .post('/goats')
                .send(incompleteGoat)

            expect(response.status).toBe(400)
            expect(response.body.error).toBe('age is missing')
        })
    })

    describe('PATCH /goats/:id', () => {
        it('should update an existing goat and return it', async () => {
            const goatId = 1
            const updateGoat = {name: 'Amanda', age: 5}
            const response = await request(api)
                .patch(`/goats/${goatId}`)
                .send(updateGoat)

            expect(response.status).toBe(200)
            expect(response.body.data).toHaveProperty('name', 'Amanda')
            expect(response.body.data).toHaveProperty('age', 5)

        })
        it('should return 400 if the updates does not exist', async () => {
            const nonGoatId = 999
            const updateData = { name: 'Amanda', age: 5}
            const response = await request(api)
                .patch(`/goats/${nonGoatId}`)
                .send(updateData)

            expect(response.status).toBe(400)
            expect(response.body.error).toBe('This goat does not exist!')
        })
    })

    describe('DELETE /goats/:id', () => {
        it('should delete a goat and return a 204 status code', async () => {
            const goatId = 1;
            const response = await request(api).delete(`/goats/${goatId}`);

            expect(response.status).toBe(204);
        });

        it('should return 404 if the goat to delete does not exist', async () => {
            const nonGoatId = 999;
            const response = await request(api).delete(`/goats/${nonGoatId}`);

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('This goat does not exist!');
        });
    });

})