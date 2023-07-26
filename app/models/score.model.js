module.exports = (sequelize, Sequelize) => {
    const Score = sequelize.define("dope_score", {
        label: {
            type: Sequelize.STRING
        },
        amount: {
            type: Sequelize.INTEGER
        },
        play_time: {
            type: Sequelize.DATE
        }
    });
    return Score;
};