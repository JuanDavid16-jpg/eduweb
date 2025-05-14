const { Sequelize, DataTypes } = require("sequelize");

const AnswerModel = require("./answer");
const BlockModel = require("./block");
const CategoryModel = require("./category");
const CourseModel = require("./course");
const ExamModel = require("./exam");
const LessonModel = require("./lesson");
const QuestionModel = require("./question");
const RoleModel = require("./role");
const UserModel = require("./user");
const UserCourseModel = require("./usercourse");
const UserExamModel = require("./userexam");
const UserLessonModel = require("./userlesson");
const UserAnswerModel = require("./useranswer");

const { [process.env.NODE_ENV]: config } = require("../config.json");

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    dialectModule: require("mysql2"),
    port: config.port,
    logging: false,
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
})();

const Answer = AnswerModel(sequelize, DataTypes);
const Block = BlockModel(sequelize, DataTypes);
const Category = CategoryModel(sequelize, DataTypes);
const Course = CourseModel(sequelize, DataTypes);
const Exam = ExamModel(sequelize, DataTypes);
const Lesson = LessonModel(sequelize, DataTypes);
const Question = QuestionModel(sequelize, DataTypes);
const Role = RoleModel(sequelize, DataTypes);
const User = UserModel(sequelize, DataTypes);
const UserCourse = UserCourseModel(sequelize, DataTypes);
const UserExam = UserExamModel(sequelize, DataTypes);
const UserLesson = UserLessonModel(sequelize, DataTypes);
const UserAnswer = UserAnswerModel(sequelize, DataTypes);

Role.hasMany(User, { as: "users", foreignKey: "role_id" });
User.belongsTo(Role, { as: "role", foreignKey: "role_id" });

User.hasMany(Course, { as: "teachercourses", foreignKey: "teacher_id" });
Course.belongsTo(User, { as: "teacher", foreignKey: "teacher_id" });

Category.hasMany(Course, { as: "courses", foreignKey: "category_id" });
Course.belongsTo(Category, { as: "category", foreignKey: "category_id" });

Course.hasMany(Block, { as: "blocks", foreignKey: "course_id" });
Block.belongsTo(Course, { as: "course", foreignKey: "course_id" });

Block.hasMany(Lesson, { as: "lessons", foreignKey: "block_id" });
Lesson.belongsTo(Block, { as: "block", foreignKey: "block_id" });

Course.hasOne(Exam, { as: "exam", foreignKey: "course_id" });
Exam.belongsTo(Course, { as: "course", foreignKey: "course_id" });

Exam.hasMany(Question, { as: "questions", foreignKey: "exam_id" });
Question.belongsTo(Exam, { as: "exam", foreignKey: "exam_id" });

Question.hasMany(Answer, { as: "answers", foreignKey: "question_id" });
Answer.belongsTo(Question, { as: "question", foreignKey: "question_id" });

User.hasMany(UserCourse, { as: "userCourses", foreignKey: "user_id" });
UserCourse.belongsTo(User, { as: "user", foreignKey: "user_id" });

Course.hasMany(UserCourse, { as: "students", foreignKey: "course_id" });
UserCourse.belongsTo(Course, { as: "course", foreignKey: "course_id" });

UserCourse.hasMany(UserLesson, { as: "lessonsTaken", foreignKey: "user_course_id" });
UserLesson.belongsTo(UserCourse, { as: "userCourse", foreignKey: "user_course_id" });

UserCourse.hasMany(UserExam, { as: "examsTaken", foreignKey: "user_course_id" });
UserExam.belongsTo(UserCourse, { as: "userCourse", foreignKey: "user_course_id" });

UserExam.hasMany(UserAnswer, { as: "userAnswers", foreignKey: "user_exam_id" });
UserAnswer.belongsTo(UserExam, { as: "userExam", foreignKey: "user_exam_id" });

Answer.hasMany(UserAnswer, { as: "userAnswers", foreignKey: "answer_id" });
UserAnswer.belongsTo(Answer, { as: "answer", foreignKey: "answer_id" });

module.exports = {
    Answer,
    Block,
    Course,
    Category,
    Exam,
    Lesson,
    Question,
    Role,
    User,
    UserCourse,
    UserExam,
    UserLesson,
    UserAnswer,
    connection: sequelize,
};
