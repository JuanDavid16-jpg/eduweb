"use client";
import { CheckIcon, CircleCheckIcon, DownloadIcon } from "@/components/icons";
import { getData } from "@/hooks/useFetch";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page() {
    const searchParams = useSearchParams();
    const [id, setId] = useState(searchParams.get("id") || "");
    const [data, setData] = useState(null);

    const validateCertificate = async () => {
        const { data } = await getData(`/certificates/${id}`);
        setData(data);
    };

    useEffect(() => {
        document.title = "Validación de certificados | EduWeb";
    }, []);
    return (
        <>
            {data ? (
                <section className="w-full px-3">
                    <div className="w-full max-w-[1200px] mx-auto py-10 space-y-8">
                        <div className="alert bg-gradient-to-r from-primary/80 via-sky-700/40 to-primary/80 from-0% via-50% to-100% text-white shadow-lg">
                            <CircleCheckIcon size={50} />
                            <div>
                                <h3 className="text-2xl font-bold">El código ha sido verificado</h3>
                                <div className="text-xs sm:text-sm">
                                    El certificado digital fue emitido y verificado a través de
                                    EduWeb y toda su información es válida.
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-center gap-5 pb-4 mb-4">
                            <div className="flex items-center gap-5">
                                <div className="avatar hidden md:block">
                                    <div className="w-12 rounded-full">
                                        <img src={data.course.course_image} alt="Avatar" />
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold">
                                        {data.course.course_name}
                                    </h2>
                                    <p className="text-sm text-gray-300">
                                        Curso completado el{" "}
                                        {new Date(
                                            data.userCourse.course_completion
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <Link
                                href={`/api/users/${data.user.user_id}/courses/${data.course.course_id}/certificate`}
                                target="_blank"
                            >
                                <button className="btn btn-outline btn-primary">
                                    <DownloadIcon size={16} />
                                    Descargar Certificado
                                </button>
                            </Link>
                        </div>

                        <hr className="border-base-300" />

                        <div className="flex items-center gap-6">
                            <div className="avatar">
                                <div className="w-20 rounded-full">
                                    <img src={data.user.user_image} alt="Avatar" />
                                </div>
                            </div>
                            <div>

                            <h3 className="text-xl font-bold leading-[1.005]">
                                {data.user.user_name} {data.user.user_lastname}
                            </h3>
                            <p className="text-lg italic font-medium text-base-content/80">{data.user.user_profession}</p>
                            <Link href={`mailto:${data.user.user_email}`} target="_blank" className="hover:underline">{data.user.user_email}</Link>
                            <p>{data.user.user_phone}</p>
                            </div>
                        </div>

                        <hr className="border-base-300" />

                        <p className="text-xl text-center font-medium text-base-content/50">
                            EduWeb avala el aprendizaje del alumno y valida las habilidades
                            obtenidas en este curso, desde lo más elemental hasta el manejo de
                            diversas herramientas.
                        </p>
                    </div>
                </section>
            ) : (
                <section className="w-full px-3">
                    <div className="w-full max-w-[1200px] mx-auto py-10">
                        <div className="card w-full max-w-md bg-black/25 border border-base-300 shadow-xl p-2 md:p-6 mx-auto">
                            <div className="card-body">
                                <h2 className="text-5xl font-bold text-primary font-alegreya text-center">
                                    EduWeb
                                </h2>
                                <p className="text-base-content/80">
                                    Introduce el código que se te proporciona. Esto te permitir
                                    comprobar que el certificado es auténtico y fue expedido por
                                    EduWeb
                                </p>

                                <input
                                    type="text"
                                    placeholder="INTRODUCE EL CÓDIGO"
                                    value={id}
                                    onChange={(e) => setId(e.target.value)}
                                    className="input input-bordered w-full mt-4 text-white focus:outline-none focus:border-primary"
                                />

                                <p className="text-sm italic text-base-content/60 mt-2 after:content-['*'] after:text-red-500 after:ml-0.5">
                                    El código aparece en la parte inferior del certificado
                                </p>

                                <button
                                    onClick={validateCertificate}
                                    className="btn btn-primary mt-4 w-full shadow-none"
                                >
                                    Validar
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
