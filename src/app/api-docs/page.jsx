"use client";

import React, { useEffect } from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import swaggerDocument from "@/lib/swagger.json";

const ApiDocs = () => {
    useEffect(() => {
        document.title = "Documentación de la API | EduWeb";
    }, []);
    return (
        <div className="min-h-screen bg-white p-4">
            <SwaggerUI spec={swaggerDocument} />
        </div>
    );
};

export default ApiDocs;
