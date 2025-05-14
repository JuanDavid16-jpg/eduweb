"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Users", {
            user_id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            user_name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            user_lastname: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            user_profession: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            user_website: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            user_email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            user_phone: {
                type: Sequelize.DECIMAL,
                allowNull: true,
            },
            user_password: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            user_image: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            role_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
                onUpdate: Sequelize.NOW,
                allowNull: false,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Users");
    },
};
