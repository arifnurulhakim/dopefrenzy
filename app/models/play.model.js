module.exports = (sequelize, Sequelize) => {
    const Play = sequelize.define("dope_play", {
        play_time: {
            type: Sequelize.DATE
        }
    });
    return Play;
};