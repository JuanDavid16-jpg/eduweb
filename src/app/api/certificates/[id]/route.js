import { User, UserCourse } from "@/database/models";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    const { id } = await params;

    try {
        const data = await UserCourse.findOne({
            where: { user_course_id: id },
            include: ["course", "user"],
        });

        if (!data) throw new Error("No se encontraron datos");

        const { course, user, ...userCourse } = data.toJSON();

        if (userCourse.course_state !== "completed") throw new Error("El curso no ha sido completado");

        return NextResponse.json(
            {
                success: true,
                data: { userCourse, course, user },
                message: "Información obtenida correctamente",
            },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {
                success: false,
                data: null,
                message: "Error al obtener la información: " + error.message,
            },
            { status: 500 }
        );
    }
}
