import * as restify from 'restify'

/**
 * Error customization
 */
export const handleError = (req: restify.Request, resp: restify.Response, err, done) => {
    Object.defineProperty(err, 'toJSON', {
        value() {
            const alt = {}
            Object.getOwnPropertyNames(this).forEach(function (key) {
                alt[key] = this[key]
            }, this)
            return alt
        },
        configurable: true,
        writable: true
    })

    err.toJSON = () => {
        return {
            message: err.message
        }
    }

    switch (err.name) {
        case 'MongoServerError':
            if (err.code === 11000) {
                err.statusCode = 400
            }
            break
        case 'CastError':
            err.statusCode = 400
            break
        case 'ValidationError':
            err.statusCode = 400
            let errors = {}
            Object.keys(err.errors).forEach(key => {
                errors[key] = err.errors[key]?.message
            })
            err.toJSON = () => {
                return {
                    message: 'Validation error while processing your request',
                    errors
                }
            }
            break

    }
    done()
}