import { NextResponse } from "next/server";

import { Exam, Question, UserAnswer, UserExam } from "@/database/models";

export async function GET(req, { params }) {
    try {
        const { id, cId, eId } = await params;

        const userExam = await UserExam.findOne({
            where: { user_exam_id: eId },
            include: [{ model: UserAnswer, as: "userAnswers", include: ["answer"] }],
        });

        return NextResponse.json(
            {
                success: true,
                data: userExam,
                message: "Examen obtenido correctamente",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                data: error,
                message: "Error al obtener el examen",
            },
            { status: 500 }
        );
    }
}

export async function POST(req, { params }) {
    try {
        const { id, cId, eId } = await params;
        const { answers } = await req.json();

        const responses = await UserAnswer.bulkCreate(
            answers.map((a) => ({ answer_id: a, user_exam_id: eId }))
        );

        const exam = await Exam.findOne({
            where: { course_id: cId },
            include: [{ model: Question, as: "questions", include: ["answers"] }],
        });
        const userExam = await UserExam.findOne({
            where: { user_exam_id: eId },
            include: ["userCourse", { model: UserAnswer, as: "userAnswers", include: ["answer"] }],
        });

        await userExam.update({ exam_state: "completed" });

        const userAnswers = userExam.userAnswers.map((ua) => ua.answer);
        const correctAnswers = userAnswers.filter((ua) => ua.is_correct === true).length;
        const totalQuestions = exam.questions.length;
        const score = (correctAnswers / totalQuestions) * 100;

        if (score >= 80) {
            await userExam.userCourse.update({
                course_state: "completed",
                course_completion: new Date(),
            });
        }

        return NextResponse.json(
            {
                success: true,
                data: responses,
                message: "Examen obtenido correctamente",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                data: error,
                message: "Error al obtener el examen",
            },
            { status: 500 }
        );
    }
}
