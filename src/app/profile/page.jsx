"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";

// Components
import { GlobeIcon, PlusIcon } from "@/components/icons";
import LoadingComponent from "@/components/loading";
import UserUpdate from "@/components/userUpdate";
import PdfViewer from "@/components/pdfViewer";
import ChartComponent from "@/components/chart";

// Hooks
import { useGetData } from "@/hooks/useFetch";

export default function Page() {
    const { data, status, update } = useSession();
    const userSession = data?.user;

    const { data: courses, loading: loadingCourses } = useGetData(
        "/users/" + userSession?.user_id + "/courses"
    );
    const { data: teacherCourses, loading: loadingTeacherCourses } = useGetData(
        "/users/" + userSession?.user_id + "/teacher"
    );

    useEffect(() => {
        document.title = "Perfil | Eduweb";
    }, []);

    if (status == "loading" || loadingCourses || loadingTeacherCourses) return <LoadingComponent />;
    if (!userSession) return <>No estas logueado</>;
    return (
        <>
            <section className="w-full px-3">
                <div className="w-full max-w-[1200px] mx-auto py-10">
                    <div className="flex flex-col md:flex-row gap-5">
                        <div className="article bg-black/25 border border-base-300 p-8 rounded-lg flex flex-col gap-3 w-full md:w-2/7 h-fit">
                            <div className="avatar">
                                <div className="w-24 rounded-full">
                                    <img src={userSession.user_image} alt="Imagen de perfil" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold leading-[1]">
                                    {userSession.user_name} {userSession.user_lastname}
                                </h2>
                                <p className="text-base-content/80 text-lg italic font-medium capitalize">
                                    {userSession.user_profession || userSession.role.role_name}
                                </p>
                            </div>
                            <div>
                                <p>{userSession.user_email}</p>
                                <p>{userSession.user_phone}</p>
                            </div>
                            {userSession.user_website && (
                                <p className="flex items-center gap-2 text-primary truncate text-ellipsis">
                                    <span>
                                        <GlobeIcon size={20} />
                                    </span>
                                    <Link
                                        href={userSession.user_website}
                                        className="underline"
                                        target="_blank"
                                    >
                                        {userSession.user_website}
                                    </Link>
                                </p>
                            )}
                            <button
                                onClick={() =>
                                    document
                                        .querySelector(`#edit-modal-${userSession.user_id}`)
                                        .show()
                                }
                                className="btn btn-primary shadow-none h-auto py-1 px-5 w-fit  mt-3"
                            >
                                Editar perfil
                            </button>
                        </div>
                        <div className="w-full md:w-5/7">
                            <div className="tabs tabs-lift">
                                <label className="tab">
                                    <input type="radio" name="my_tabs_4" defaultChecked />
                                    Mis cursos
                                </label>
                                <div className="tab-content bg-base-100 border-base-300 p-6">
                                    <div className="flex flex-col gap-8">
                                        <div>
                                            <h2 className="text-2xl font-bold">Tus Cursos</h2>
                                            <p className="text-base-content/80 text-lg leading-tight">
                                                Los materiales de cada curso equivalen a un 70% del
                                                total, mientras que el examen comprende el otro 30%.
                                                Puedes tomar el examen en cualquier momento cuando
                                                estés listo.
                                            </p>
                                        </div>
                                        <hr />
                                        <div className="flex flex-col gap-5">
                                            <h2 className="text-2xl font-bold">
                                                Cursos pendientes
                                            </h2>
                                            {!courses.some((c) => c.course_state == "progress") && (
                                                <div>
                                                    <p className="text-base-content/80 text-lg leading-tight">
                                                        No tienes cursos pendientes...
                                                    </p>
                                                    <Link
                                                        href="/courses"
                                                        className="btn btn-primary shadow-none h-auto py-1 px-5 w-fit  mt-3"
                                                    >
                                                        Ver cursos
                                                    </Link>
                                                </div>
                                            )}
                                            {courses
                                                .filter(
                                                    (course) => course.course_state == "progress"
                                                )
                                                .map((course) => {
                                                    const totalLessons =
                                                        course.course.blocks.reduce(
                                                            (acc, block) =>
                                                                acc + block.lessons.length,
                                                            1
                                                        );

                                                    const progress =
                                                        (course.lessonsTaken.length /
                                                            totalLessons) *
                                                        100;
                                                    return (
                                                        <article
                                                            key={course.course_id}
                                                            className="flex flex-col md:flex-row gap-8"
                                                        >
                                                            <Link
                                                                href={
                                                                    "/courses/" + course.course_id
                                                                }
                                                                className="hidden md:block"
                                                            >
                                                                <div className="avatar bg-black/25 rounded-lg">
                                                                    <div className="w-24 rounded-lg">
                                                                        <img
                                                                            src={
                                                                                course.course
                                                                                    .course_image
                                                                            }
                                                                            alt="Imagen de perfil"
                                                                            className="[object-fit:contain_!important]"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                            <div className="grow flex flex-col gap-2">
                                                                <Link
                                                                    href={
                                                                        "/courses/" +
                                                                        course.course_id
                                                                    }
                                                                >
                                                                    <h2 className="text-xl font-medium leading-[1] mb-2">
                                                                        {course.course.course_name}
                                                                        {" - "}
                                                                        <span className="text-primary font-bold leading-tight tracking-tight">
                                                                            {progress.toFixed(0)} %
                                                                        </span>
                                                                    </h2>
                                                                </Link>
                                                                <progress
                                                                    className="progress progress-primary w-full"
                                                                    value={progress}
                                                                    max="100"
                                                                ></progress>
                                                                <p className="text-base-content/80 text-lg leading-tight">
                                                                    {course.lessonsTaken.length}
                                                                    {" clases tomadas de "}
                                                                    {totalLessons}
                                                                </p>
                                                            </div>
                                                            <div className="h-full flex items-center justify-center">
                                                                <Link
                                                                    href={`/courses/${course.course_id}`}
                                                                >
                                                                    <button className="btn btn-primary shadow-none h-auto py-2 px-5 w-fit mt-3">
                                                                        Continuar curso
                                                                    </button>
                                                                </Link>
                                                            </div>
                                                        </article>
                                                    );
                                                })}
                                        </div>
                                        <div className="flex flex-col gap-5">
                                            <h2 className="text-2xl font-bold">
                                                Cursos completados
                                            </h2>
                                            {!courses.some(
                                                (c) => c.course_state == "completed"
                                            ) && (
                                                <div>
                                                    <p className="text-base-content/80 text-lg leading-tight">
                                                        Aún no has completado ningun curso
                                                    </p>
                                                </div>
                                            )}
                                            {courses
                                                .filter(
                                                    (course) => course.course_state == "completed"
                                                )
                                                .map((course) => {
                                                    return (
                                                        <article
                                                            key={course.course_id}
                                                            className="flex flex-col md:flex-row gap-8"
                                                        >
                                                            <Link
                                                                href={
                                                                    "/courses/" + course.course_id
                                                                }
                                                                className="hidden md:block"
                                                            >
                                                                <div className="avatar bg-black/25 rounded-lg">
                                                                    <div className="w-24 rounded-lg">
                                                                        <img
                                                                            src={
                                                                                course.course
                                                                                    .course_image
                                                                            }
                                                                            alt="Imagen de perfil"
                                                                            className="[object-fit:contain_!important]"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                            <div className="grow flex flex-col gap-2">
                                                                <Link
                                                                    href={
                                                                        "/courses/" +
                                                                        course.course_id
                                                                    }
                                                                >
                                                                    <h2 className="text-xl font-medium leading-[1] mb-2">
                                                                        {course.course.course_name}
                                                                        {" - "}
                                                                        <span className="text-primary font-bold leading-tight tracking-tight">
                                                                            100 %
                                                                        </span>
                                                                    </h2>
                                                                </Link>
                                                                <p className="text-primary font-bold">
                                                                    Felicidades por completar el
                                                                    curso con éxito!
                                                                </p>
                                                            </div>
                                                            <div className="h-full flex items-center justify-center">
                                                                <Link
                                                                    href={`/api/users/${userSession.user_id}/courses/${course.course_id}/certificate`}
                                                                    target="_blank"
                                                                >
                                                                    <button className="btn btn-primary shadow-none h-auto py-2 px-5 w-fit mt-3">
                                                                        Descarga tu certificado
                                                                    </button>
                                                                </Link>
                                                            </div>
                                                        </article>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                </div>

                                <label className="tab">
                                    <input type="radio" name="my_tabs_4" />
                                    Mis certificados
                                </label>
                                <div className="tab-content bg-base-100 border-base-300 p-6">
                                    <div className="flex flex-col gap-8">
                                        <div>
                                            <h2 className="text-2xl font-bold">Mis certificados</h2>
                                            <p className="text-base-content/80 text-lg leading-tight">
                                                En esta sección, podrás ver todos los certificados
                                                que has obtenido al completar los cursos. Puedes
                                                descargar tus certificados en formato PDF.
                                            </p>
                                        </div>
                                        <hr />
                                        {!courses.some((c) => c.course_state == "completed") && (
                                            <div>
                                                <p className="text-base-content/80 text-lg leading-tight">
                                                    Aún no has completado ningun curso...
                                                </p>
                                            </div>
                                        )}
                                        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-8">
                                            {courses
                                                .filter((c) => c.course_state == "completed")
                                                .map((course) => (
                                                    <article
                                                        key={course.course_id}
                                                        className="bg-black/25 border border-base-300 p-5 rounded-lg"
                                                    >
                                                        <div className="flex flex-col gap-5">
                                                            <figure className="w-full">
                                                                <PdfViewer
                                                                    id={course.user_course_id}
                                                                />
                                                            </figure>
                                                            <div>
                                                                <h2 className="font-medium leading-[1.05] mb-2">
                                                                    {course.course.course_name}
                                                                </h2>
                                                                <p className="text-xs mb-2">
                                                                    Aprobado el{" "}
                                                                    {new Date(
                                                                        course.course_completion
                                                                    ).toDateString("es-ES")}
                                                                </p>
                                                                <hr className="border-base-300" />
                                                                <Link
                                                                    href={`/api/users/${userSession.user_id}/courses/${course.course_id}/certificate`}
                                                                    target="_blank"
                                                                >
                                                                    <button className="btn btn-primary shadow-none h-auto py-1 px-5 w-full mt-3">
                                                                        Ver certificado
                                                                    </button>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </article>
                                                ))}
                                        </div>
                                    </div>
                                </div>

                                <label className="tab">
                                    <input type="radio" name="my_tabs_4" />
                                    Mi progreso
                                </label>
                                <div className="tab-content bg-base-100 border-base-300 p-6">
                                    <div className="flex flex-col gap-8">
                                        <div>
                                            <h2 className="text-2xl font-bold">Mi progreso</h2>
                                            <p className="text-base-content/80 text-lg leading-tight">
                                                En esta sección, tendrás la oportunidad de examinar
                                                detalladamente todas las clases que has completado
                                                durante la semana en tus cursos, permitiéndote
                                                llevar un seguimiento de tu progreso académico.
                                            </p>
                                        </div>
                                        <hr />
                                        <div>
                                            <ChartComponent
                                                userLessons={courses.flatMap((c) => c.lessonsTaken)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {userSession.role_id === 2 && (
                                    <>
                                        <label className="tab">
                                            <input type="radio" name="my_tabs_4" />
                                            Cursos creados
                                        </label>
                                        <div className="tab-content bg-base-100 border-base-300 p-6">
                                            <div className="flex flex-col gap-8">
                                                <div>
                                                    <h2 className="text-2xl font-bold">
                                                        Cursos creados
                                                    </h2>
                                                    <p className="text-base-content/80 text-lg leading-tight">
                                                        En esta sección, podrás ver todos los cursos
                                                        que has creado. Puedes ver la información de
                                                        cada curso y hacer cambios en el contenido.
                                                    </p>
                                                </div>
                                                <hr />
                                                <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
                                                    {teacherCourses.map((course) => {
                                                        const duration = course.blocks.reduce(
                                                            (acc, block) => {
                                                                return (
                                                                    acc +
                                                                    block.lessons.reduce(
                                                                        (acc2, lesson) => {
                                                                            const [
                                                                                hours,
                                                                                minutes,
                                                                                seconds,
                                                                            ] =
                                                                                lesson.lesson_duration
                                                                                    .split(":")
                                                                                    .map(Number);
                                                                            return (
                                                                                acc2 +
                                                                                hours * 60 * 60 +
                                                                                minutes * 60 +
                                                                                seconds
                                                                            );
                                                                        },
                                                                        0
                                                                    )
                                                                );
                                                            },
                                                            0
                                                        );

                                                        const hours = Math.floor(duration / 3600);
                                                        const minutes = Math.floor(
                                                            (duration % 3600) / 60
                                                        );

                                                        return (
                                                            <div
                                                                key={course.course_id}
                                                                className="bg-base-100 border border-base-300 rounded-lg overflow-hidden"
                                                            >
                                                                <div className="relative h-48">
                                                                    <img
                                                                        src={course.course_image}
                                                                        alt={course.course_name}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                    <div className="absolute top-2 right-2 flex flex-col gap-2 items-end">
                                                                        <Link
                                                                            href={`/courses/${course.course_id}/edit`}
                                                                        >
                                                                            <span className="badge badge-soft badge-primary">
                                                                                Editar
                                                                            </span>
                                                                        </Link>
                                                                        <span className="badge badge-soft">
                                                                            {`${hours}h ${minutes}m`}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="p-4">
                                                                    <Link
                                                                        href={`/courses/${course.course_id}`}
                                                                    >
                                                                        <h3 className="text- font-semibold mb-2 leading-[1.1] hover:underline hover:text-primary">
                                                                            {course.course_name}
                                                                        </h3>
                                                                    </Link>
                                                                    <p className=" text-xs mb-4 line-clamp-2">
                                                                        {course.course_description}
                                                                    </p>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        <span className="badge badge-soft">
                                                                            {
                                                                                course.category
                                                                                    .category_name
                                                                            }
                                                                        </span>
                                                                        <span className="badge badge-soft">
                                                                            {
                                                                                course.course_difficulty
                                                                            }
                                                                        </span>
                                                                        <span className="badge badge-soft">
                                                                            {course.students.length}
                                                                            {" estudiantes"}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                <Link href="/courses/create">
                                                    <button className="btn btn-primary shadow-none h-auto py-1 px-5 w-fit  mt-3">
                                                        <PlusIcon />
                                                        <span>Crear curso</span>
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <UserUpdate user={userSession} update={update} />
        </>
    );
}
