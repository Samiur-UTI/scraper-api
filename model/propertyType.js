"use strict";

module.exports = function (sequelize, DataTypes) {

    return sequelize.define('propertyType', {
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
            }
        },
        {
            tableName: 'property_type',

            freezeTableName: true,

            timestamps: false,

            underscored: true
        });
};