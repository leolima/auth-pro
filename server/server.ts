import * as fs from 'fs'
import * as restify from 'restify'
import * as mongoose from 'mongoose'
import * as corsMiddleware from 'restify-cors-middleware2'
import { Router } from '../common/router'
import { mergePatchBodyParser } from './merge-patch.parser'
import { environment } from '../common/environment'
import { handleError } from './error.handler'
import { tokenParser } from '../security/token.parser'
import { logger } from '../common/logger'

export class Server {
    application: restify.Server

    initializeDb() {
        return mongoose.connect(environment.db.url)
    }

    initRoutes(routers: Router[]): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                const options: restify.ServerOptions = {
                    name: 'auth-pro',
                    version: '1.0.0',
                    log: logger
                }

                // Enabling https
                if (environment.security.enableHTTPS) {
                    options.certificate = fs.readFileSync(environment.security.certificate)
                    options.key = fs.readFileSync(environment.security.key)
                }

                this.application = restify.createServer(options)

                // Cors configs
                const cors = corsMiddleware({
                    preflightMaxAge: 10, //Optional
                    origins: ['*'],
                    allowHeaders: ['authorization'],
                    exposeHeaders: ['x-custom-header']
                })
                this.application.pre(cors.preflight)
                this.application.use(cors.actual)

                // Log config
                this.application.pre(restify.plugins.requestLogger({
                    log: logger
                }))

                // Middleware to parse data
                this.application.use(restify.plugins.queryParser())
                this.application.use(restify.plugins.bodyParser())
                this.application.use(mergePatchBodyParser)

                // Bearer authentication parser
                this.application.use(tokenParser)

                for (let router of routers) {
                    router.applyRoutes(this.application)
                }

                this.application.listen(environment.server.port, () => {
                    resolve(this.application)
                })

                // Centralizing all errors
                this.application.on('restifyError', handleError)

                // Enabling log responses
                this.application.on('after', restify.plugins.auditLogger({
                    log: logger,
                    event: 'after'
                }))

            } catch (error) {
                reject(error)
            }
        })
    }

    bootstrap(routers: Router[] = []): Promise<Server> {
        return this.initializeDb()
            .then(() => this.initRoutes(routers)
                .then(() => this))
    }

    shutdown() {
        return mongoose.disconnect().then(() => this.application.close())
    }
}