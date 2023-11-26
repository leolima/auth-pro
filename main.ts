import { Server } from './server/server'
import { usersRouter } from './routes/users.router'
import { statusesRouter } from './routes/status.router'

const server = new Server()

server.bootstrap([usersRouter, statusesRouter]).then(server => {
    console.log("Server is listeninng on:", server.application.address())
}).catch(error => {
    console.log('Server failed to start')
    console.error(error)
    process.exit(1)
})