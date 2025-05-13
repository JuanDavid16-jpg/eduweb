import { NextResponse } from "next/server";

import { Exam, Question, Answer } from "@/database/models";

export async function GET(req, { params }) {
    try {
        const { id } = await params;

        const exam = await Exam.findOne({
            where: {
                course_id: id,
            },
            include: [
                {
                    model: Question,
                    as: "questions",
                    include: ["answers"],
                },
            ],
        });

        return NextResponse.json(
            {
                success: true,
                data: exam,
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
