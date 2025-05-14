"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class UserAnswer extends Model {}
    UserAnswer.init(
        {
            user_exam_id: {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
            },
            answer_id: {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "UserAnswer",
            timestamps: false,
        }
    );
    return UserAnswer;
};
