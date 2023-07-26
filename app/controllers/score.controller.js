const { format } = require('date-fns');
const { sequelize } = require('../models');
const db = require("../models");
const Score = db.score;
const QueryTypes = db.Sequelize.QueryTypes;

// Add Score
exports.scoreAdd = (req, res) => {
    // Create Score
    const score = {
        dopePlayerId: req.dopePlayerId,
        label: req.body.label.toLowerCase(),
        amount: req.body.amount,
        play_time: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    };
    // Save Score to Database
    Score.create(score)
    .then(result => {
        res.send({status: "SUCCESS", data: result})
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Score."
        });
    });
};

// Score List per Player
exports.scorePlayer = (req, res) => {
    const wherePlayer = (req.params.id_player) ? req.params.id_player:req.dopePlayerId;
    
    // Find Score
    sequelize.query(
        `SELECT p.username, s.amount, s.label
        FROM (
            SELECT SUM(amount) AS amount, label, "dopePlayerId" 
            FROM dope_scores 
            WHERE "dopePlayerId" = '`+ wherePlayer +`' 
            GROUP BY label, "dopePlayerId"
        ) s
        LEFT JOIN dope_players p ON p.id = s."dopePlayerId"`, 
    { type: QueryTypes.SELECT })
    .then(data => {
        if (data.length > 0) {
            res.send({status: "SUCCESS", data: data});

        } else {
            res.status(404).send({
                message: `Cannot find Score.`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving Score."
        });
    }); 
};

exports.scorePlayerBak2 = async(req, res) => {
    const wherePlayer = (req.params.id_player) ? req.params.id_player:req.dopePlayerId;
    const scores = await sequelize.query(`SELECT SUM(amount) AS amount, label FROM dope_scores WHERE "dopePlayerId" = '`+ wherePlayer +`' GROUP BY "label"`, 
    { type: QueryTypes.SELECT });
    if (scores) {
        res.send({status: "SUCCESS", data: scores});

    } else {
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving Score."
        });
    }
};

// Leaderboard
exports.leaderboard = async(req, res) => {
    const whereScores = (req.params.label) ? req.params.label.toLowerCase():"xp";
    const whereDuration = (req.params.duration) ? "AND play_time > (now() - interval '"+req.params.duration.toLowerCase()+"')":"";

    const draw = (req.query.draw) ? parseInt(req.query.draw):0;
    const start = (req.query.start) ? req.query.start:0;
    const length = (req.query.length && req.query.length > 0) ? req.query.length:10;
    const colIndex = (req.query.order && req.query.order[0]['column']) ? req.query.order[0]['column']:0;
    const colDir = (req.query.order && req.query.order[0]['dir']) ? req.query.order[0]['dir']:"";
    const colName = (req.query.columns && req.query.columns[colIndex]['data']) ? req.query.columns[colIndex]['data']:"";
    const orderBy = (colName) ? colName +" "+ colDir:"score." + whereScores + " DESC";

    sequelize.query(
        `SELECT score.` + whereScores + `, score."dopePlayerId", player.username
        FROM (
            SELECT SUM(amount) AS `+ whereScores +`, "dopePlayerId" FROM dope_scores 
            WHERE label = '`+ whereScores +`' `+whereDuration+`
            GROUP BY "dopePlayerId" 
        ) AS score
        LEFT JOIN dope_players AS player ON player.id = score."dopePlayerId"
        ORDER BY `+ orderBy +`
		LIMIT `+ length +` OFFSET `+ start, 
        { type: QueryTypes.SELECT }
    )
    .then(data => {
        if (data.length > 0) {
            sequelize.query(
                `SELECT COUNT(id) AS player_total, "dopePlayerId" FROM dope_scores WHERE label = '`+ whereScores +`' `+whereDuration+` GROUP BY "dopePlayerId"`,  
                { type: QueryTypes.SELECT }
            )
            .then(dataAll => {
                if (dataAll.length > 0) {
                    res.send({status: "SUCCESS", draw: draw, iTotalDisplayRecords: dataAll.length, iTotalRecords: data.length, data: data});
        
                } else {
                    res.status(404).send({
                        message: `Cannot find Score.`
                    });
                }
            })
            .catch(err => {
                res.status(500).send({
                    message:
                    err.message || "Some error occurred while retrieving Score."
                });
            }); 

        } else {
            res.status(404).send({
                message: `Cannot find Score.`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving Score."
        });
    }); 
};

exports.leaderboard2 = async(req, res) => {
    const whereScores = (req.params.label) ? req.params.label.toLowerCase():"score";

    const draw = (req.query.draw) ? parseInt(req.query.draw):0;
    const start = (req.query.start) ? req.query.start:0;
    const length = (req.query.length && req.query.length > 0) ? req.query.length:10;
    const colIndex = (req.query.order && req.query.order[0]['column']) ? req.query.order[0]['column']:0;
    const colDir = (req.query.order && req.query.order[0]['dir']) ? req.query.order[0]['dir']:"";
    const colName = (req.query.columns && req.query.columns[colIndex]['data']) ? req.query.columns[colIndex]['data']:"";
    const orderBy = (colName) ? colName +" "+ colDir:"score." + whereScores + " DESC";
    
    const foundScores = await sequelize.query(
        `SELECT score.` + whereScores + `, score."dopePlayerId", player.username
        FROM (
            SELECT SUM(amount) AS `+ whereScores +`, "dopePlayerId" FROM dope_scores 
            WHERE label = '`+ whereScores +`' 
            GROUP BY "dopePlayerId" 
        ) AS score
        LEFT JOIN dope_players AS player ON player.id = score."dopePlayerId"
        ORDER BY `+ orderBy +`
		LIMIT `+ length +` OFFSET `+ start, 
        { type: QueryTypes.SELECT }
    );
    const allScores = await sequelize.query(
        `SELECT COUNT(id) AS player_total, "dopePlayerId" FROM dope_scores GROUP BY "dopePlayerId"`, 
        { type: QueryTypes.SELECT }
    );

    if (foundScores) {
        res.send({status: "SUCCESS", draw: draw, iTotalDisplayRecords: allScores.length, iTotalRecords: foundScores.length, data: foundScores});

    } else {
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving Score."
        });
    }
};