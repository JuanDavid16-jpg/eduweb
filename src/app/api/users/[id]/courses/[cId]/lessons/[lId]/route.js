import { NextResponse } from "next/server";

import { UserCourse, UserLesson } from "@/database/models";

export async function GET(req, { params }) {
    const transaction = await UserCourse.sequelize.transaction();
    try {
        const { id, cId, lId } = await params;

        const [userCourse] = await UserCourse.findOrCreate({
            where: { user_id: id, course_id: cId },
            defaults: {
                user_id: id,
                course_id: cId,
            },
            transaction,
        });

        const userLesson = await UserLesson.findOrCreate({
            where: {
                user_course_id: userCourse.user_course_id,
                lesson_id: lId,
            },
            defaults: {
                user_course_id: userCourse.user_course_id,
                lesson_id: lId,
            },
            transaction,
        });

        await transaction.commit();
        return NextResponse.json(
            {
                success: true,
                data: { userCourse, userLesson },
                message: "Usuarios obtenidos correctamente",
            },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        await transaction.rollback();
        return NextResponse.json(
            {
                success: false,
                data: error,
                message: "Error al obtener los usuarios: " + error.message,
            },
            { status: 500 }
        );
    }
}
