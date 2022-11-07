import * as restify from 'restify'
import * as jwt from 'jsonwebtoken'
import { NotAuthorizedError } from 'restify-errors'
import { User } from '../users/users.model'
import { environment } from '../common/environment'

/**
 * Login method
 */
export const authenticate: restify.RequestHandler = (req, resp, next) => {
    const { email, password } = req.body
    User.findByEmail(email, '+password')
        .then(user => {
            if (user && user.matches(password)) {
                // token
                const token = jwt.sign({ sub: user.email, iss: 'auth-pro' }, environment.security.apiSecret)
                resp.json({
                    name: user.firstName,
                    email: user.email,
                    accessToken: token
                })
            } else {
                return next(new NotAuthorizedError('Invalid Credentials'))
            }
        })
        .catch(next)
}