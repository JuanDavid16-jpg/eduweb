"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Lessons", {
            lesson_id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            block_id: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            lesson_title: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            lesson_video: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            lesson_description: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            lesson_duration: {
                type: Sequelize.TIME,
                defaultValue: "00:00:00",
                allowNull: false,
            },
            lesson_image: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            lesson_order: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Lessons");
    },
};
