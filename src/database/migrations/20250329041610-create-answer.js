"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Answers", {
            answer_id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            question_id: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            answer_text: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            is_correct: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Answers");
    },
};
