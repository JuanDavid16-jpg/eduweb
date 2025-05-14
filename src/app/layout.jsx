"use client";

import { SessionProvider } from "next-auth/react";
import { Alegreya_Sans } from "next/font/google";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";

// Components
import Header from "@/layouts/header.jsx";
import Footer from "@/layouts/footer.jsx";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const alegreya = Alegreya_Sans({ subsets: ["latin"], weight: "700" });

export default function RootLayout({ children }) {
    const pathname = usePathname();
    const excludedRoutes = ["/login", "/register", "/api/auth/error", "/api-docs"];

    return (
        <html lang="es">
            <body className="antialiased font-inter">
                <SessionProvider>
                    <div id="root" className="flex flex-col min-h-screen">
                        {excludedRoutes.includes(pathname) ? (
                            <main className="flex-1 flex flex-col">{children}</main>
                        ) : (
                            <>
                                <Header />
                                <main className="flex-1 flex flex-col">{children}</main>
                                <Footer />
                            </>
                        )}
                    </div>
                </SessionProvider>
                <div>
                    <div className="bg-primary left-10 right-10 h-[600px] rounded-[50%] blur-[200px] fixed top-[-45%] transform -translate-y-1/2 z-[-2]"></div>
                    <div className="bg-black left-[-400px] right-[-400px] h-[150px] blur-[200px] fixed bottom-[-100px] z-[-1]"></div>
                </div>
            </body>
        </html>
    );
}
