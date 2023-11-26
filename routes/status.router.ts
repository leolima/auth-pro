import * as restify from 'restify'
import { Router } from '../common/router'
import { timeDiff } from '../common/utils';

class StatusRouter extends Router {
    time: Date

    constructor() {
        super();
        this.time = new Date();
    }

    applyRoutes(application: restify.Server) {
        application.get(`/status`, [(_req, resp, _next) => {
            resp.json({ message: 'Ok', uptime: timeDiff(new Date().getTime(), this.time.getTime()) })
        }])
    }
}

export const statusesRouter = new StatusRouter()