import { Category } from "@/database/models";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const categories = await Category.findAll();

        return NextResponse.json({
            sucess: true,
            data: categories,
            message: "Categorías obtenidas correctamente",
        });
    } catch (error) {
        return NextResponse.json(
            {
                sucess: false,
                message: "Error al obtener las categorías",
            },
            { status: 500 }
        );
    }
}
