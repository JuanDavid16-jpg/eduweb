"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Blocks", {
            block_id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            block_title: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            block_description: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            block_order: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            course_id: {
                type: Sequelize.UUID,
                allowNull: false,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Blocks");
    },
};
