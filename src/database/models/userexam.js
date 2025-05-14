"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class UserExam extends Model {}
    UserExam.init(
        {
            user_exam_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            user_course_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            exam_state: {
                type: DataTypes.ENUM("progress", "completed"),
                defaultValue: "progress",
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "UserExam",
            timestamps: true,
        }
    );
    return UserExam;
};
