import * as restify from 'restify'

const mpContentType = 'application/merge-patch+json'

/**
 * Body Parser for application/merge-patch+json method
 * @param req 
 * @param resp 
 * @param next 
 * @returns 
 */
export const mergePatchBodyParser = (req: restify.Request, resp: restify.Response, next) => {
    if (req.getContentType() === mpContentType && req.method === 'PATCH') {
        try {
            req.body = JSON.parse(req.body)
        } catch (e) {
            return next(new Error(`Invalid content: ${ e.message }`))
        }
    }

    return next()
}