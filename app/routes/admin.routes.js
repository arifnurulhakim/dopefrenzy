module.exports = app => {
    const { authAdmin } = require("../middleware");
    const admin = require("../controllers/admin.controller.js");
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

    // Create New Admin
    router.post("/create", authAdmin.verifyToken, admin.adminCreate);

    // Login
    router.post("/login", admin.adminLogin);

    // Change Password
    router.put("/password/:username?", authAdmin.verifyToken, admin.adminPassword);

    // Delete Admin
    router.delete("/:username", authAdmin.verifyToken, admin.adminDelete);

    // Admin List
    router.get("/", authAdmin.verifyToken, admin.adminList);

    app.use('/api/admin', router);
};