
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
     pool: {
         max: 50,
         min: 0,
         idle: 200000,
         acquire: 1000000
     },
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
         let model = sequelize.import(path.join(__dirname, file));
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
 