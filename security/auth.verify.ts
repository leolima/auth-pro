import * as restify from 'restify'
import { ForbiddenError } from 'restify-errors'

/**
 * Block unauthorized user
 */
export const authorize: (...profiles: string[]) => restify.RequestHandler = (...profiles) => {
    return (req, _resp, next) => {
        const hasProfiles = profiles.length > 0 ? profiles.includes(req?.authenticated?.role) : true;
        if (req.authenticated !== undefined && hasProfiles) {
            if (`${req.authenticated.email}`.includes('deleted')) { 
                next(new ForbiddenError("Acesso negado!"))
            }
            console.log('-----------------------------------')
            req.log.debug('***** Usuário %s autorizado para acessar a rota %s.',
                req.authenticated.id,
                req.path(),
            )
            next()
        } else {
            console.log('-------------- Error --------------')
            if (req.authenticated) {
                req.log.debug('***** Acesso negado! Usuário ID: %s. Rota %s',
                    req.authenticated.id,
                    req.path(),
                )
            }
            next(new ForbiddenError("Acesso negado!"))
        }
    }
}