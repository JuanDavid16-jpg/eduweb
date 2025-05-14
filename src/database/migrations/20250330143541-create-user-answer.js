"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("UserAnswers", {
            user_exam_id: {
                type: Sequelize.UUID,
                primaryKey: true,
                allowNull: false,
            },
            answer_id: {
                type: Sequelize.UUID,
                primaryKey: true,
                allowNull: false,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("UserAnswers");
    },
};
