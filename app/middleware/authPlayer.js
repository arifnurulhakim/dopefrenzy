const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

const db = require("../models");
const playerToken = db.playertoken;
const Player = db.player;

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    jwt.verify(token, config.secret, async(err, decoded) => {        
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }

        const foundPlayer = await playerToken.findOne({ include: Player, where: { token: decoded.randToken } });
        if (!foundPlayer) {
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }

        //console.log(foundPlayer);
        req.dopePlayerId = decoded.id;
        req.playerUser = foundPlayer.dope_player.username;
        next();
    });
};

const authPlayer = {
    verifyToken: verifyToken
};
module.exports = authPlayer;