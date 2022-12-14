import * as restify from 'restify'
import * as jwt from 'jsonwebtoken'
import { User } from '../users/users.model'
import { environment } from '../common/environment'

/**
 * Verify authentication token 
 */
export const tokenParser: restify.RequestHandler = (req, resp, next) => {
    const token = extractToken(req)
    if (token) {
        jwt.verify(token, environment.security.apiSecret, applyBearer(req, next))
    } else {
        next()
    }
}

/**
 * Extract the token from the string `Bearer <token>`
 */
function extractToken(req: restify.Request) {
    //Authorization: Bearer TOKEN
    const authorization = req.header('authorization')
    if (authorization) {
        const parts: string[] = authorization.split(' ')
        if (parts.length === 2 && parts[0] === 'Bearer') {
            return parts[1]
        }
    }

    return undefined
}

/**
 * Puts the user on req if authenticated
 */
function applyBearer(req: restify.Request, next): (error, decoded) => void {
    return (error, decoded) => {
        if (decoded) {
            User.findByEmail(decoded.sub).then(user => {
                if (user) {
                    req.authenticated = user
                }
                next()
            })
        } else {
            next()
        }
    }
}