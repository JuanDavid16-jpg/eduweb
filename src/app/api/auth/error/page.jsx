import Link from "next/link";
import React from "react";

export default async function Page({ searchParams }) {
    const { error } = await searchParams;

    return (
        <div className="w-full h-screen flex justify-center items-center bg-black/50">
            <div className="bg-white px-9 py-7 rounded-lg text-primary-content">
                <div className="max-w-md text-center">
                    <h1 className="text-5xl font-bold">Hubo un error</h1>
                    <div className="text-lg py-6">
                        <p className="text-red-500/80 text-xl font-medium tracking-tight">{error}</p>
                        <p>Por favor, vuelve a iniciar sesión.</p>
                    </div>

                    <Link href="/login">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Iniciar sesión</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
