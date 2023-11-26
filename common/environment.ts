export const environment = {
    server: { port: process.env.SERVER_PORT || 4000 },
    db: { 
        host     : process.env.DB_HOST || 'localhost',
        port     : process.env.DB_PORT || '13306',
        user     : process.env.DB_USER || 'sqluser',
        password : process.env.DB_PASSWORD || '123456',
        database : process.env.DB_DATABASE || 'dbsei',
        pagination: process.env.DB_PAGINATION || 10,
    },
    security: {
        saltRounds: process.env.SALT_ROUNDS || 10,
        apiSecret: process.env.API_SECRET || 'auth-pro-secret',
        enableHTTPS: process.env.ENABLE_HTTPS || false,
        certificate: process.env.CERT_FILE || './security/keys/cert.pem',
        key: process.env.CERT_KEY_FILE || './security/keys/key.pem',
    },
    log: {
        level: process.env.LOG_LEVEL || 'debug',
        name: 'auth-pro'
    }
}