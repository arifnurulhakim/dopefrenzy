const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const app = express();
var corsOptions = {
    //origin: "http://localhost:8081"
};
//app.use(cors(corsOptions));
app.use(cors());
// parse requests of content-type - application/json
//app.use(express.json());
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
//app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
const Admin = db.admin;
//db.sequelize.sync({ force: true }).then(() => {
//    console.log("Drop and re-sync db.");
//  });
db.sequelize.sync()
.then(() => {
    console.log("Synced db.");
    initial();
})
.catch((err) => {
    console.log("Failed to sync db: " + err.message);
});

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Dope Frenzy Backend." });
});

require('./app/routes/admin.routes')(app);
require('./app/routes/player.routes')(app);
require('./app/routes/game.routes')(app);
require('./app/routes/score.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

function initial() {
    Admin.findOrCreate({ 
        where: { 
            username: 'admin' 
        }, 
        defaults: {
            password: bcrypt.hashSync('Plexu54dm1n!', 8),
            email: 'doddi@plexus.id'
        } 
    });  
}