export const environment = {
    server: { port: process.env.SERVER_PORT || 4000 },
    db: { url: process.env.DB_URL || 'mongodb://localhost/auth-pro' },
    security: {
        saltRounds: process.env.SALT_ROUNDS || 10,
        apiSecret: process.env.API_SECRET || 'auth-pro-secret',
        enableHTTPS: process.env.ENABLE_HTTPS || false,
        certificate: process.env.CERT_FILE || './security/keys/cert.pem',
        key: process.env.CERT_KEY_FILE || './security/keys/key.pem',
    }
}