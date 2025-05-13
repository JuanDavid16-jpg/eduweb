"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class UserLesson extends Model {}
    UserLesson.init(
        {
            user_course_id: {
                type: DataTypes.UUID,
                allowNull: false,
                primaryKey: true,
            },
            lesson_id: {
                type: DataTypes.UUID,
                allowNull: false,
                primaryKey: true,
            },
        },
        {
            sequelize,
            modelName: "UserLesson",
            timestamps: true,
        }
    );

    return UserLesson;
};
