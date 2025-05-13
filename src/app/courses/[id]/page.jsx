import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// Components
import { ClockIcon, GraduationCapIcon, CubesIcon, TasksIcon } from "@/components/icons";

// Hooks
import { getServerData } from "@/hooks/serverFetch.js";

export const metadata = {
    title: "Curso | EduWeb",
};

export default async function Page({ params }) {
    const { id } = await params;
    const data = await getServerSession(authOptions);
    const userSession = data ? data.user : null;

    const course = await getServerData(`/courses/${id}`);
    const ucourse = await getServerData(`/users/${userSession?.user_id}/courses/${id}`);

    if (!course) {
        return (
            <div className="w-full max-w-[1200px] mx-auto text-4xl font-extrabold mt-15">
                Curso no encontrado
            </div>
        );
    }

    if (ucourse) {
        const { lessonsTaken } = ucourse;
        const courseLessons = course.blocks.flatMap((block) =>
            block.lessons.map((lesson) => lesson)
        );

        ucourse.lessonsTaken = lessonsTaken.map((lesson) => {
            const courseLesson = courseLessons.find((cl) => cl.lesson_id === lesson.lesson_id);
            return { ...lesson, block_id: courseLesson.block_id };
        });
    }

    const duration = course.blocks.reduce((acc, block) => {
        return (
            acc +
            block.lessons.reduce((acc2, lesson) => {
                const [hours, minutes, seconds] = lesson.lesson_duration.split(":").map(Number);
                return acc2 + hours * 60 * 60 + minutes * 60 + seconds;
            }, 0)
        );
    }, 0);

    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);

    return (
        <>
            <section className="w-full px-3">
                <div className="w-full max-w-[1200px] mx-auto py-10">
                    <div className="flex flex-col-reverse md:flex-row gap-5">
                        <div className="w-full md:w-2/3 flex flex-col gap-10">
                            <article>
                                <h2 className="text-4xl font-semibold leading-tight">
                                    {course.course_name}
                                </h2>
                                <p className="text-sm text-base-content/80">
                                    Publicado el {new Date(course.createdAt).toDateString("es-CO")}
                                </p>
                                <div className="flex flex-wrap gap-2 py-3">
                                    <div className="badge badge-lg">
                                        <GraduationCapIcon size={15} />
                                        {course.category.category_name}
                                    </div>
                                    <div className="badge badge-lg">
                                        <CubesIcon size={15} />
                                        {course.course_difficulty}
                                    </div>
                                    <div className="badge badge-lg">
                                        <ClockIcon size={15} />
                                        {hours}h {minutes}m
                                    </div>
                                </div>
                                <p className="text-base-content/80">{course.course_description}</p>
                            </article>
                            <ul className="timeline timeline-vertical">
                                {course.blocks
                                    .sort((a, b) => a.block_order - b.block_order)
                                    .map((block) => {
                                        const isBlockCompleted = ucourse?.lessonsTaken.some(
                                            (lt) => lt.block_id === block.block_id
                                        );
                                        return (
                                            <React.Fragment key={block.block_id}>
                                                <BlockLesson
                                                    block={block}
                                                    isCompleted={isBlockCompleted}
                                                />
                                                {block.lessons
                                                    .sort((a, b) => a.lesson_order - b.lesson_order)
                                                    .map((lesson) => {
                                                        const isCompleted =
                                                            ucourse?.lessonsTaken.find(
                                                                (lt) =>
                                                                    lt.lesson_id ===
                                                                    lesson.lesson_id
                                                            );

                                                        return (
                                                            <LessonItem
                                                                key={lesson.lesson_id}
                                                                lesson={lesson}
                                                                course_id={id}
                                                                isCompleted={isCompleted}
                                                            />
                                                        );
                                                    })}
                                            </React.Fragment>
                                        );
                                    })}
                                <li className="grid grid-cols-[0fr_15px_2fr_!important]">
                                    <hr
                                        className={
                                            ucourse?.course_state === "completed"
                                                ? "bg-primary"
                                                : "bg-base-300"
                                        }
                                    />
                                    <div className="timeline-middle">
                                        <div
                                            className={`w-2 aspect-square ${
                                                ucourse?.course_state === "completed"
                                                    ? "bg-primary"
                                                    : "bg-base-300"
                                            } rounded-full`}
                                        ></div>
                                    </div>
                                    <div className="timeline-end pl-5 py-3">
                                        <Link href={`/courses/${id}/exam`}>
                                            <div className="flex gap-5">
                                                <figure className="w-18 aspect-square object-cover rounded-lg bg-black/30 flex items-center justify-center">
                                                    <TasksIcon className="text-3xl text-primary" />
                                                </figure>
                                                <div>
                                                    <h3 className="text-lg font-semibold">
                                                        Evaluación final
                                                    </h3>
                                                    <p className="text-base-content/70">
                                                        completa esta evaluación para obtener tu
                                                        certificado
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </li>
                            </ul>
                            <section className="flex flex-col md:flex-row gap-5 py-5">
                                <div className="space-y-4">
                                    <div>
                                        <div className="badge badge-primary badge-soft border-[var(--color-primary)_!important] rounded text-sm">
                                            Certificado digital
                                        </div>
                                        <h2 className="text-3xl font-bold">
                                            ¡Comparte tus logros con un certificado!
                                        </h2>
                                    </div>
                                    <p className="mt-2 text-base">
                                        Cuando termines el curso tendrás acceso al certificado
                                        digital para compartirlo con tu familia, amigos, empleadores
                                        y la comunidad.
                                    </p>
                                </div>
                                <img
                                    src="/certificate.png"
                                    alt="Certificado de Platzi"
                                    className="rounded shadow-md w-full md:w-2/5"
                                />
                            </section>
                            <section className="space-y-4">
                                <div>
                                    <div className="badge badge-primary badge-soft border-[var(--color-primary)_!important] rounded text-sm">
                                        Profe del curso
                                    </div>
                                    <h2 className="text-3xl font-bold">
                                        Conoce quien enseña el curso
                                    </h2>
                                </div>

                                <div className="flex items-center gap-6 bg-base-200/50 p-4 rounded-box shadow-md">
                                    <div className="avatar">
                                        <div className="w-25 rounded">
                                            <img
                                                src={course.teacher.user_image}
                                                alt={course.teacher.user_name}
                                                className="object-contain"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold">
                                            {course.teacher.user_name}{" "}
                                            {course.teacher.user_lastname}
                                        </h3>
                                        <p className="text-sm text-gray-400">
                                            {course.teacher.user_profession}
                                        </p>
                                        <Link
                                            href={`/teachers/${course.teacher_id}`}
                                            className="link link-primary mt-3 block"
                                        >
                                            Ver cursos de {course.teacher.user_name} →
                                        </Link>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <div className="w-full md:w-1/3">
                            <div className="bg-base-100 rounded-lg border border-white/20 overflow-hidden sticky top-10">
                                <figure className="w-full aspect-[16/9] flex items-center justify-center overflow-hidden bg-white relative">
                                    <img
                                        src={course.course_image}
                                        alt={course.course_name}
                                        className="w-full h-full object-cover"
                                    />
                                </figure>
                                <div className="p-4 flex flex-col gap-5">
                                    <div>
                                        <h3 className="text-lg font-semibold">
                                            {course.course_name}
                                        </h3>
                                        <p className="text-base-content/70">
                                            Por{" "}
                                            {course.teacher.user_name +
                                                " " +
                                                course.teacher.user_lastname}
                                        </p>
                                    </div>
                                    <Link
                                        href={`/courses/${course.course_id}/lessons/${course.blocks[0].lessons[0].lesson_id}`}
                                    >
                                        <button className="btn btn-primary shadow-none rounded-lg w-full">
                                            {ucourse?.course_state === "progress" ? (
                                                <span>Continuar curso</span>
                                            ) : (
                                                <span>
                                                    {ucourse
                                                        ? "Volver a ver curso"
                                                        : "Empezar curso"}
                                                </span>
                                            )}
                                        </button>
                                    </Link>
                                    {ucourse?.course_state === "completed" && (
                                        <Link
                                            href={`/api/users/${userSession.user_id}/courses/${id}/certificate`}
                                            target="_blank"
                                        >
                                            <button className="btn btn-primary btn-outline shadow-none rounded-lg w-full">
                                                <span>Ver certificado</span>
                                            </button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

function BlockLesson({ block, isCompleted }) {
    return (
        <li className="grid grid-cols-[0fr_15px_2fr_!important]">
            {block.block_order > 1 && <hr className={isCompleted ? "bg-primary" : "bg-base-300"} />}
            <div className="timeline-end pl-5 text-lg text-base-content/80 italic">
                {block.block_description}
            </div>
            <div className="timeline-middle">
                <div
                    className="w-2 aspect-square rounded-full"
                    style={{
                        background: isCompleted ? "var(--color-primary)" : "var(--color-base-300)",
                    }}
                ></div>
            </div>
            <hr className={isCompleted ? "bg-primary" : "bg-base-300"} />
        </li>
    );
}

function LessonItem({ lesson, isCompleted, course_id }) {
    return (
        <li className="grid grid-cols-[0fr_15px_2fr_!important]">
            <hr className={isCompleted ? "bg-primary" : "bg-base-300"} />
            <div className="timeline-middle">
                <div
                    className="w-2 aspect-square rounded-full"
                    style={{
                        background: isCompleted ? "var(--color-primary)" : "var(--color-base-300)",
                    }}
                ></div>
            </div>
            <div className="timeline-end pl-5 py-3 w-full">
                <Link href={`/courses/${course_id}/lessons/${lesson.lesson_id}`} className="w-full">
                    <div className="flex flex-row gap-5 w-full">
                        <img
                            src={lesson.lesson_image}
                            className="w-18 aspect-square object-cover rounded-lg"
                            alt={"Imagen " + lesson.lesson_title}
                        />
                        <div className="flex flex-col text-sm">
                            <p className="grow">{lesson.lesson_title}</p>
                            <p className="text-base-content/70">
                                {parseInt(lesson.lesson_duration.split(":")[0]) > 0 && (
                                    <span className="mr-2">
                                        {lesson.lesson_duration.split(":")[0] + " horas"}
                                    </span>
                                )}
                                <span>{lesson.lesson_duration.split(":")[1] + " minutos"}</span>
                            </p>
                        </div>
                    </div>
                </Link>
            </div>
            <hr className={isCompleted ? "bg-primary" : "bg-base-300"} />
        </li>
    );
}
