import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Course, User, UserCourse } from "@/database/models";

export async function GET(req, { params }) {
    try {
        const { id, cId } = await params;

        // 1. Obtener los datos de la base de datos
        const user = await User.findByPk(id);
        const course = await Course.findByPk(cId);
        const ucourse = await UserCourse.findOne({ where: { user_id: id, course_id: cId } });

        if (!ucourse || ucourse.course_state !== "completed")
            throw new Error("El usuario no ha completado el curso");

        const pdfFileName = `certificate-${ucourse.user_course_id}.pdf`;
        const filePath = path.join(process.cwd(), "public", "certificates", pdfFileName);

        if (fs.existsSync(filePath)) {
            const fileBuffer = fs.readFileSync(filePath);
            return new NextResponse(fileBuffer, {
                status: 200,
                headers: {
                    "Content-Type": "application/pdf",
                    "Content-Disposition": `inline; filename=${pdfFileName}`,
                },
            });
        }

        const craftResponse = await fetch("https://api.craftmypdf.com/v1/create", {
            method: "POST",
            headers: {
                "X-API-KEY": process.env.CRAFTMYPDF_API_KEY,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                template_id: process.env.CRAFTMYPDF_TEMPLATE_ID,
                data: {
                    course_name: course.course_name,
                    user_name: user.user_name + " " + user.user_lastname,
                    certificate_date: new Date(ucourse.course_completion).toLocaleDateString(),
                    certificate_serial: ucourse.user_course_id,
                },
                output_file: pdfFileName,
                export_type: "json",
                expiration: 1440,
            }),
        });
        const craftData = await craftResponse.json();
        const pdfUrl = craftData?.file;

        if (!craftResponse.ok || !pdfUrl) {
            throw new Error("Error generando el PDF con CraftMyPDF");
        }

        const pdfFetch = await fetch(pdfUrl);
        const pdfBuffer = await pdfFetch.arrayBuffer();

        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(filePath, Buffer.from(pdfBuffer));

        return new NextResponse(Buffer.from(pdfBuffer), {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `inline; filename=${pdfFileName}`,
            },
        });
    } catch (error) {
        console.error("Error generando el PDF:", error);
        return NextResponse.json(
            {
                success: false,
                data: null,
                message: error.message,
            },
            { status: 500 }
        );
    }
}
