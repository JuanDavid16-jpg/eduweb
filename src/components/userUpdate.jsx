import React from "react";

// Hooks
import { usePutData } from "@/hooks/useFetch";
import { useValidateForm } from "@/hooks/useValidateForm";

export default function UserUpdate({ user, update }) {
    const updateUser = async (e) => {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(e.target));
        const validation = useValidateForm("update-user-form", data);
        if (!validation.success) return;

        const response = await usePutData("/users/" + user.user_id, { user: data });

        if (response.success) {
            update();
            document.querySelector("#edit-modal-" + user.user_id).close();
        }
    };

    return (
        <dialog id={`edit-modal-${user.user_id}`} className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Editar perfil</h3>
                <p className="py-4 text-sm text-base-content/70">
                    Edita la información de tu perfil. Los cambios se verán reflejados en tu perfil.
                </p>
                <form onSubmit={updateUser}>
                    <fieldset className="fieldset">
                        <label className="fieldset-label text-sm after:content-['*'] after:text-red-500 font-medium">
                            Nombres:
                        </label>
                        <input
                            className="input focus:outline-none focus:border-primary w-full"
                            placeholder="Ingresa tus nombres"
                            name="user_name"
                            defaultValue={user.user_name}
                        />
                    </fieldset>
                    <fieldset className="fieldset">
                        <label className="fieldset-label text-sm after:content-['*'] after:text-red-500 font-medium">
                            Apellidos:
                        </label>
                        <input
                            className="input focus:outline-none focus:border-primary w-full"
                            placeholder="Ingresa tus apellidos"
                            name="user_lastname"
                            defaultValue={user.user_lastname}
                        />
                    </fieldset>
                    <fieldset className="fieldset">
                        <label className="fieldset-label text-sm font-medium">Profesion:</label>
                        <input
                            className="input focus:outline-none focus:border-primary w-full"
                            placeholder="Ingresa tu profesión"
                            name="user_profession"
                            defaultValue={user.user_profession}
                        />
                    </fieldset>
                    <fieldset className="fieldset">
                        <label className="fieldset-label text-sm font-medium">Sitio web:</label>
                        <input
                            className="input focus:outline-none focus:border-primary w-full"
                            placeholder="Ingresa tu sitio web"
                            name="user_website"
                            defaultValue={user.user_website}
                        />
                    </fieldset>
                    <fieldset className="fieldset">
                        <label className="fieldset-label text-sm after:content-['*'] after:text-red-500 font-medium">
                            Email:
                        </label>
                        <input
                            className="input focus:outline-none focus:border-primary w-full"
                            placeholder="Ingresa tu email"
                            name="user_email"
                            defaultValue={user.user_email}
                        />
                    </fieldset>
                    <fieldset className="fieldset">
                        <label className="fieldset-label text-sm font-medium">Telefono:</label>
                        <input
                            className="input focus:outline-none focus:border-primary w-full"
                            placeholder="Ingresa tu telefono"
                            name="user_phone"
                            defaultValue={user.user_phone}
                        />
                    </fieldset>
                    <fieldset className="fieldset">
                        <label className="fieldset-label text-sm after:content-['*'] after:text-red-500 font-medium">
                            Url imagen de perfil:
                        </label>
                        <input
                            className="input focus:outline-none focus:border-primary w-full"
                            placeholder="Ingresa tu contrasena"
                            name="user_image"
                            defaultValue={user.user_image}
                        />
                    </fieldset>
                    <button className="btn btn-primary mt-5">Guardar</button>
                </form>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    );
}
