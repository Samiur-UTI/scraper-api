"use strict";

const PropertyDetails = function (sequelize, DataTypes) {

    return sequelize.define('propertyDetails', {
        property_detail_id: {
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
        photo: {
            type: DataTypes.STRING
        },
        property_type: {
            type: DataTypes.STRING
        },
        property_address: {
            type: DataTypes.STRING
        },
        county:{
            type: DataTypes.STRING
        },
        zip: {
            type: DataTypes.INTEGER
        },
        capacity: {
            type: DataTypes.INTEGER
        },
        property_id:{
            type: DataTypes.INTEGER,
            references: {
                model: "property",
                key: "id"
            }
        }
    },
        {
            tableName: 'property_details',

            freezeTableName: true,

            timestamps: false,

            underscored: true
        });
};
PropertyDetails.associate = function (models) {
    PropertyDetails.belongsTo(models.property, { foreignKey: 'property_id' });
};
module.exports = PropertyDetails;