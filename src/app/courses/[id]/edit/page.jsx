"use client";

import React, { useEffect } from "react";
import { redirect } from "next/navigation";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";

// Hooks
import { useGetData } from "@/hooks/useFetch";
import { useSession } from "next-auth/react";

// Components
import LoadingComponent from "@/components/loading";
const CourseEditForm = dynamic(() => import("@/components/CourseEditForm"), {
    loading: () => <LoadingComponent />,
});

export default function Page() {
    const { id } = useParams();
    const { data: session, status } = useSession();
    const userSession = session?.user;
    const {
        data: course,
        loading: courseLoading,
        reload: reloadCourse,
    } = useGetData(`/courses/${id}`);
    const {
        data: exam,
        loading: examLoading,
        reload: reloadExam,
    } = useGetData(`/courses/${id}/exam`);

    useEffect(() => {
        document.title = "Editar Curso | Eduweb";
    }, []);

    if (status === "unauthenticated") {
        redirect("/login");
    }

    if (courseLoading || examLoading || status === "loading") {
        return <LoadingComponent />;
    }

    if (course.teacher_id !== userSession.user_id) {
        redirect("/profile");
    }

    return (
        <section className="w-full px-3">
            <div className="w-full max-w-[1200px] mx-auto py-10">
                <div className="flex flex-col gap-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Editar Curso</h1>
                        <p className="text-base-content/70">Actualiza la información de tu curso</p>
                    </div>

                    <CourseEditForm
                        course={course}
                        exam={exam}
                        reload={() => {
                            reloadCourse();
                            reloadExam();
                        }}
                    />
                </div>
            </div>
        </section>
    );
}
