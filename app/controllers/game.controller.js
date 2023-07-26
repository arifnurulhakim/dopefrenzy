const { format } = require('date-fns');
const { sequelize } = require('../models');
const db = require("../models");
const Play = db.play;
const QueryTypes = db.Sequelize.QueryTypes;

// Play Session
exports.play = (req, res) => {
    // Create Item
    const play = {
        dopePlayerId: req.dopePlayerId,
        play_time: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    };
    // Save Play Session in the database
    Play.create(play)
    .then(result => {
        res.send({status: "SUCCESS", data: result})
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Play Session."
        });
    });
};

// Player List
exports.playerList = async(req, res) => {
    const draw = (req.query.draw) ? parseInt(req.query.draw):0;
    const start = (req.query.start) ? req.query.start:0;
    const length = (req.query.length && req.query.length > 0) ? req.query.length:10;
    const colIndex = (req.query.order && req.query.order[0]['column']) ? req.query.order[0]['column']:0;
    const colDir = (req.query.order && req.query.order[0]['dir']) ? req.query.order[0]['dir']:"";
    const colName = (req.query.columns && req.query.columns[colIndex]['data']) ? req.query.columns[colIndex]['data']:"";
    const orderBy = (colName) ? colName +" "+ colDir:`last_play DESC`;

    const foundPlayer = await sequelize.query(
        `SELECT COALESCE(play.total_play, 0) AS total_play, COALESCE(play.last_play, '2022-01-01 00:00:00.000 +0700') AS last_play, COALESCE(play.last_play_string, '-') AS last_play_string, player.id, player.username
        FROM (
            SELECT COUNT(id) AS total_play, MAX(play_time) AS last_play, TO_CHAR(MAX(play_time), 'DD Mon YYYY, HH24:MI:SS') AS last_play_string, "dopePlayerId" FROM dope_plays 
            GROUP BY "dopePlayerId"
        ) AS play
        RIGHT JOIN dope_players AS player ON player.id = play."dopePlayerId"
        ORDER BY `+ orderBy +`
		LIMIT `+ length +` OFFSET `+ start, 
        { type: QueryTypes.SELECT }
    );
    const allPlayer = await sequelize.query(
        //`SELECT COUNT(id) AS player_total, "dopePlayerId" FROM plays GROUP BY "dopePlayerId"`, 
        `SELECT COUNT(id) AS player_total FROM dope_players`, 
        { type: QueryTypes.SELECT }
    );
    if (foundPlayer) {
        res.send({status: "SUCCESS", draw: draw, iTotalDisplayRecords: allPlayer[0]['player_total'], iTotalRecords: foundPlayer.length, data: foundPlayer});

    } else {
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving Inventory."
        });
    }
};