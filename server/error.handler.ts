import * as restify from 'restify'

/**
 * Error customization
 * @param req 
 * @param resp 
 * @param err 
 * @param done 
 */
export const handleError = (req: restify.Request, resp: restify.Response, err, done) => {
    try {
        err.toJSON = () => {
            return {
                message: err.message
            }
        }
        err.toString = () => {
            return err.message
        }
    } catch (e) { }

    switch (err.name) {
        case 'MongoError':
            if (err.code === 11000) {
                err.statusCode = 400
            }
            break
        case 'CastError':
            err.statusCode = 400
            break
        case 'ValidationError':
            err.statusCode = 400
            Object.keys(err.errors).forEach(key => {
                err.errors[key] = err.errors[key]?.message
            })
            break

    }
    done()
}