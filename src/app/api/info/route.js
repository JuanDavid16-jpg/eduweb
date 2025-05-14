import { NextResponse } from "next/server";

import {
    User,
    Role,
    Course,
    Category,
    Block,
    Lesson,
    Exam,
    Question,
    Answer,
    UserCourse,
    UserExam,
    UserAnswer,
    UserLesson,
} from "@/database/models";

export async function GET(req) {
    const users = await User.findAll();
    const roles = await Role.findAll();
    const courses = await Course.findAll();
    const categories = await Category.findAll();
    const blocks = await Block.findAll();
    const lessons = await Lesson.findAll();
    const exams = await Exam.findAll();
    const questions = await Question.findAll();
    const answers = await Answer.findAll();
    const userCourses = await UserCourse.findAll();
    const userExams = await UserExam.findAll();
    const userAnswers = await UserAnswer.findAll();
    const userLessons = await UserLesson.findAll();

    return NextResponse.json({
        users,
        roles,
        courses,
        categories,
        blocks,
        lessons,
        exams,
        questions,
        answers,
        userCourses,
        userExams,
        userAnswers,
        userLessons,
    });
}
