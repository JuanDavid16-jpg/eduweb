import { NextResponse } from "next/server";

import { Answer, Block, Course, Exam, Lesson, Question } from "@/database/models";
import { Op } from "sequelize";

export async function GET(request) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const category = searchParams.get("category");
        const order = searchParams.get("order")
            ? searchParams.get("order").split(":")
            : ["course_id", "ASC"];
        const search = searchParams.get("search") || "";

        const limit = searchParams.get("limit") || 10;
        const page = searchParams.get("page") || 1;
        const offset = (page - 1) * limit;

        const { rows, count } = await Course.findAndCountAll({
            where: {
                category_id: category ? category : { [Op.ne]: null },
                [Op.or]: [
                    { course_name: { [Op.like]: `%${search.toLowerCase()}%` } },
                    { course_description: { [Op.like]: `%${search.toLowerCase()}%` } },
                ],
            },
            limit,
            offset,
            order: [order],
            include: [
                "category",
                "teacher",
                { model: Block, as: "blocks", include: [{ model: Lesson, as: "lessons" }] },
            ],
        });

        return NextResponse.json(
            {
                success: true,
                data: rows,
                total: count,
                message: "Cursos obtenidos correctamente",
            },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {
                success: false,
                data: error,
                message: "Error al obtener los cursos",
            },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    const transaction = await Course.sequelize.transaction();
    try {
        const { course, blocks, lessons, exam, questions, answers } = await request.json();

        const newCourse = await Course.create(course, { transaction });
        const newBlocks = await Block.bulkCreate(blocks, { transaction });
        const newLessons = await Lesson.bulkCreate(lessons, { transaction });
        const newExam = await Exam.create(exam, { transaction });
        const newQuestions = await Question.bulkCreate(questions, { transaction });
        const newAnswers = await Answer.bulkCreate(answers, { transaction });

        await transaction.commit();

        return NextResponse.json({
            success: true,
            data: {
                course: newCourse,
                blocks: newBlocks,
                lessons: newLessons,
                exam: newExam,
                questions: newQuestions,
                answers: newAnswers,
            },
            message: "Curso creado correctamente",
        });
    } catch (error) {
        console.log(error);

        await transaction.rollback();
        return NextResponse.json({
            success: false,
            data: error,
            message: "Error al crear el curso" + error.message,
        });
    }
}
