module.exports = (sequelize, Sequelize) => {
    const PlayerToken = sequelize.define("dope_playertoken", {
        token: {
            type: Sequelize.STRING
        }
    });
    return PlayerToken;
};