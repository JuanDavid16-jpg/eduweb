import { NextResponse } from "next/server";

import { Answer, Block, Course, Exam, Lesson, Question } from "@/database/models";
import { Op } from "sequelize";

export async function GET(req, { params }) {
    try {
        const { id } = await params;

        const course = await Course.findByPk(id, {
            include: [
                "category",
                "teacher",
                {
                    model: Block,
                    as: "blocks",
                    include: ["lessons"],
                },
            ],
        });

        return NextResponse.json(
            {
                success: true,
                data: course,
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

export async function PUT(req, { params }) {
    const transaction = await Block.sequelize.transaction();
    try {
        const { id } = await params;
        const { course, blocks, lessons, exam, questions, answers } = await req.json();

        const updatedCourse = await Course.update(course, {
            where: { course_id: id },
            transaction,
        });
        const updatedExam = await Exam.update(exam, {
            where: { course_id: id },
            transaction,
        });

        const deletedBlocks = await Block.destroy({
            where: {
                course_id: id,
                block_id: { [Op.notIn]: blocks.map((block) => block.block_id) },
            },
            transaction,
        });
        const updatedBlocks = await Block.bulkCreate(blocks, {
            updateOnDuplicate: ["block_title", "block_description", "block_order"],
            transaction,
        });
        const deletedQuestions = await Question.destroy({
            where: {
                question_id: { [Op.notIn]: questions.map((question) => question.question_id) },
            },
            transaction,
        });
        const updatedQuestions = await Question.bulkCreate(questions, {
            updateOnDuplicate: ["question_text"],
            transaction,
        });
        const deletedAnswers = await Answer.destroy({
            where: {
                answer_id: { [Op.notIn]: answers.map((answer) => answer.answer_id) },
            },
            transaction,
        });
        const updatedAnswers = await Answer.bulkCreate(answers, {
            updateOnDuplicate: ["answer_text", "is_correct"],
            transaction,
        });

        const updatedLessons = await Lesson.bulkCreate(lessons, {
            updateOnDuplicate: [
                "lesson_title",
                "lesson_description",
                "lesson_order",
                "lesson_video",
                "lesson_image",
                "lesson_duration",
            ],
            transaction,
        });

        await transaction.commit();
        return NextResponse.json(
            {
                success: true,
                data: {
                    updatedCourse,
                    updatedBlocks,
                    updatedExam,
                    updatedLessons,
                    updatedQuestions,
                    updatedAnswers,
                },
                message: "Curso actualizado correctamente",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        await transaction.rollback();
        return NextResponse.json(
            {
                success: false,
                data: error,
                message: "Error al actualizar el curso" + error.message,
            },
            { status: 500 }
        );
    }
}
