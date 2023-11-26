import { environment } from '../common/environment'
import { users } from './users'
const mysql = require('mysql')

const query = (sql: string): Promise<any> => {
    return new Promise((res, rej) => {
        var db = mysql.createConnection({
            host     : environment.db.host,
            port     : environment.db.port,
            user     : environment.db.user,
            password : environment.db.password,
            database : environment.db.database
        });
        try {
            db.connect((error) => {
                if (error) { rej(error) }
                db.query(sql, (err, results) => {
                    db.end();
                    if (err) { 
                        rej(err) }
                    res(results)
                });
            });
        } catch (error) {
            console.error('MYSQL', error)
        }
    });
}

const usersModule = users(query)

export default {
    users: () => usersModule,
}
