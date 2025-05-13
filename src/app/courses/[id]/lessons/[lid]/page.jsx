import React, { Fragment } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Markdown from "react-markdown";

// Components
import { CircleCheckIcon, TasksIcon } from "@/components/icons";
import VideoPlayer from "@/components/videoPlayer";

// Utils
import { getServerData } from "@/hooks/serverFetch.js";
import { authOptions } from "@/lib/authOptions";

export const metadata = {
    title: "Lección | EduWeb",
};

    export default async function Page({ params }) {
    const { id, lid } = await params;
    const data = await getServerSession(authOptions);
    const userSession = data?.user;

    if (!userSession) {
        redirect("/login");
    }

    await getServerData(`/users/${userSession.user_id}/courses/${id}/lessons/${lid}`);

    const course = await getServerData(`/courses/${id}`);
    const lesson = course.blocks.flatMap((b) => b.lessons).find((l) => l.lesson_id == lid);
    const courseLessons = course.blocks.flatMap((block) => block.lessons);
    const ucourse = await getServerData(`/users/${userSession.user_id}/courses/${id}`);

    if (ucourse) {
        const { lessonsTaken } = ucourse;

        ucourse.lessonsTaken = lessonsTaken.map((lesson) => {
            const courseLesson = courseLessons.find((cl) => cl.lesson_id === lesson.lesson_id);
            return { ...lesson, block_id: courseLesson.block_id };
        });
    }

    const videoUrl = new URL(lesson.lesson_video);
    const videoId = videoUrl.searchParams.get("v");

    const nextLesson = courseLessons.find((l) => l.lesson_order == lesson.lesson_order + 1);
    const prevLesson = courseLessons.find((l) => l.lesson_order == lesson.lesson_order - 1);

    return (
        <>
            <section className="w-full px-3">
                <div className="w-full max-w-[1200px] mx-auto py-10">
                    <div className="flex flex-col gap-10">
                        <header className="w-full bg-black/25 p-5 rounded-lg flex flex-col md:flex-row items-center justify-between gap-5">
                            <div className="flex items-center gap-6">
                                <Link
                                    href={`/courses/${id}`}
                                    className="btn btn-ghost btn-circle hidden md:inline-flex"
                                >
                                    <div className="avatar">
                                        <div className="w-16 aspect-square rounded-full bg-black/25 border border-base-300">
                                            <img
                                                src={course.course_image}
                                                alt={course.course_title}
                                                className="[object-fit:contain_!important]"
                                            />
                                        </div>
                                    </div>
                                </Link>
                                <div>
                                    <p className="font-semibold text-base-content/80">
                                        Clase {lesson.lesson_order} de {courseLessons.length}:
                                        <Link
                                            href={`/courses/${id}`}
                                            className="text-base-content/60 hover:underline ml-1.5"
                                        >
                                            {course.course_name}
                                        </Link>
                                    </p>
                                    <p className="text-lg font-bold">{lesson.lesson_title}</p>
                                </div>
                            </div>
                            <nav className="flex items-center gap-4">
                                <Link
                                    href={`/courses/${id}/lessons/${prevLesson?.lesson_id || lid}`}
                                >
                                    <button
                                        className="btn btn-primary btn-outline shadow-none"
                                        disabled={!prevLesson}
                                    >
                                        Anterior Clase
                                    </button>
                                </Link>

                                <Link
                                    href={`/courses/${id}${
                                        nextLesson ? "/lessons/" + nextLesson.lesson_id : "/exam"
                                    }`}
                                >
                                    <button className="btn btn-primary shadow-none">
                                        Siguiente Clase
                                    </button>
                                </Link>
                            </nav>
                        </header>

                        <div className="flex flex-col lg:flex-row gap-10">
                            <main className="flex flex-col gap-5 w-full lg:w-3/5">
                                <VideoPlayer videoId={videoId} />
                                <div className="bg-black/25 p-5 rounded-lg">
                                    <h2 className="text-2xl font-bold">Descripción</h2>
                                    <Markdown className="markdown">
                                        {lesson.lesson_description}
                                    </Markdown>
                                </div>
                            </main>
                            <aside className="flex flex-col gap-5 w-full lg:w-2/5">
                                <div className="bg-black/25 p-5 rounded-lg">
                                    <h2 className="text-2xl font-bold">Contenido</h2>
                                    <ul className="timeline timeline-vertical">
                                        {course.blocks
                                            .sort((a, b) => a.block_order - b.block_order)
                                            .map((block) => (
                                                <Fragment key={block.block_id}>
                                                    <BlockLesson
                                                        block={block}
                                                        isCompleted={ucourse.lessonsTaken.find(
                                                            (l) => l.block_id === block.block_id
                                                        )}
                                                    />
                                                    {block.lessons
                                                        .sort(
                                                            (a, b) =>
                                                                a.lesson_order - b.lesson_order
                                                        )
                                                        .map((lesson) => (
                                                            <LessonItem
                                                                key={lesson.lesson_id}
                                                                lesson={lesson}
                                                                course_id={id}
                                                                isCompleted={ucourse.lessonsTaken.find(
                                                                    (l) =>
                                                                        l.lesson_id ===
                                                                        lesson.lesson_id
                                                                )}
                                                            />
                                                        ))}
                                                </Fragment>
                                            ))}
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
                                            <div className="timeline-end px-5 py-3 hover:bg-base-300 rounded cursor-pointer duration-200">
                                                <Link href={`/courses/${id}/exam`}>
                                                    <div className="flex gap-5">
                                                        <figure className="w-18 flex-none aspect-square object-cover rounded-lg bg-black/30 flex items-center justify-center">
                                                            <TasksIcon className="text-3xl text-primary" />
                                                        </figure>
                                                        <div>
                                                            <h3 className="text-lg font-semibold">
                                                                Evaluación final
                                                            </h3>
                                                            <p className="text-base-content/70">
                                                                completa esta evaluación para
                                                                obtener tu certificado
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </aside>
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
            <div className="timeline-end px-5 py-3 hover:bg-base-300 rounded cursor-pointer duration-200 w-full">
                <Link href={`/courses/${course_id}/lessons/${lesson.lesson_id}`} className="w-full">
                    <div className="flex flex-row gap-5 w-full">
                        <img
                            src={lesson.lesson_image}
                            className="w-18 aspect-square object-cover rounded-lg"
                            alt={"Imagen " + lesson.lesson_title}
                        />
                        <div className="flex flex-col text-sm">
                            <p className="grow">{lesson.lesson_title}</p>
                            <p className="text-base-content/70 flex items-center gap-1.5">
                                {parseInt(lesson.lesson_duration.split(":")[0]) > 0 && (
                                    <span>{lesson.lesson_duration.split(":")[0] + " horas"}</span>
                                )}
                                <span>{lesson.lesson_duration.split(":")[1] + " minutos"}</span>
                                {isCompleted && (
                                    <span className="text-primary flex items-center gap-1">
                                        <CircleCheckIcon /> Completado
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                </Link>
            </div>
            <hr className={isCompleted ? "bg-primary" : "bg-base-300"} />
        </li>
    );
}
