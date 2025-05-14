"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Courses", {
            course_id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            teacher_id: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            course_name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            course_description: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            course_image: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            course_difficulty: {
                type: Sequelize.ENUM("básico", "intermedio", "avanzado"),
                defaultValue: "básico",
                allowNull: false,
            },
            category_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
                onUpdate: Sequelize.NOW,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Courses");
    },
};
