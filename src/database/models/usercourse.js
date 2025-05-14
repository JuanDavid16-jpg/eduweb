"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class UserCourse extends Model {}
    UserCourse.init(
        {
            user_course_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            user_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            course_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            course_state: {
                type: DataTypes.ENUM("progress", "completed"),
                defaultValue: "progress",
                allowNull: false,
            },
            course_completion: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "UserCourse",
            timestamps: true,
        }
    );
    return UserCourse;
};
