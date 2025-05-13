import { NextResponse } from "next/server";

import { User, UserCourse } from "@/database/models";

export async function GET(request, { params }) {
    try {
        const { id } = await params;

        const user = await User.findByPk(id, {
            include: ["role"],
        });

        return NextResponse.json(
            {
                success: true,
                data: user,
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

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const { user: userJSON } = await request.json();

        const user = await User.findByPk(id, {
            include: ["role"],
        });

        const updatedUser = await user.update(userJSON);

        return NextResponse.json(
            {
                success: true,
                data: updatedUser,
                message: "Usuarios actualizados correctamente",
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

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;

        const user = await User.findByPk(id);
        await user.destroy();

        return NextResponse.json(
            {
                success: true,
                message: "Usuario eliminado correctamente",
            },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {
                success: false,
                message: "Error al eliminar el usuario: " + error.message,
            },
            { status: 500 }
        );
    }
}
