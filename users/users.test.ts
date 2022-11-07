import 'jest'
import * as request from 'supertest'

const BASE_URL = (<any>global).address
const auth: string = (<any>global).auth

test('get /users', () => {
    return request(BASE_URL)
        .get('/users')
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body.items).toBeInstanceOf(Array)
        }).catch(console.error)
})

test('post /users', () => {
    return request(BASE_URL)
        .post('/users')
        .send({
            firstName: 'User 1',
            email: 'user1@mail.com',
            password: '123456'
        })
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body._id).toBeDefined()
            expect(response.body.firstName).toBe('User 1')
            expect(response.body.email).toBe('user1@mail.com')
            expect(response.body.password).toBeUndefined()
        }).catch(console.error)
})

test('get /users/aaaa - not found', () => {
    return request(BASE_URL)
        .get('/users/aaaa')
        .then(response => {
            expect(response.status).toBe(404)
        }).catch(console.error)
})

test('patch /users/:id', () => {
    return request(BASE_URL)
        .post('/users')
        .send({
            firstName: 'User 2',
            email: 'user2@mail.com',
            password: '123456'
        })
        .then(response => {
            request(BASE_URL)
                .patch(`/users/${ response.body._id }`)
                .send({
                    firstName: 'usuario2 - patch'
                })
                .then(response => {
                    expect(response.status).toBe(200)
                    expect(response.body._id).toBeDefined()
                    expect(response.body.firstName).toBe('usuario2 - patch')
                    expect(response.body.email).toBe('user2@mail.com')
                    expect(response.body.password).toBeUndefined()
                }).catch(console.error)
        })
})
