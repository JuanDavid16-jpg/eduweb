"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import CourseCreateForm from "@/components/CourseCreateForm";
import { useSession } from "next-auth/react";

export default function CreateCoursePage() {
    const { data, status } = useSession();
    const userSession = data?.user;

    const router = useRouter();

    useEffect(() => {
        document.title = "Crear Curso | Eduweb";

        if (status === "unauthenticated") {
            router.push("/login");
        }

        if (status === "authenticated" && userSession.role_id !== 2) {
            router.push("/");
        }
    }, [status, userSession, router]);

    return (
        <div className="container mx-auto px-4 py-8">
            <CourseCreateForm />
        </div>
    );
}
