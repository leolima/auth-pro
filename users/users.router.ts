import * as restify from 'restify'
import { NotFoundError } from 'restify-errors'
import { ModelRouter } from '../common/model-router'
import { Router } from '../common/router'
import { User } from './users.model'

class UsersRouter extends ModelRouter<User> {
    constructor() {
        super(User)

        /**
         * Removing password from document
         */
        this.on('beforeRender', document => {
            document.password = undefined
        })
    }

    findByEmailRoute = (req, resp, next) => {
        if (req.query.email) {
            User.findByEmail(req.query.email)
                .then(user => (user ? [user] : []))
                .then(this.renderAll(resp, next))
                .catch(next)
        } else {
            next()
        }
    }

    applyRoutes(application: restify.Server) {
        application.get(`${ this.basePath }`, restify.plugins.conditionalHandler([
            { version: '1.0.0', handler: this.findAll },
            { version: '2.0.0', handler: this.findByEmailRoute }
        ]))
        application.get(`${ this.basePath }/:id`, [this.validateId, this.findById])
        application.post(`${ this.basePath }`, this.save)
        application.put(`${ this.basePath }/:id`, [this.validateId, this.replace])
        application.patch(`${ this.basePath }/:id`, [this.validateId, this.update])
        application.del(`${ this.basePath }/:id`, [this.validateId, this.delete])
    }
}

export const usersRouter = new UsersRouter()