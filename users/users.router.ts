import * as restify from 'restify'
import { Router } from '../common/router'
import { User } from './users.model'

class UsersRouter extends Router {
    applyRoutes(application: restify.Server) {
        /**
         * Get All users
         */
        application.get('/users', (req, resp, next) => {
            User.find()
                .then(users => {
                    resp.json(users)
                    return next()
                })
        })

        /**
         * Find User
         */
        application.get('/users/:id', (req, resp, next) => {
            User.findById(req.params.id || undefined)
                .then(user => {
                    if (user) {
                        resp.json(user)
                        return next()
                    }
                    resp.send(404)
                    return next()
                })
        })

        /**
         * Add User
         */
        application.post('/users', async (req, resp, next) => {
            let user = new User(req.body)
            user.save()
                .then(user => {
                    user.password = undefined
                    resp.json(user)
                    return next()
                })
        })

        /**
         * Replace User
         */
        application.put('/users/:id', (req, resp, next) => {
            User.replaceOne({ _id: req.params.id || undefined }, req.body)
                .then(result => {
                    if (result.matchedCount) {
                        User.findById(req.params.id).then(user => {
                            resp.json(user)
                            return next()
                        })
                    } else {
                        resp.send(404)
                        return next()
                    }
                })
        })

        /**
         * Update user
         */
        application.patch('/users/:id', (req, resp, next) => {
            const options = { new: true }
            User.findByIdAndUpdate(req.params.id || undefined, req.body, options)
                .then(user => {
                    if (user) {
                        resp.json(user)
                        return next()
                    } else {
                        resp.send(404)
                        return next()
                    }
                })
        })

        /**
        * Delete user
        */
        application.del('/users/:id', (req, resp, next) => {
            User.deleteOne({ _id: req.params.id || undefined }).then(result => {
                if (result.deletedCount) {
                    resp.send(204)
                } else {
                    resp.send(404)
                }
                return next()
            })
        })
    }
}

export const usersRouter = new UsersRouter()