"use client";

import { useEffect, useState } from "react";

export default function PdfViewer({ id }) {
    const [images, setImages] = useState([]);
    const url = process.env.NEXT_PUBLIC_APP_DOMAIN + "/certificates/certificate-" + id + ".pdf";

    useEffect(() => {
        const renderPDF = async () => {
            const pdfjsLib = await import("pdfjs-dist");
            const pdfjsWorker = await import("pdfjs-dist/build/pdf");

            pdfjsWorker.GlobalWorkerOptions.workerSrc = "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

            const loadingTask = pdfjsLib.getDocument(url);
            const pdf = await loadingTask.promise;
            const pages = [];

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 1.5 });

                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");
                canvas.width = viewport.width;
                canvas.height = viewport.height;

                await page.render({ canvasContext: context, viewport }).promise;

                const imageUrl = canvas.toDataURL();
                pages.push(imageUrl);
            }

            setImages(pages);
        };

        renderPDF();
    }, [url]);

    return (
        <div className="w-full space-y-4">
            {images.length === 0 ? (
                <p className="text-gray-500 text-sm">Cargando PDF...</p>
            ) : (
                images.map((src, idx) => (
                    <img
                        key={idx}
                        src={src}
                        alt={`Página ${idx + 1}`}
                        className="w-full rounded shadow-lg"
                    />
                ))
            )}
        </div>
    );
}
