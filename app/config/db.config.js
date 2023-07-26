const fs = require('fs');
const path = require('path');
module.exports = {
    HOST: "database-1.caaq62uigts9.ap-southeast-1.rds.amazonaws.com",
    USER: "postgres",
    PASSWORD: "rqIGlz5x2iFPArVBLXIx",
    DB: "postgres",
    // HOST: "user-prod-us-east-2-1.cluster-cfi5vnucvv3w.us-east-2.rds.amazonaws.com",
    // USER: "shooting-star-main-db-0566c731c8e780280",
    // PASSWORD: "DacHg9bCc6NERpPRAtYkNBYkxXPJe9",
    // DB: "shooting-star-main-db-0566c731c8e780280",
    dialect: "postgres",
    dialectOptions: {
      idle_in_transaction_session_timeout: 1000,
      
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 1000
    }
};