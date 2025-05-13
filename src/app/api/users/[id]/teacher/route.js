import { NextResponse } from "next/server";
import { Block, Course, Lesson } from "@/database/models";

export async function GET(req, { params }) {
    try {
        const { id } = await params;

        const courses = await Course.findAll({
            where: {
                teacher_id: id,
            },
            include: [
                "category",
                "students",
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
                data: courses,
                message: "Cursos obtenidos exitosamente",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error al obtener los cursos del profesor:", error);
        return NextResponse.json(
            {
                success: false,
                data: null,
                message: "Error al obtener los cursos del profesor: " + error.message,
            },
            { status: 500 }
        );
    }
}
