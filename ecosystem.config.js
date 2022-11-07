module.exports = {
  apps: [
    {
      name: "auth-pro",
      script: "./dist/main.js",
      instances: 0,
      exec_mode: "cluster",
      //watch: true,
      merge_logs: true,
      env: {
        SERVER_PORT: 4000,
        DB_URL: "mongodb://localhost/auth-pro",
        NODE_ENV: "development",
      },
      env_production: {
        SERVER_PORT: 4001,
        NODE_ENV: "production",
      },
    },
  ],
};
