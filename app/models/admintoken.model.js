module.exports = (sequelize, Sequelize) => {
    const AdminToken = sequelize.define("dope_admintoken", {
        token: {
            type: Sequelize.STRING
        }
    });
    return AdminToken;
};