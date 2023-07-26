module.exports = (sequelize, Sequelize) => {
    const Player = sequelize.define("dope_player", {
        wallet: {
            type: Sequelize.STRING,
            unique: true
        },
        username: {
            type: Sequelize.STRING
        }
    });
    return Player;
};