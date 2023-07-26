module.exports = {
  HOST: "65.19.141.77",
  USER: "jagoan_ratel",
  PASSWORD: "RatelPlexus22!",
  DB: "jagoan_dopefrenzy",
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