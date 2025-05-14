"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

// Hooks
import { useDeleteData, useGetData } from "@/hooks/useFetch";

// Components
import LoadingComponent from "@/components/loading";
import UserUpdate from "@/components/userUpdate";

export default function AdminUsersPage() {
    const router = useRouter();
    const { data, status } = useSession();
    const userSession = data?.user;
    const limit = 2;

    const [page, setPage] = useState(1);

    useEffect(() => {
        document.title = "Administración de Usuarios | Eduweb";

        if (status === "unauthenticated") {
            router.push("/api/auth/signin");
        } else if (status === "authenticated" && userSession.role_id !== 3) {
            router.push("/");
        }
    }, [userSession, status, router]);

    const {
        data: users,
        loading: usersLoading,
        total: totalUsers,
        reload: reloadUsers,
    } = useGetData(`/users?page=${page}&limit=${limit}`);

    const handleDelete = async (userId) => {
        if (userId === userSession.user_id) {
            Swal.fire({
                title: "Error",
                text: "No puedes eliminar tu propio usuario",
                icon: "error",
                background: "var(--color-base-100)",
                color: "var(--color-base-content)",
            });
            return;
        }

        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            background: "var(--color-base-100)",
            color: "var(--color-base-content)",
        });

        if (result.isConfirmed) {
            const response = await useDeleteData(`/users/${userId}`);
            if (response.success) {
                reloadUsers();
            }
        }
    };

    if (usersLoading) return <LoadingComponent />;

    return (
        <>
            <section className="w-full px-3">
                <div className="w-full max-w-[1200px] mx-auto py-10 space-y-8">
                    <div className="bg-black/25 w-full p-5 rounded-lg">
                        <h1 className="text-3xl font-bold">Administración de Usuarios</h1>
                    </div>
                    <div className="overflow-x-auto rounded bg-base-100 border border-white/20">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Rol</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.user_id}>
                                        <td>{user.user_id.split("-")[1]}</td>
                                        <td>
                                            {user.user_name} {user.user_lastname}
                                        </td>
                                        <td>{user.user_email}</td>
                                        <td className="capitalize">{user.role.role_name}</td>
                                        <td>
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    onClick={() =>
                                                        document
                                                            .querySelector(
                                                                `#edit-modal-${user.user_id}`
                                                            )
                                                            .showModal()
                                                    }
                                                    className="btn btn-sm btn-primary shadow-none"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.user_id)}
                                                    className="btn btn-sm btn-error shadow-none"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex items-center justify-between bg-black/25 p-5 rounded-lg">
                        <p>
                            {page * limit - limit + 1}-{Math.min(page * limit, totalUsers)} de{" "}
                            {totalUsers} usuarios
                        </p>
                        <div className="join">
                            <button
                                className="join-item btn shadow-none"
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                            >
                                «
                            </button>
                            {Array.from(
                                { length: Math.ceil(totalUsers / limit) },
                                (_, i) => i + 1
                            ).map((bpage) => (
                                <button
                                    key={bpage}
                                    className={`join-item btn shadow-none ${
                                        bpage === page ? "btn-neutral" : ""
                                    }`}
                                    onClick={() => setPage(bpage)}
                                >
                                    {bpage}
                                </button>
                            ))}
                            <button
                                className="join-item btn shadow-none"
                                onClick={() => setPage(page + 1)}
                                disabled={page === Math.ceil(totalUsers / limit)}
                            >
                                »
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            {users.map((user) => (
                <UserUpdate key={user.user_id} user={user} update={reloadUsers} />
            ))}
        </>
    );
}
