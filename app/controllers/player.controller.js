const config = require("../config/auth.config");

const db = require("../models");
const Player = db.player;
const PlayerToken = db.playertoken;

var jwt = require("jsonwebtoken");
var randomstring = require("randomstring");

exports.playerLogin = (req, res) => {
    const wallet = req.body.wallet;
    const whereWallet = { where: { wallet: wallet } };

    // Find Player
    Player.findAll(whereWallet)
    .then(data => {
        if (data.length > 0) {
            const randToken	= randomstring.generate(32);	
            var token = jwt.sign({ id: data[0].id, randToken: randToken }, config.secret);	
            
            const playertoken = {
                dopePlayerId: data[0].id,
                token: randToken
            };
            PlayerToken.create(playertoken)
            .then(() => {
                res.send({status: "SUCCESS", data: {id: data[0].id, username: data[0].username, token: token}});
            })
            .catch(err => {
                res.status(500).send({ message: err.message });
            });             

        } else {
            const username = "player-" + randomstring.generate(6);
            const player = {
                wallet: wallet,
                username: username
            };
    
            Player.create(player)
            .then(result => {
                const randToken	= randomstring.generate(32);	
                var token = jwt.sign({ id: result.id, randToken: randToken }, config.secret);	
                
                const playertoken = {
                    dopePlayerId: result.id,
                    token: randToken
                };
                PlayerToken.create(playertoken)
                .then(() => {
                    res.send({status: "SUCCESS", data: {id: result.id, username: username, token: token}});
                })
                .catch(err => {
                    res.status(500).send({ message: err.message });
                }); 
            })
            .catch(err => {
                res.status(500).send({ message: err.message });
            });            
        }
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving Player."
        });
    }); 
};

exports.playerGet = (req, res) => {
    const wherePlayer = { where: { id: req.dopePlayerId } };
    
    // Find Player
    Player.findAll(wherePlayer)
    .then(data => {
        if (data.length > 0) {
            res.send({status: "SUCCESS", data: data});

        } else {
            res.status(404).send({
                message: `Cannot find Player.`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving Player."
        });
    }); 
};

exports.playerUpdate = async(req, res) => {
    //console.log(req);

    const username = req.body.username;
    const foundPlayer = await Player.findOne({ where: { id: req.dopePlayerId } });

    if (!foundPlayer) {
        return res.status(404).send({message: 'Cannot find Player.'});

    } else {
        const player = {
            username: username
        };
        await Player.update(
            player,
            { where: { id: req.dopePlayerId } }
        )
        .then(() => {
            res.send({status: "SUCCESS", data: {username: username}})
        }); 
    }
};

exports.playerLoginBak3 = (req, res) => {
    const username = req.body.username;
    const whereUsername = { where: { username: username } };

    // Find Player
    Player.findAll(whereUsername)
    .then(data => {
        if (data.length > 0) {
            const randToken	= randomstring.generate(32);	
            var token = jwt.sign({ id: data[0].id, randToken: randToken }, config.secret);	
            
            const playertoken = {
                dopePlayerId: data[0].id,
                token: randToken
            };
            PlayerToken.create(playertoken)
            .then(() => {
                res.send({status: "SUCCESS", data: {id: data[0].id, username: username, token: token}});
            })
            .catch(err => {
                res.status(500).send({ message: err.message });
            });             

        } else {
            const player = {
                username: username
            };
    
            Player.create(player)
            .then(result => {
                const randToken	= randomstring.generate(32);	
                var token = jwt.sign({ id: result.id, randToken: randToken }, config.secret);	
                
                const playertoken = {
                    dopePlayerId: result.id,
                    token: randToken
                };
                PlayerToken.create(playertoken)
                .then(() => {
                    res.send({status: "SUCCESS", data: {id: result.id, username: username, token: token}});
                })
                .catch(err => {
                    res.status(500).send({ message: err.message });
                }); 
            })
            .catch(err => {
                res.status(500).send({ message: err.message });
            });            
        }
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving Player."
        });
    }); 
};

exports.playerLoginBak2 = async(req, res) => {
    const foundPlayer = await Player.findOne({ where: { username: req.body.username } });
    if (!foundPlayer) {
        const player = {
            username: req.body.username
        };

        Player.create(player)
        .then(result => {
            const randToken	= randomstring.generate(32);	
            var token = jwt.sign({ id: result.id, randToken: randToken }, config.secret);	
            
            const playertoken = {
                dopePlayerId: result.id,
                token: randToken
            };
            PlayerToken.create(playertoken)
            .then(() => {
                res.send({status: "SUCCESS", data: {id: result.id, username: result.username, token: token}});
            })
            .catch(err => {
                res.status(500).send({ message: err.message });
            }); 
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
    
    } else {    
        const randToken	= randomstring.generate(32);	
        var token = jwt.sign({ id: foundPlayer.id, randToken: randToken }, config.secret);	
        
        const playertoken = {
            dopePlayerId: foundPlayer.id,
            token: randToken
        };
        PlayerToken.create(playertoken)
        .then(() => {
            res.send({status: "SUCCESS", data: {id: foundPlayer.id, username: foundPlayer.username, token: token}});
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        }); 
    }
};