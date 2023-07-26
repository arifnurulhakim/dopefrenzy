module.exports = app => {
    const { authPlayer } = require("../middleware");
    const games = require("../controllers/game.controller.js");
    var router = require("express").Router();

    // Add headers before the routes are defined
    app.use(function (req, res, next) {

        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept, X-Requested-With, content-type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);

        // Pass to next layer of middleware
        next();
    });

    // Record Play Session
    router.post("/play", authPlayer.verifyToken, games.play);

    // Player List
    router.get("/player", games.playerList);
    
    app.use('/api/game', router);
};