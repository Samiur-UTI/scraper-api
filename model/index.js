
"use strict";

let fs = require("fs");
let path = require("path");
let Sequelize = require("sequelize");
let Op = Sequelize.Op;
let sequelize = null;
let db = {};

require('dotenv').config();

sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USERNAME, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    logging: console.log,
    dialect: 'mysql',
    define: {
        timestamps: false
    },
    dialectOptions: {
        connectTimeout: 60000
    },
    charset: 'MYSQL_CHARSET',
    collate: 'utf8_general_ci',
    logging: false
});

fs.readdirSync(__dirname)
    .filter(function (file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function (file) {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
        db[model.name] = model;
    });

Object.keys(db).forEach(function (modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;
