const config = require("../config/auth.config");

const db = require("../models");
const Admin = db.admin;
const AdminToken = db.admintoken;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var randomstring = require("randomstring");

exports.adminCreate = (req, res) => {
    // Create Item
    const admin = {
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    };
    // Save User to Database
    Admin.create(admin)
    .then(result => {
        res.send({status: "SUCCESS", data: {id: result.id, username: result.username}})
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
};

exports.adminLogin = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const whereUsername = { where: { username: username } };

    // Find Admin
    Admin.findAll(whereUsername)
    .then(data => {
        if (data.length > 0) {
            const isMatch = bcrypt.compareSync(password, data[0].password);
            if (isMatch) {
                const randToken	= randomstring.generate(32);	
                var token = jwt.sign({ id: data[0].id, randToken: randToken }, config.secret);	
                
                const admin = {
                    dopeAdminId: data[0].id,
                    token: randToken
                };
                AdminToken.create(admin)
                .then(() => {
                    res.send({status: "SUCCESS", data: {token: token}});
                })
                .catch(err => {
                    res.status(500).send({ message: err.message });
                });  
    
            } else {
                return res.status(401).send({message: 'Password is not correct'});
            }
            //res.send({status: "SUCCESS", data: data});

        } else {
            res.status(404).send({
                message: `Cannot find Admin.`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving Admin."
        });
    }); 
};

exports.adminPassword = async(req, res) => {
    //console.log(req);
    //console.log(req.adminUser);

    const whereUser = (req.params.username && req.adminUser == 'admin') ? req.params.username:req.adminUser;
    const foundAdmin = await Admin.findOne({ where: { username: whereUser } });
    if (!foundAdmin) {
        return res.status(401).send({message: 'Admin not found'});

    }

    const isMatch = bcrypt.compareSync(req.body.passwordCurrent, foundAdmin.password);
    if (!isMatch) {
        return res.status(401).send({message: 'Current Password is not correct'});
    
    } else {
        const admin = {
            password: bcrypt.hashSync(req.body.password, 8)
        };
        await Admin.update(
            admin,
            { where: { username: whereUser } }
        )
        .then(() => {
            res.send({status: "SUCCESS", data: {username: whereUser}})
        }); 
    }
};

exports.adminDelete = async(req, res) => {
    const whereUser = (req.params.username && req.params.username != 'admin' && req.adminUser == 'admin') ? req.params.username:"";
    const foundAdmin = await Admin.findOne({ where: { username: whereUser } });
    if (!foundAdmin) {
        return res.status(401).send({message: 'Admin not found'});

    } else {
        await Admin.destroy(
            { where: { username: whereUser } }
        )
        .then(() => {
            res.send({status: "SUCCESS", data: {username: whereUser}})
        });    
    }
};

exports.adminList = async(req, res) => {
    const foundAdmin = await Admin.findAll();
    if (foundAdmin) {
        res.send({status: "SUCCESS", data: foundAdmin});

    } else {
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving Inventory."
        });
    }
};