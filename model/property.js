"use strict";

const Property = function (sequelize, DataTypes) {

    return sequelize.define('property', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            validate: {
                notEmpty: true
            }
        },
        property_name: {
            type: DataTypes.STRING
        },
        property_address: {
            type: DataTypes.STRING
        },
        city: {
            type: DataTypes.STRING
        },
        state: {
            type: DataTypes.STRING
        },
        phone: {
            type: DataTypes.INTEGER
        },
        property_type: {
            type: DataTypes.STRING
        },
        zip: {
            type: DataTypes.INTEGER
        },
        capacity: {
            type: DataTypes.INTEGER
        },
        photo: {
            type: DataTypes.STRING
        },
        property_type_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "propertyType",
                key: "id"
            }
        }
    },
        {
            tableName: 'property_search',

            freezeTableName: true,

            timestamps: false,

            underscored: true
        });
};
Property.associate = function (models) {
    Property.belongsTo(models.propertyType, { foreignKey: 'property_type_id' });
};
module.exports = Property;