export const environment = {
    server: { port: process.env.SERVER_PORT || 4000 },
    db: { url: process.env.DB_URL || 'mongodb://localhost/auth-pro' },
    security: {
        saltRounds: process.env.SALT_ROUNDS || 10,
        apiSecret: process.env.API_SECRET || 'auth-pro-secret'
    }
}