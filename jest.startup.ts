import * as jestCli from 'jest-cli'
import { Server } from "./server/server"
import { environment } from "./common/environment"
import { usersRouter } from "./users/users.router"
import { User } from "./users/users.model"


let server: Server
const beforeAllTests = () => {
    environment.db.url = 'mongodb://localhost/auth-pro-test'
    environment.server.port = 4001

    server = new Server()
    return server.bootstrap([usersRouter])
        .then(() => User.deleteMany().exec())
        .then(() => {
            let admin = new User()
            admin.firstName = 'admin'
            admin.email = 'admin@email.com'
            admin.password = '123456'
            admin.profiles = ['admin', 'user']
            return admin.save()
        })
        .catch(console.error)
}

const afterAllTests = () => {
    return server.shutdown()
}


beforeAllTests().
    then(() => jestCli.run())
    .then(() => afterAllTests())
    .catch(console.error)