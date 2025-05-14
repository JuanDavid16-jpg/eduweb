"use client";

import Swal from "sweetalert2";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import MDEditor from "@uiw/react-md-editor";

// Components
import {
    PencilIcon,
    PlusIcon,
    TrashIcon,
    DraggableIcon,
    CheckIcon,
    CloseIcon,
} from "@/components/icons";
import { usePostData } from "@/hooks/useFetch";
import { useSession } from "next-auth/react";

export default function CourseCreateForm() {
    const { data, status } = useSession();
    const userSession = data?.user;

    const [blocks, setBlocks] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [lessonDescriptions, setLessonDescriptions] = useState({});

    const router = useRouter();

    // Submit Function
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = Object.fromEntries(new FormData(e.target));
        delete formData["create-course"];

        const course = {
            course_id: crypto.randomUUID(),
            teacher_id: userSession.user_id,
            course_name: formData.course_name,
            course_description: formData.course_description,
            course_difficulty: formData.course_difficulty,
            course_image: formData.course_image,
            category_id: formData.category_id,
        };

        const exam = {
            exam_id: crypto.randomUUID(),
            course_id: course.course_id,
            exam_title: formData.exam_title,
            exam_description: formData.exam_description,
        };

        const lessonsList = [...blocks].flatMap((block) => block.lessons);
        const blockList = blocks.map((b) => {
            const { lessons, ...blockData } = b;
            return { ...blockData, course_id: course.course_id };
        });

        const answersList = [...questions].flatMap((question) => question.answers);
        const questionsList = questions.map((q) => {
            const { answers, ...questionData } = q;
            return { ...questionData, exam_id: exam.exam_id };
        });

        const data = {
            course: course,
            blocks: blockList,
            lessons: lessonsList,
            exam: exam,
            questions: questionsList,
            answers: answersList,
        };

        const response = await usePostData("/courses", data);

        if (response.success) {
            Swal.fire({
                title: "Éxito",
                text: "Curso creado correctamente",
                icon: "success",
                showCancelButton: true,
                confirmButtonText: "Ver resultado",
                cancelButtonText: "Cerrar",
                background: "var(--color-base-100)",
                color: "var(--color-base-content)",
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push(`/courses/${data.course.course_id}`);
                }
            });
        }
    };

    // Edit functions (Blocks, Lessons, MD Descriptions)
    const handleEditBlock = (e) => {
        e.preventDefault();
        const newBlocks = [...blocks];
        const { block_id, ...data } = Object.fromEntries(new FormData(e.target));

        const updatedBlocks = newBlocks.map((block) =>
            block.block_id === block_id ? { ...block, ...data } : block
        );

        setBlocks(updatedBlocks);
        e.target.closest("dialog").close();
    };

    const handleEditLesson = (e) => {
        e.preventDefault();

        const newBlocks = [...blocks];
        const { lesson_id, ...data } = Object.fromEntries(new FormData(e.target));

        const lessonsList = newBlocks.flatMap((block) => block.lessons);
        const updatedLessons = lessonsList.map((lesson) =>
            lesson.lesson_id === lesson_id
                ? { ...lesson, ...data, lesson_description: lessonDescriptions[lesson_id] }
                : lesson
        );

        const updatedBlocks = newBlocks.map((block) => ({
            ...block,
            lessons: updatedLessons.filter((lesson) => lesson.block_id === block.block_id),
        }));

        setBlocks(updatedBlocks);
        e.target.closest("dialog").close();
    };

    const handleDescriptionChange = (lessonId, value) => {
        setLessonDescriptions((prev) => ({
            ...prev,
            [lessonId]: value,
        }));
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-2">
                <div className="collapse collapse-arrow bg-base-100 border border-base-300">
                    <input type="radio" name="create-course" defaultChecked />
                    <div className="collapse-title font-semibold">
                        <h2 className="text-xl font-bold">Crear Curso</h2>
                    </div>
                    <div className="collapse-content text-sm">
                        <CourseForm />
                    </div>
                </div>
                <div className="collapse collapse-arrow bg-base-100 border border-base-300">
                    <input type="radio" name="create-course" />
                    <div className="collapse-title font-semibold">
                        <h2 className="text-xl font-bold">Contenido del curso</h2>
                    </div>
                    <div className="collapse-content text-sm">
                        <ContentForm blocks={blocks} setBlocks={setBlocks} />
                    </div>
                </div>
                <div className="collapse collapse-arrow bg-base-100 border border-base-300">
                    <input type="radio" name="create-course" />
                    <div className="collapse-title font-semibold">
                        <h2 className="text-xl font-bold">Examen</h2>
                    </div>
                    <div className="collapse-content text-sm">
                        <ExamForm questions={questions} setQuestions={setQuestions} />
                    </div>
                </div>
                <div className="flex justify-center gap-8 mt-5 mb-10">
                    <button type="button" className="btn btn-ghost" onClick={() => router.back()}>
                        Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary">
                        Crear curso
                    </button>
                </div>
            </form>

            {blocks.map((block) => (
                <dialog key={block.block_id} id={`modal-block-${block.block_id}`} className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">Editar bloque</h3>
                        <form onSubmit={handleEditBlock} className="space-y-4">
                            <input type="hidden" name="block_id" defaultValue={block.block_id} />
                            <fieldset className="fieldset">
                                <label className="fieldset-label text-sm">
                                    <span className="label-text">Título del bloque:</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full focus:outline-none focus:border-primary"
                                    name="block_title"
                                    defaultValue={block.block_title}
                                    required
                                />
                            </fieldset>
                            <fieldset className="fieldset">
                                <label className="fieldset-label text-sm">
                                    <span className="label-text">Descripción del bloque:</span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered w-full focus:outline-none focus:border-primary"
                                    name="block_description"
                                    defaultValue={block.block_description}
                                    required
                                />
                            </fieldset>
                            <div className="modal-action">
                                <button
                                    type="button"
                                    className="btn btn-ghost"
                                    onClick={() =>
                                        document
                                            .getElementById(`modal-block-${block.block_id}`)
                                            .close()
                                    }
                                >
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </dialog>
            ))}

            {blocks
                .flatMap((block) => block.lessons)
                .map((lesson) => (
                    <dialog
                        key={lesson.lesson_id}
                        id={`modal-lesson-${lesson.lesson_id}`}
                        className="modal"
                    >
                        <div className="modal-box">
                            <h3 className="font-bold text-lg mb-4">Editar lección</h3>
                            <form onSubmit={handleEditLesson} className="space-y-4">
                                <input
                                    type="hidden"
                                    name="lesson_id"
                                    defaultValue={lesson.lesson_id}
                                />
                                <fieldset className="fieldset">
                                    <label className="fieldset-label text-sm">
                                        <span className="label-text">Título de la lección:</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full focus:outline-none focus:border-primary"
                                        name="lesson_title"
                                        defaultValue={lesson.lesson_title}
                                        required
                                    />
                                </fieldset>
                                <fieldset className="fieldset">
                                    <label className="fieldset-label text-sm">
                                        <span className="label-text">
                                            Descripción de la lección:
                                        </span>
                                    </label>
                                    <MDEditor
                                        className="w-full"
                                        value={
                                            lessonDescriptions[lesson.lesson_id] ||
                                            lesson.lesson_description
                                        }
                                        onChange={(value) =>
                                            handleDescriptionChange(lesson.lesson_id, value)
                                        }
                                        required
                                    />
                                </fieldset>
                                <fieldset className="fieldset">
                                    <label className="fieldset-label text-sm">
                                        <span className="label-text">URL del video:</span>
                                    </label>
                                    <input
                                        type="url"
                                        className="input input-bordered w-full focus:outline-none focus:border-primary"
                                        name="lesson_video"
                                        defaultValue={lesson.lesson_video}
                                        required
                                    />
                                </fieldset>
                                <fieldset className="fieldset">
                                    <label className="fieldset-label text-sm">
                                        <span className="label-text">URL de la imagen:</span>
                                    </label>
                                    <input
                                        type="url"
                                        className="input input-bordered w-full focus:outline-none focus:border-primary"
                                        name="lesson_image"
                                        defaultValue={lesson.lesson_image}
                                        required
                                    />
                                </fieldset>
                                <fieldset className="fieldset">
                                    <label className="fieldset-label text-sm">
                                        <span className="label-text">Duración (HH:MM:SS):</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full focus:outline-none focus:border-primary"
                                        name="lesson_duration"
                                        defaultValue={lesson.lesson_duration}
                                        pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$"
                                        placeholder="00:00:00"
                                        required
                                    />
                                </fieldset>
                                <div className="modal-action">
                                    <button
                                        type="button"
                                        className="btn btn-ghost"
                                        onClick={() =>
                                            document
                                                .getElementById(`modal-lesson-${lesson.lesson_id}`)
                                                .close()
                                        }
                                    >
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Guardar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </dialog>
                ))}
        </>
    );
}

function CourseForm() {
    return (
        <>
            <fieldset className="fieldset">
                <label className="fieldset-label text-sm after:content-['*'] after:text-red-500 after:ml-0.5">
                    <span className="label-text">Nombre del curso:</span>
                </label>
                <input
                    type="text"
                    className="input input-bordered w-full focus:outline-none focus:border-primary"
                    name="course_name"
                    required
                />
            </fieldset>

            <fieldset className="fieldset">
                <label className="fieldset-label text-sm after:content-['*'] after:text-red-500 after:ml-0.5">
                    <span className="label-text">Descripción:</span>
                </label>
                <textarea
                    className="textarea textarea-bordered h-30 w-full resize-none focus:outline-none focus:border-primary"
                    name="course_description"
                    required
                />
            </fieldset>

            <fieldset className="fieldset">
                <label className="fieldset-label text-sm after:content-['*'] after:text-red-500 after:ml-0.5">
                    <span className="label-text">Dificultad:</span>
                </label>
                <select
                    name="course_difficulty"
                    className="select select-bordered w-full focus:outline-none focus:border-primary"
                    required
                >
                    <option value="" disabled>
                        Selecciona una dificultad
                    </option>
                    <option value="básico">Básico</option>
                    <option value="intermedio">Intermedio</option>
                    <option value="avanzado">Avanzado</option>
                </select>
            </fieldset>

            <fieldset className="fieldset">
                <label className="fieldset-label text-sm after:content-['*'] after:text-red-500 after:ml-0.5">
                    <span className="label-text">Imagen del curso (URL)</span>
                </label>
                <input
                    type="url"
                    className="input input-bordered w-full focus:outline-none focus:border-primary"
                    name="course_image"
                    required
                />
            </fieldset>

            <fieldset className="fieldset">
                <label className="fieldset-label text-sm after:content-['*'] after:text-red-500 after:ml-0.5">
                    <span className="label-text">Categoría</span>
                </label>
                <select
                    className="select select-bordered w-full focus:outline-none focus:border-primary"
                    name="category_id"
                    required
                >
                    <option value="" disabled>
                        Selecciona una categoría
                    </option>
                    {[
                        { id: 1, name: "Programación Web" },
                        { id: 2, name: "Diseño Gráfico" },
                    ].map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </fieldset>
        </>
    );
}

function ContentForm({ blocks, setBlocks }) {
    const organizeBlocks = (blocks) => {
        const lessonsList = blocks.flatMap((block) => block.lessons);
        const sortedLessons = lessonsList.map((lesson, index) => ({
            ...lesson,
            lesson_order: index + 1,
        }));

        const updatedBlocks = blocks.map((block) => ({
            ...block,
            lessons: sortedLessons.filter((lesson) => lesson.block_id === block.block_id),
        }));

        const sortedBlocks = updatedBlocks.map((block, index) => ({
            ...block,
            block_order: index + 1,
        }));

        return sortedBlocks;
    };

    const handleDragEnd = (result) => {
        const { source, destination, draggableId, type } = result;

        if (!destination) return;

        if (type === "BLOCKS") {
            const newBlocks = [...blocks];
            const [removed] = newBlocks.splice(source.index - 1, 1);
            newBlocks.splice(destination.index - 1, 0, removed);

            const updatedBlocks = newBlocks.map((block, index) => ({
                ...block,
                block_order: index + 1,
            }));

            const lessonsList = updatedBlocks.flatMap((block) => block.lessons);
            const sortedLessonsList = lessonsList.map((lesson, index) => ({
                ...lesson,
                lesson_order: index + 1,
            }));

            const sortedBlocks = updatedBlocks.map((block) => ({
                ...block,
                lessons: sortedLessonsList.filter((lesson) => lesson.block_id === block.block_id),
            }));

            setBlocks(sortedBlocks);
        }

        if (type === "LESSONS") {
            const lessonsList = blocks.flatMap((block) => block.lessons);
            const [removed] = lessonsList.splice(source.index - 1, 1);
            lessonsList.splice(destination.index - 1, 0, removed);

            const orderedLessons = lessonsList.map((lesson, index) => ({
                ...lesson,
                lesson_order: index + 1,
            }));

            const updatedLessons = orderedLessons.map((lesson) => {
                if (lesson.lesson_id === removed.lesson_id) {
                    return {
                        ...lesson,
                        block_id: destination.droppableId.replace("block-", ""),
                    };
                }
                return lesson;
            });

            const updatedBlocks = blocks.map((block) => ({
                ...block,
                lessons: updatedLessons.filter((lesson) => lesson.block_id === block.block_id),
            }));

            setBlocks(updatedBlocks);
        }
    };

    const handleAddBlock = () => {
        const newBlock = {
            block_id: crypto.randomUUID(),
            block_title: "Nuevo bloque",
            block_description: "Descripción del bloque",
            block_order: blocks.length + 1,
            lessons: [],
        };
        setBlocks([...blocks, newBlock]);
    };

    const handleAddLesson = (blockId) => {
        const newLesson = {
            lesson_id: crypto.randomUUID(),
            block_id: blockId,
            lesson_title: "Nueva lección",
            lesson_description: "Descripción de la lección",
            lesson_video: "https://www.youtube.com/watch?v=",
            lesson_image: "https://img.youtube.com/vi/id/0.jpg",
            lesson_duration: "00:00:00",
            lesson_order: 0,
        };

        const updatedBlocks = blocks.map((block) => {
            if (block.block_id === blockId) {
                return {
                    ...block,
                    lessons: [...block.lessons, newLesson],
                };
            }
            return block;
        });

        const lessonsList = updatedBlocks.flatMap((block) => block.lessons);
        const sortedLessonsList = lessonsList.map((lesson, index) => ({
            ...lesson,
            lesson_order: index + 1,
        }));

        const sortedBlocks = updatedBlocks.map((block) => ({
            ...block,
            lessons: sortedLessonsList.filter((lesson) => lesson.block_id === block.block_id),
        }));

        setBlocks(sortedBlocks);
    };

    const handleDeleteBlock = (blockId) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "No podrás revertir esto.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            background: "var(--color-base-100)",
            color: "var(--color-base-content)",
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedBlocks = blocks.filter((block) => block.block_id !== blockId);
                const sortedBlocks = organizeBlocks(updatedBlocks);
                setBlocks(sortedBlocks);
            }
        });
    };

    const handleDeleteLesson = (lessonId) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "No podrás revertir esto.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            background: "var(--color-base-100)",
            color: "var(--color-base-content)",
        }).then((result) => {
            if (result.isConfirmed) {
                const lessonsList = blocks
                    .flatMap((block) => block.lessons)
                    .filter((lesson) => lesson.lesson_id !== lessonId);
                const updatedBlocks = blocks.map((block) => ({
                    ...block,
                    lessons: lessonsList.filter((lesson) => lesson.block_id === block.block_id),
                }));
                const sortedBlocks = organizeBlocks(updatedBlocks);
                setBlocks(sortedBlocks);
            }
        });
    };

    return (
        <>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable
                    droppableId="blocks"
                    type="BLOCKS"
                    isDropDisabled={false}
                    isCombineEnabled={false}
                    ignoreContainerClipping={false}
                    direction="vertical"
                >
                    {(provided) => (
                        <div
                            className="flex flex-col gap-4"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {blocks.map((block) => (
                                <Draggable
                                    key={block.block_id}
                                    draggableId={block.block_id.toString()}
                                    index={block.block_order}
                                >
                                    {(provided) => (
                                        <div
                                            className="bg-base-200/60 p-4 rounded-lg space-y-5"
                                            {...provided.draggableProps}
                                            ref={provided.innerRef}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="btn btn-sm btn-ghost cursor-grab active:cursor-grabbing"
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <DraggableIcon />
                                                    </div>
                                                    <h2 className="text-lg font-semibold">
                                                        {block.block_title}
                                                    </h2>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-ghost"
                                                        onClick={() =>
                                                            document
                                                                .getElementById(
                                                                    `modal-block-${block.block_id}`
                                                                )
                                                                .showModal()
                                                        }
                                                    >
                                                        <PencilIcon />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-ghost"
                                                        onClick={() =>
                                                            handleDeleteBlock(block.block_id)
                                                        }
                                                    >
                                                        <TrashIcon />
                                                    </button>
                                                </div>
                                            </div>
                                            <Droppable
                                                droppableId={`block-${block.block_id}`}
                                                type="LESSONS"
                                                isDropDisabled={false}
                                                isCombineEnabled={false}
                                                ignoreContainerClipping={false}
                                                direction="vertical"
                                            >
                                                {(provided) => (
                                                    <div
                                                        className="space-y-2"
                                                        {...provided.droppableProps}
                                                        ref={provided.innerRef}
                                                    >
                                                        {block.lessons.map((lesson) => (
                                                            <Draggable
                                                                key={lesson.lesson_id}
                                                                draggableId={lesson.lesson_id.toString()}
                                                                index={lesson.lesson_order}
                                                            >
                                                                {(provided) => (
                                                                    <div
                                                                        {...provided.draggableProps}
                                                                        ref={provided.innerRef}
                                                                        id={`lesson-${lesson.lesson_id}`}
                                                                        className="bg-base-100 p-3 rounded flex items-center justify-between"
                                                                    >
                                                                        <div className="flex items-center gap-2">
                                                                            <div
                                                                                className="btn btn-sm btn-ghost cursor-grab active:cursor-grabbing"
                                                                                {...provided.dragHandleProps}
                                                                            >
                                                                                <DraggableIcon />
                                                                            </div>
                                                                            <span>
                                                                                {
                                                                                    lesson.lesson_title
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex gap-2">
                                                                            <button
                                                                                type="button"
                                                                                className="btn btn-xs btn-ghost"
                                                                                onClick={() =>
                                                                                    document
                                                                                        .getElementById(
                                                                                            `modal-lesson-${lesson.lesson_id}`
                                                                                        )
                                                                                        .showModal()
                                                                                }
                                                                            >
                                                                                <PencilIcon />
                                                                            </button>
                                                                            <button
                                                                                type="button"
                                                                                className="btn btn-xs btn-ghost"
                                                                                onClick={() =>
                                                                                    handleDeleteLesson(
                                                                                        lesson.lesson_id
                                                                                    )
                                                                                }
                                                                            >
                                                                                <TrashIcon />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-ghost w-full"
                                                            onClick={() =>
                                                                handleAddLesson(block.block_id)
                                                            }
                                                        >
                                                            <PlusIcon />
                                                            <span>Agregar lección</span>
                                                        </button>
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            <button
                                type="button"
                                className="btn btn-sm btn-ghost w-full"
                                onClick={handleAddBlock}
                            >
                                <PlusIcon />
                                <span>Agregar bloque</span>
                            </button>
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </>
    );
}

function ExamForm({ questions, setQuestions }) {
    const handleSetCorrectAnswer = (answerId, questionId) => {
        const question = questions.find((question) => question.question_id === questionId);
        const updatedAnswers = question.answers.map((answer) => ({
            ...answer,
            is_correct: answer.answer_id === answerId,
        }));
        const updatedQuestions = questions.map((question) =>
            question.question_id === questionId
                ? { ...question, answers: updatedAnswers }
                : question
        );
        setQuestions(updatedQuestions);
    };

    const handleChangeQuestionText = (questionId, text) => {
        const updatedQuestions = questions.map((question) =>
            question.question_id === questionId ? { ...question, question_text: text } : question
        );
        setQuestions(updatedQuestions);
    };

    const handleAddQuestion = () => {
        const newQuestion = {
            question_id: crypto.randomUUID(),
            question_text: "Nueva pregunta",
            answers: [],
        };

        setQuestions([...questions, newQuestion]);
    };

    const handleChangeAnswerText = (answerId, text) => {
        const updatedQuestions = questions.map((question) => ({
            ...question,
            answers: question.answers.map((answer) =>
                answer.answer_id === answerId ? { ...answer, answer_text: text } : answer
            ),
        }));
        setQuestions(updatedQuestions);
    };

    const handleDeleteAnswer = (answerId) => {
        const updatedQuestions = questions.map((question) => ({
            ...question,
            answers: question.answers.filter((answer) => answer.answer_id !== answerId),
        }));
        setQuestions(updatedQuestions);
    };

    const handleAddAnswer = (questionId) => {
        const newAnswer = {
            answer_id: crypto.randomUUID(),
            answer_text: "Nueva respuesta",
            is_correct: false,
            question_id: questionId,
        };

        const updatedQuestions = questions.map((question) =>
            question.question_id === questionId
                ? { ...question, answers: [...question.answers, newAnswer] }
                : question
        );
        setQuestions(updatedQuestions);
    };

    return (
        <>
            <div className="space-y-10">
                <div className="space-y-2">
                    <div className="fieldset">
                        <label className="fieldset-label text-sm after:content-['*'] after:text-red-500 after:ml-0.5">
                            <span className="label-text">Título del examen:</span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered w-full focus:outline-none focus:border-primary"
                            name="exam_title"
                            required
                        />
                    </div>
                    <div className="fieldset">
                        <label className="fieldset-label text-sm after:content-['*'] after:text-red-500 after:ml-0.5">
                            <span className="label-text">Descripción del examen:</span>
                        </label>
                        <textarea
                            className="textarea textarea-bordered w-full focus:outline-none focus:border-primary"
                            name="exam_description"
                            required
                        />
                    </div>
                </div>
                <div className="space-y-4">
                    {questions.map((question, index) => (
                        <div key={question.question_id} className="space-y-3">
                            <h3 className="text-lg font-semibold">Pregunta {index + 1}:</h3>
                            <div className="fieldset">
                                <input
                                    type="text"
                                    className="input input-bordered w-full focus:outline-none focus:border-primary"
                                    name="question_text"
                                    defaultValue={question.question_text}
                                    onChange={(e) =>
                                        handleChangeQuestionText(
                                            question.question_id,
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                {question.answers.map((answer) => (
                                    <div
                                        key={answer.answer_id}
                                        className="border border-base-300 bg-base-200 flex"
                                    >
                                        <span className="flex-1 p-5">{answer.answer_text}</span>
                                        <div className="flex">
                                            <button
                                                type="button"
                                                className={`h-full p-5 ${
                                                    answer.is_correct ? "bg-primary" : ""
                                                } hover:bg-base-300 cursor-pointer`}
                                                onClick={() =>
                                                    handleSetCorrectAnswer(
                                                        answer.answer_id,
                                                        answer.question_id
                                                    )
                                                }
                                            >
                                                <CheckIcon />
                                            </button>
                                            <button
                                                type="button"
                                                className="h-full p-5 hover:bg-base-300 cursor-pointer"
                                            >
                                                <CloseIcon />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="w-full text-right ">
                                <span
                                    onClick={() =>
                                        document
                                            .getElementById(
                                                `modal-question-${question.question_id}`
                                            )
                                            .showModal()
                                    }
                                    className="btn btn-sm btn-ghost"
                                >
                                    Editar respuestas
                                </span>
                            </p>
                        </div>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="btn btn-ghost w-full shadow-none"
                >
                    <PlusIcon />
                    <span>Agregar pregunta</span>
                </button>
            </div>
            {questions.map((question) => (
                <dialog
                    key={question.question_id}
                    id={`modal-question-${question.question_id}`}
                    className="modal"
                >
                    <div className="modal-box w-full max-w-2xl">
                        <h3 className="font-bold text-lg mb-4">Editar respuestas</h3>
                        <div className="space-y-4">
                            {question.answers.map((answer) => (
                                <div key={answer.answer_id} className="flex gap-2">
                                    <input
                                        type="text"
                                        className="input input-bordered flex-1"
                                        value={answer.answer_text}
                                        onChange={(e) =>
                                            handleChangeAnswerText(answer.answer_id, e.target.value)
                                        }
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-ghost btn-square"
                                        onClick={() => handleDeleteAnswer(answer.answer_id)}
                                    >
                                        <TrashIcon />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                className="btn btn-ghost w-full shadow-none"
                                onClick={() => handleAddAnswer(question.question_id)}
                            >
                                <PlusIcon />
                                <span>Agregar respuesta</span>
                            </button>
                        </div>
                    </div>
                    <fieldset role="form" method="dialog" className="modal-backdrop">
                        <button
                            type="button"
                            onClick={() =>
                                document
                                    .getElementById(`modal-question-${question.question_id}`)
                                    .close()
                            }
                        >
                            close
                        </button>
                    </fieldset>
                </dialog>
            ))}
        </>
    );
}
