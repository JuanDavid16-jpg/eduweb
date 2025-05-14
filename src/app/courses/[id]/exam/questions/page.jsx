"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";

// Hooks
import { useGetData, usePostData } from "@/hooks/useFetch";

// Components
import { TimerIcon } from "@/components/icons";
import LoadingComponent from "@/components/loading";

export default function Page() {
    const { id } = useParams();
    const { data, status } = useSession();
    const router = useRouter();
    const user = data?.user;

    const { data: course, loading: loadingCourse } = useGetData(`/courses/${id}`);
    const { data: exam, loading: loadingExam } = useGetData(`/courses/${id}/exam`);
    const { data: examInfo, loading: loadingExamInfo } = useGetData(
        `/users/${user?.user_id}/courses/${id}/exams/start`
    );

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [timeLeft, setTimeLeft] = useState(600);
    const [answers, setAnswers] = useState({});

    const timerRef = useRef(null);
    const answersRef = useRef({});
    const unloadHandlerRef = useRef(null);

    const handleAnswerChange = (questionId, answerId) => {
        const updated = {
            ...answersRef.current,
            [questionId]: answerId,
        };
        setAnswers(updated);
        answersRef.current = updated;
    };

    const handleSubmit = async () => {
        const data = Object.values(answersRef.current);

        const response = await usePostData(
            `/users/${user?.user_id}/courses/${id}/exams/${examInfo.user_exam_id}`,
            { answers: data }
        );

        if (response.success) {
            if (timerRef.current) clearInterval(timerRef.current);
            if (unloadHandlerRef.current) {
                window.removeEventListener("beforeunload", unloadHandlerRef.current);
            }

            router.push(`/courses/${id}/exam/${examInfo.user_exam_id}/results`);
        }
    };

    useEffect(() => {
        document.title = "Preguntas Examen | EduWeb";

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, []);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = "";
        };

        unloadHandlerRef.current = handleBeforeUnload;
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    useEffect(() => {
        if (status === "unauthenticated") {
            alert("No estás autenticado");
            return router.push(`/login`);
        }

        if (!loadingExamInfo && !examInfo) {
            alert("No te has inscrito en este curso");
            return router.push(`/courses/${id}`);
        }

        if (loadingExamInfo) return;

        const secondsLeft = new Date(examInfo.createdAt).getTime() + 10 * 60 * 1000 - Date.now();
        setTimeLeft(Math.ceil(secondsLeft / 1000));
    }, [examInfo]);

    if (loadingExam || loadingCourse || loadingExamInfo) return <LoadingComponent />;
    const question = exam.questions[currentQuestion];

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    if (!examInfo)
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <h2 className="text-2xl font-bold">No hay examen</h2>
            </div>
        );

    return (
        <>
            <section className="w-full px-3">
                <div className="w-full max-w-[1200px] mx-auto mt-10 flex flex-col gap-5">
                    <div>
                        <h2 className="text-2xl font-bold">{course.course_name}</h2>
                        <p className="text-base-content/80">
                            Pregunta {currentQuestion + 1} de {exam.questions.length}
                        </p>
                    </div>
                    <progress
                        className="progress progress-primary w-full"
                        value={((currentQuestion + 1) / exam.questions.length) * 100}
                        max="100"
                    ></progress>
                </div>
            </section>
            <section className="w-full px-3">
                <div className="w-full max-w-[1200px] mx-auto py-10">
                    <h3 className="text-xl font-bold">{question.question_text}</h3>
                    <ul className="grid grid-cols-1 gap-5 mt-4">
                        {question.answers.map((answer) => (
                            <li key={answer.answer_id}>
                                <input
                                    type="radio"
                                    name={`question-${question.question_id}`}
                                    id={answer.answer_id}
                                    checked={answers[question.question_id] === answer.answer_id}
                                    onChange={() =>
                                        handleAnswerChange(question.question_id, answer.answer_id)
                                    }
                                    disabled={timeLeft <= 0}
                                    className="mr-2"
                                />
                                <label htmlFor={answer.answer_id}>{answer.answer_text}</label>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-15 flex items-center justify-between gap-4">
                        <button
                            className="btn btn-outline btn-primary"
                            onClick={() => setCurrentQuestion(currentQuestion - 1)}
                            disabled={currentQuestion === 0}
                        >
                            Anterior
                        </button>

                        <div className="text-center flex gap-2 items-center justify-center text-base-content/60 w-25">
                            <span>
                                <TimerIcon className="mx-auto" size={20} />
                            </span>
                            <p className="text-lg font-semibold">{formatTime(timeLeft)}</p>
                        </div>

                        {currentQuestion < exam.questions.length - 1 ? (
                            <button
                                className="btn btn-primary shadow-none h-auto py-2 w-fit"
                                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                                disabled={!answers[question.question_id]}
                            >
                                Siguiente
                            </button>
                        ) : (
                            <button
                                className="btn btn-primary shadow-none h-auto py-2 w-fit"
                                onClick={handleSubmit}
                                disabled={
                                    Object.keys(answers).length !== exam.questions.length ||
                                    timeLeft <= 0
                                }
                            >
                                Enviar examen
                            </button>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}
