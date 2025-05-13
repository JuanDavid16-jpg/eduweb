"use strict";
const {
    courses,
    categories,
    blocks,
    lessons,
    exams,
    questions,
    answers,
    usersExams,
    usersAnswers,
    usersCourses,
    usersLessons,
} = require("../data.json");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         */
        await queryInterface.bulkInsert("Courses", courses, {});
        await queryInterface.bulkInsert("Categories", categories, {});
        await queryInterface.bulkInsert("Blocks", blocks, {});
        await queryInterface.bulkInsert("Lessons", lessons, {});
        await queryInterface.bulkInsert("Exams", exams, {});
        await queryInterface.bulkInsert("Questions", questions, {});
        await queryInterface.bulkInsert("Answers", answers, {});
        await queryInterface.bulkInsert("UserCourses", usersCourses, {});
        await queryInterface.bulkInsert("UserLessons", usersLessons, {});
        await queryInterface.bulkInsert("UserExams", usersExams, {});
        await queryInterface.bulkInsert("UserAnswers", usersAnswers, {});
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         */
        await queryInterface.bulkDelete("Courses", null, {});
        await queryInterface.bulkDelete("Categories", null, {});
        await queryInterface.bulkDelete("Blocks", null, {});
        await queryInterface.bulkDelete("Lessons", null, {});
        await queryInterface.bulkDelete("Exams", null, {});
        await queryInterface.bulkDelete("Questions", null, {});
        await queryInterface.bulkDelete("Answers", null, {});
        await queryInterface.bulkDelete("UserCourses", null, {});
        await queryInterface.bulkDelete("UserLessons", null, {});
        await queryInterface.bulkDelete("UserExams", null, {});
        await queryInterface.bulkDelete("UserAnswers", null, {});
    },
};
