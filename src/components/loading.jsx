import React from "react";

export default function LoadingComponent() {
    return (
        <>
            <section className="w-full px-3">
                <div className="w-full max-w-[1200px] mx-auto py-10">
                    <div className="w-full flex flex-col items-center justify-center text-center">
                        <span className="loading loading-ring w-50"></span>
                        <h2 className="text-5xl font-bold tracking-tight">
                            Cargando...
                        </h2>
                    </div>
                </div>
            </section>
        </>
    );
}
