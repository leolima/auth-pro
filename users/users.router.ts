import * as restify from 'restify'
import { NotFoundError } from 'restify-errors'
import { Router } from '../common/router'
import { User } from './users.model'

class UsersRouter extends Router {

    constructor() {
        super()

        /**
         * Removing password from document
         */
        this.on('beforeRender', document => {
            document.password = undefined
        })
    }

    applyRoutes(application: restify.Server) {
        /**
         * Get All users
         */
        application.get('/users', (req, resp, next) => {
            User.find()
                .then(this.render(resp, next))
                .catch(next)
        })

        /**
         * Find User
         */
        application.get('/users/:id', (req, resp, next) => {
            User.findById(req.params.id)
                .then(this.render(resp, next))
                .catch(next)
        })

        /**
         * Add User
         */
        application.post('/users', async (req, resp, next) => {
            let user = new User(req.body)
            user.save()
                .then(this.render(resp, next))
                .catch(next)
        })

        /**
         * Replace User
         */
        application.put('/users/:id', (req, resp, next) => {
            const options = { runValidators: true }
            User.replaceOne({ _id: req.params.id }, req.body, options)
                .then(result => {
                    if (result.matchedCount) {
                        User.findById(req.params.id).then(this.render(resp, next))
                    } else {
                        throw new NotFoundError('Document not found!')
                    }
                })
                .catch(next)
        })

        /**
         * Update user
         */
        application.patch('/users/:id', (req, resp, next) => {
            const options = { new: true, runValidators: true }
            User.findByIdAndUpdate(req.params.id, req.body, options)
                .then(this.render(resp, next))
                .catch(next)
        })

        /**
        * Delete user
        */
        application.del('/users/:id', (req, resp, next) => {
            User.deleteOne({ _id: req.params.id })
                .then(result => {
                    if (result.deletedCount) {
                        resp.send(204)
                    } else {
                        throw new NotFoundError('Document not found!')
                    }
                    return next()
                })
                .catch(next)
        })
    }
}

export const usersRouter = new UsersRouter()