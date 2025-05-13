import { NextResponse } from "next/server";

import { UserCourse, UserExam } from "@/database/models";

export async function GET(req, { params }) {
    try {
        const { id, cId } = await params;

        const userCourse = await UserCourse.findOne({
            where: {
                user_id: id,
                course_id: cId,
            },
        });

        if (!userCourse) {
            return NextResponse.json(
                {
                    success: false,
                    data: null,
                    message: "Curso no encontrado",
                },
                { status: 404 }
            );
        }

        const userExams = await UserExam.findAll({
            where: {
                user_course_id: userCourse.user_course_id,
            },
        });

        let recentExam = userExams.find((exam) => {
            const createdAt = new Date(exam.createdAt);
            const now = new Date();
            const diff = now.getTime() - createdAt.getTime();
            return diff <= 10 * 60 * 1000;
        });

        if (!recentExam || recentExam.exam_state === "completed") {
            recentExam = await UserExam.create({
                user_course_id: userCourse.user_course_id,
            });
        }

        return NextResponse.json(
            {
                success: true,
                data: recentExam,
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
