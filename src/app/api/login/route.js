import { User } from "@/database/models";
import { NextResponse } from "next/server";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(request) {
    try {
        const { user_email, user_password } = await request.json();
        console.log(user_email, user_password);

        const user = await User.findOne({ where: { user_email } });
        if (!user) {
            return NextResponse.json(
                { success: false, message: "El usuario no existe" },
                { status: 200 } // Se usa 200 para no lanzar error en RN
            );
        }

        const isPasswordValid = await bcrypt.compare(user_password, user.user_password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, message: "La contraseña es incorrecta" },
                { status: 200 } // Se usa 200 para no lanzar error en RN
            );
        };

        const token = jwt.sign({ user_id: user.user_id }, process.env.NEXTAUTH_SECRET, {
            expiresIn: "1d",
        });

        return NextResponse.json(
            {
                success: true,
                data: { token },
                message: "Sesión iniciada correctamente",
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                data: error,
                message: "Error: " + error.message,
            },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        const token = await request.headers.get("authorization").split(" ")[1];
        if (!token) {
            return NextResponse.json(
                { success: false, message: "No se ha proporcionado un token" },
                { status: 200 } // Se usa 200 para no lanzar error en RN
            );
        }

        const decodedToken = jwt.verify(token, process.env.NEXTAUTH_SECRET);
        const user = await User.findByPk(decodedToken.user_id, {
            attributes: { exclude: ["user_password"] },
            include: ["role"],
        });

        return NextResponse.json(
            {
                success: true,
                data: user,
                message: "Sesión obtenida correctamente",
            },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {
                success: false,
                data: error,
                message: "Error al obtener la sesión: " + error.message,
            },
            { status: 500 }
        );
    }
}

