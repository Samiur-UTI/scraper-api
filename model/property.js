 "use strict";

 module.exports = function (sequelize, DataTypes) {
 
     return sequelize.define('property', {
             id: {
                 type: DataTypes.INTEGER,
                 primaryKey: true,
                 autoIncrement: true,
                 validate: {
                     notEmpty: true
                 }
             },
             name: {
                 type: DataTypes.STRING
             },
             address: {
                 type: DataTypes.STRING
             },
             city: {
                 type: DataTypes.STRING
             },
             state: {
                 type: DataTypes.STRING
             },
             county: {
                    type: DataTypes.STRING
             },
             phone:{
                    type: DataTypes.INTEGER
             },
             type:{
                    type: DataTypes.STRING
             },
             zipcode:{
                 type: DataTypes.INTEGER
             },
             image:{
                 type: DataTypes.STRING
             }
         },
         {
             tableName: 'property',
 
             freezeTableName: true,
 
             timestamps: false,
 
             underscored: true
         });
 };