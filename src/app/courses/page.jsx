"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// Hooks
import { useGetData } from "@/hooks/useFetch.js";
import { useSession } from "next-auth/react";

// Components
import { ArrowRight } from "@/components/icons.jsx";
import * as Icons from "react-icons/fa";
import LoadingComponent from "@/components/loading";

export default function Page() {
    const [categories, setCategories] = useState(null);
    const { data, status } = useSession();
    const userSession = data?.user;

    const { data: courses, loading: loadingCourses } = useGetData(
        "/courses?order=createdAt:DESC&" + (categories ? `category=${categories}&` : "")
    );
    const { data: userCourses, loading: loadingUCourses } = useGetData(
        `/users/${userSession?.user_id}/courses`
    );
    const { data: categoriesList, loading: loadingCategories } = useGetData("/categories");

    const calculateProgress = (userCourse) => {
        const totalLessons = userCourse.course.blocks.reduce(
            (acc, block) => acc + block.lessons.length,
            1
        );
        const completedLessons = userCourse.lessonsTaken.length;
        return Math.round((completedLessons / totalLessons) * 100);
    };

    useEffect(() => {
        document.title = "Cursos | Eduweb";
    }, []);

    if (loadingCourses || loadingUCourses || loadingCategories || status === "loading")
        return <LoadingComponent />;
    return (
        <>
            {userSession && (
                <section className="w-full px-3">
                    <div className="w-full max-w-[1200px] mx-auto py-10">
                        <div className="flex flex-col gap-8">
                            <div className="flex flex-col lg:flex-row w-full justify-between gap-2">
                                <h2 className="text-2xl font-bold">Mis cursos pendientes</h2>
                                <Link
                                    href="/profile"
                                    className="border-b border-primary leading-[1] text-primary flex items-center gap-5 w-fit text-xs md:text-sm"
                                >
                                    Ir a mis cursos <ArrowRight size={12} />
                                </Link>
                            </div>
                            <Swiper
                                modules={[Pagination]}
                                spaceBetween={20}
                                breakpoints={{
                                    320: {
                                        slidesPerView: 1,
                                        spaceBetween: 10,
                                    },
                                    640: {
                                        slidesPerView: 2,
                                        spaceBetween: 10,
                                    },
                                    1024: {
                                        slidesPerView: 3,
                                        spaceBetween: 20,
                                    },
                                }}
                                pagination={{ clickable: true }}
                                className="w-full pb-[2.5rem_!important]"
                            >
                                {userCourses
                                    .filter((c) => c.course_state == "progress")
                                    .map((userCourse) => (
                                        <SwiperSlide
                                            key={userCourse.course_id}
                                            className="w-full h-[initial_!important]"
                                        >
                                            <CourseCard
                                                course={userCourse.course}
                                                userCourse={userCourse}
                                                progress
                                            />
                                        </SwiperSlide>
                                    ))}
                                {!userCourses.some((c) => c.course_state == "progress") && (
                                    <SwiperSlide>
                                        <p className="text-base-content/70">
                                            No tienes cursos pendientes
                                        </p>
                                    </SwiperSlide>
                                )}
                            </Swiper>
                        </div>
                    </div>
                </section>
            )}
            <section className="w-full px-3">
                <div className="w-full max-w-[1200px] mx-auto py-5">
                    <div className="flex flex-col gap-3">
                        <h2 className="text-2xl font-bold">Descubre las categorias</h2>
                        <div className="flex flex-wrap gap-4">
                            {categoriesList.map((c) => {
                                const Icon = Icons[c.category_icon];
                                return (
                                    <button
                                        key={c.category_id}
                                        onClick={() =>
                                            setCategories((prev) =>
                                                prev == c.category_id ? null : c.category_id
                                            )
                                        }
                                        className={`badge badge-lg ${
                                            categories == c.category_id
                                                ? ""
                                                : "badge-soft hover:bg-primary/30"
                                        } badge-primary border-[1px_solid_var(--color-primary)_!important] duration-300 cursor-pointer`}
                                    >
                                        <Icon />
                                        <span>{c.category_name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>
            <section className="w-full px-3">
                <div className="w-full max-w-[1200px] mx-auto py-10">
                    <div className="flex flex-col gap-8">
                        <h2 className="text-2xl font-bold">Explora nuestros cursos</h2>
                        <Swiper
                            modules={[Pagination]}
                            spaceBetween={20}
                            breakpoints={{
                                320: {
                                    slidesPerView: 1,
                                    spaceBetween: 10,
                                },
                                640: {
                                    slidesPerView: 2,
                                    spaceBetween: 15,
                                },
                                1024: {
                                    slidesPerView: 3,
                                    spaceBetween: 20,
                                },
                            }}
                            pagination={{ clickable: true }}
                            className="w-full pb-[2.5rem_!important]"
                        >
                            {courses.map((course) => (
                                <SwiperSlide key={course.course_id} style={{ height: "initial" }}>
                                    <CourseCard course={course} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </section>
        </>
    );
}

function CourseCard({ course, progress = false, userCourse }) {
    const { teacher, category, blocks } = course;
    const calculateProgress = (userCourse) => {
        const totalLessons = userCourse.course.blocks.reduce(
            (acc, block) => acc + block.lessons.length,
            1
        );
        const completedLessons = userCourse.lessonsTaken.length;
        return Math.round((completedLessons / totalLessons) * 100);
    };

    const lessons = blocks.flatMap((block) => block.lessons);
    const seconds = lessons.reduce((acc, l) => {
        const hours = parseInt(l.lesson_duration.split(":")[0]);
        const minutes = parseInt(l.lesson_duration.split(":")[1]);
        const seconds = parseInt(l.lesson_duration.split(":")[2]);
        const total = hours * 3600 + minutes * 60 + seconds;
        return acc + total;
    }, 0);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const duration = `${hours} horas ${minutes} minutos`;

    return (
        <div className="bg-base-100 rounded-lg border border-white/20 overflow-hidden w-full min-w-[300px] max-w-[350px] h-full mx-auto md:mx-0">
            <Link className="w-full flex flex-col h-full" href={`/courses/${course.course_id}`}>
                <figure className="w-full aspect-[16/9] group flex items-center justify-center overflow-hidden relative">
                    <img
                        src={course.course_image}
                        alt={course.course_name}
                        className="w-full h-full object-cover scale-100 group-hover:scale-110 duration-300"
                    />
                    <div className="absolute w-full h-full bg-gradient-to-t from-black/80 to-transparent flex items-end justify-between opacity-0 group-hover:opacity-100 duration-300 p-2">
                        <button className="btn btn-primary btn-sm text-sm shadow-none">
                            Ver curso
                        </button>
                        <span className="text-xs text-base-content/70">{duration}</span>
                    </div>
                </figure>
                <div className="flex flex-row gap-5 justify-between flex-1 h-full p-4">
                    {progress && (
                        <div className="flex items-center justify-center relative">
                            <div className="avatar">
                                <div className="w-8 rounded-full">
                                    <img
                                        src={userCourse.course.teacher.user_image}
                                        alt={userCourse.course.teacher.user_name}
                                    />
                                </div>
                            </div>
                            <div
                                className="radial-progress text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                                style={{
                                    "--value": calculateProgress(userCourse),
                                    "--size": "2.8rem",
                                    "--thickness": "3px",
                                }}
                                role="progressbar"
                            ></div>
                        </div>
                    )}
                    <div className="space-y-4 h-full flex flex-col">
                        <div className="grow">
                            <h3 className="text-lg font-semibold leading-[1.15]">
                                {course.course_name}
                            </h3>
                            <p className="text-base-content/70">
                                {"Por " + teacher.user_name + " " + teacher.user_lastname}
                            </p>
                        </div>
                        {!progress && (
                            <div className="flex flex-wrap gap-2">
                                <span className="badge text-xs">{category.category_name}</span>
                                <span className="badge text-xs">{course.course_difficulty}</span>
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
}
