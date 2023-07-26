module.exports = {
  HOST: "tiny.db.elephantsql.com",
    USER: "slwiqpwz",
    PASSWORD: "zOBvmpKtPd00CIFXR-ur8N4hk1vEVC8Z",
    DB: "slwiqpwz",
    dialect: "postgres",
    dialectOptions: {
      idle_in_transaction_session_timeout: 1000
    },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 1000
  }
};