"use strict";

module.exports = function (sequelize, DataTypes) {

    return sequelize.define('county', {
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
            value: {
                type: DataTypes.STRING
            }
        },
        {
            tableName: 'county',

            freezeTableName: true,

            timestamps: false,

            underscored: true
        });
};