import { NextResponse } from "next/server";

import { UserCourse, Course, Block } from "@/database/models";

export async function GET(request, { params }) {
    try {
        const { id } = await params;

        const userCourses = await UserCourse.findAll({
            where: { user_id: id },
            include: [
                "lessonsTaken",
                "examsTaken",
                {
                    model: Course,
                    as: "course",
                    include: [
                        "teacher",
                        "category",
                        {
                            model: Block,
                            as: "blocks",
                            include: ["lessons"],
                        },
                    ],
                },
            ],
        });

        return NextResponse.json(
            {
                success: true,
                data: userCourses,
                message: "Usuarios obtenidos correctamente",
            },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
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
