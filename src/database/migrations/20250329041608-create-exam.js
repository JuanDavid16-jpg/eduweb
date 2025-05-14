"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Exams", {
            exam_id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            course_id: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            exam_title: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            exam_description: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Exams");
    },
};
