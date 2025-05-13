import { NextResponse } from "next/server";

import { User } from "@/database/models";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 5;
        const offset = (page - 1) * limit;

        const { rows, count } = await User.findAndCountAll({
            limit,
            offset,
            order: [["user_id", "ASC"]],
            include: ["role"],
        });

        return NextResponse.json({
            success: true,
            data: rows,
            total: count,
            message: "Usuarios obtenidos correctamente",
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            data: error,
            message: "Error al obtener los usuarios",
        });
    }
}

export async function POST(request) {
    try {
        const { user } = await request.json();

        const newUser = await User.create(user);

        return NextResponse.json(
            {
                success: true,
                data: newUser,
                message: "Usuario creado correctamente",
            },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        if (error.name === "SequelizeUniqueConstraintError") {
            const duplicateFields = error.errors.map((err) => err.path);
            let field;
            switch (duplicateFields[0]) {
                case "user_email":
                    field = "correo electrónico";
                    break;
                case "user_phone":
                    field = "número de teléfono";
                    break;
            }

            return NextResponse.json(
                {
                    success: false,
                    message: `El ${field} ya está registrado`,
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                data: error,
                message: "Error al crear el usuario: " + error.message,
            },
            { status: 500 }
        );
    }
}
