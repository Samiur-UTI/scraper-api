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
        county: {
            type: DataTypes.STRING
        },
        phone: {
            type: DataTypes.INTEGER
        },
        property_type: {
            type: DataTypes.STRING
        },
        zipcode: {
            type: DataTypes.INTEGER
        },
        capacity: {
            type: DataTypes.INTEGER
        },
        photo: {
            type: DataTypes.STRING
        },
        property_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "propertyType",
                key: "id"
            }
        },
        county_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "county",
                key: "id"
            }
        }
    },
        {
            tableName: 'property',

            freezeTableName: true,

            timestamps: false,

            underscored: true
        });
};
Property.associate = function (models) {
    Property.belongsTo(models.propertyType, { foreignKey: 'property_id' });
    Property.belongsTo(models.county, { foreignKey: 'county_id' });
};
module.exports = Property;