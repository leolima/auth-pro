import * as restify from 'restify'
import { environment } from '../common/environment'
import { Router } from '../common/router'

export class Server {
    application: restify.Server

    initRoutes(routers: Router[]): Promise<any> {
        return new Promise((resolve, reject) => {
            try {

                this.application = restify.createServer({
                    name: 'auth-pro',
                    version: '1.0.0',
                })

                this.application.use(restify.plugins.queryParser())

                for (let router of routers) {
                    router.applyRoutes(this.application)
                }

                this.application.listen(environment.server.port, () => {
                    resolve(this.application)
                    //console.log('API is running on http://localhost:4000')zz
                })

            } catch (error) {
                reject(error)
            }
        })
    }

    bootstrap(routers: Router[] = []): Promise<Server> {
        return this.initRoutes(routers).then(() => this)
    }
}