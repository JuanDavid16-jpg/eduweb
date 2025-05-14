import Link from "next/link";

// Components
import { ClockIcon, GraduationCapIcon, UserIcon } from "@/components/icons";

// Hooks
import { getServerData } from "@/hooks/serverFetch.js";

export default async function Page({ params }) {
    const { id } = await params;

    const teacher = await getServerData(`/users/${id}`);
    const courses = await getServerData(`/users/${id}/teacher`);

    const teacherStudents = courses.flatMap((course) => course.students);

    return (
        <>
            <section className="w-full px-3">
                <div className="w-full max-w-[1200px] mx-auto py-10">
                    <div className="space-y-8">
                        <div className="flex flex-col md:flex-row text-center md:text-left gap-6 items-center">
                            <div className="avatar">
                                <div className="w-32 rounded">
                                    <img
                                        src={teacher.user_image}
                                        alt={teacher.user_name}
                                        className="object-contain w-full h-full"
                                    />
                                </div>
                            </div>
                            <div className="grow h-32 flex flex-col justify-between">
                                <div className="space-y-2">
                                    <div>
                                        <h1 className="text-3xl font-bold">
                                            {teacher.user_name} {teacher.user_lastname}
                                        </h1>
                                        <p>{teacher.user_profession}</p>
                                    </div>
                                    <p className="mt-2">{teacher.user_email}</p>
                                </div>
                                <div className="flex justify-center md:justify-start gap-2">
                                    <div className="badge badge-primary badge-soft border-[var(--primary)_!important] text-sm">
                                        {courses.length} cursos
                                    </div>
                                    <div className="badge badge-primary badge-soft border-[var(--primary)_!important] text-sm">
                                        {teacherStudents.length} estudiantes
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="border-base-300" />

                        <div className="space-y-8 w-full">
                            <h2 className="text-2xl font-bold mb-6">Cursos</h2>
                            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6 w-full">
                                {courses.map((course) => (
                                    <div
                                        key={course.course_id}
                                        className="bg-base-100 rounded-lg border border-white/20 overflow-hidden w-full min-w-[300px] max-w-[340px] flex flex-col"
                                    >
                                        <Link
                                            className="w-full flex-1 flex flex-col"
                                            href={`/courses/${course.course_id}`}
                                        >
                                            <figure className="w-full aspect-[16/9] group flex items-center justify-center overflow-hidden bg-white relative">
                                                <img
                                                    src={course.course_image}
                                                    alt={course.course_name}
                                                    className="w-full h-full object-cover scale-100 group-hover:scale-110 duration-300"
                                                />
                                                <div className="absolute w-full h-full bg-gradient-to-t from-black/80 to-transparent flex items-end justify-start opacity-0 group-hover:opacity-100 duration-300">
                                                    <button className="btn btn-primary btn-sm text-sm ml-2 mb-2 shadow-none">
                                                        Ver curso
                                                    </button>
                                                </div>
                                            </figure>
                                            <div className="p-4 flex flex-col gap-2 flex-1">
                                                <h3 className="text-lg font-semibold grow leading-tight">
                                                    {course.course_name}
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    <div className="badge badge-primary badge-soft border-[var(--primary)_!important] text-sm">
                                                        <UserIcon size={12} />
                                                        {course.students.length} estudiante
                                                        {course.students.length == 1 ? "" : "s"}
                                                    </div>
                                                    <div className="badge badge-primary badge-soft border-[var(--primary)_!important] text-sm">
                                                        <GraduationCapIcon size={16} />
                                                        {course.course_difficulty}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
