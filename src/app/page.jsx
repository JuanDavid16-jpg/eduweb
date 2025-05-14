import Image from "next/image";
import Link from "next/link";

// Components
import {
    ArrowRight,
    CalendarIcon,
    CertificateIcon,
    ClockIcon,
    QuotesIcon,
    UserIcon,
} from "@/components/icons";

export const metadata = {
    title: "Inicio | EduWeb",
};

export default async function Home() {
    return (
        <div className="flex flex-col gap-[100px]">
            <section className="w-full px-3">
                <div className="w-full max-w-[1200px] mx-auto py-[100px]">
                    <div className="flex items-center">
                        <div className="w-full flex flex-col gap-5">
                            <div>
                                <h3 className="uppercase text-xl font-bold text-primary">EduWeb</h3>
                                <h1 className="text-5xl font-bold text-pretty">
                                    Impulsa tu conocimiento, transforma tu futuro
                                </h1>
                            </div>
                            <p className="text-base-content/80">
                                Accede a cursos de alta calidad y obtén certificados gratuitos que
                                avalen tu progreso. Aprende a tu ritmo, desarrolla nuevas
                                habilidades y prepárate para transformar tu futuro profesional con
                                contenidos actualizados y una comunidad de apoyo.
                            </p>
                            <Link href="/courses">
                                <button className="btn btn-primary shadow-none w-fit rounded-lg font-medium text-base">
                                    Explora nuestros cursos <ArrowRight />
                                </button>
                            </Link>
                        </div>
                        <div className="w-full items-center justify-end hidden lg:flex">
                            <Image
                                src={"/logo.png"}
                                width={350}
                                height={350}
                                alt="Hero image"
                                className="object-contain drop-shadow-[0_0_30px_var(--color-primary)]"
                            />
                        </div>
                    </div>
                </div>
            </section>
            <section className="w-full px-3">
                <div className="w-full max-w-[1200px] mx-auto py-10">
                    <div className="w-full text-center flex flex-col gap-10">
                        <h2 className="text-3xl font-extrabold">
                            ¿Por qué <span className="text-primary">aprender con EduWeb?</span>
                        </h2>
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-10">
                            <div className="flex flex-col gap-5 items-center w-full">
                                <UserIcon size={70} />
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-xl font-bold">Expertos en Latam</h3>
                                    <p className="text-sm text-pretty text-base-content/80">
                                        Tu equipo aprenderá de profesionales reconocidos de
                                        Latinoamérica y España.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-5 items-center w-full">
                                <ClockIcon size={70} />
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-xl font-bold">Expertos en Latam</h3>
                                    <p className="text-sm text-pretty text-base-content/80">
                                        Tu equipo aprenderá de profesionales reconocidos de
                                        Latinoamérica y España.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-5 items-center w-full">
                                <CalendarIcon size={70} />
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-xl font-bold">Expertos en Latam</h3>
                                    <p className="text-sm text-pretty text-base-content/80">
                                        Tu equipo aprenderá de profesionales reconocidos de
                                        Latinoamérica y España.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-5 items-center w-full">
                                <CertificateIcon size={70} />
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-xl font-bold">Expertos en Latam</h3>
                                    <p className="text-sm text-pretty text-base-content/80">
                                        Tu equipo aprenderá de profesionales reconocidos de
                                        Latinoamérica y España.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="w-full px-3">
                <div className="w-full max-w-[1200px] mx-auto py-10">
                    <div className="flex flex-col lg:flex-row items-center gap-10">
                        <div className="w-full flex flex-col gap-5">
                            <h2 className="text-5xl font-extrabold">
                                Obten un <br />
                                <span className="text-primary italic">Certificado oficial</span>
                                <br /> de EduWeb
                            </h2>
                            <p className="text-lg leading-tight  text-pretty text-base-content/80">
                                Demuestra tus habilidades con certificaciones reconocidas por la
                                industria a nivel internacional.
                            </p>
                        </div>
                        <div className="w-full flex items-center justify-center">
                            <Image
                                src={"/certificate.png"}
                                width={500}
                                height={500}
                                alt="Certificado"
                                className="object-contain rounded border-2 border-white"
                            />
                        </div>
                    </div>
                </div>
            </section>
            <section className="w-full px-3">
                <div className="w-full max-w-[1200px] mx-auto py-10">
                    <div className="flex flex-col gap-9">
                        <h2 className="text-3xl font-extrabold text-center">
                            Mira lo que están haciendo nuestros estudiantes
                        </h2>
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-10">
                            {[
                                {
                                    id: 1,
                                    name: "Alvin Lim",
                                    role: "Cofundador técnico y director de tecnología en Dimensional",
                                    img: "https://cms-images.udemycdn.com/96883mtakkm8/1Djz6c0gZLaCG5SQS3PgUY/54b6fb8c85d8da01da95cbb94fa6335f/Alvin_Lim.jpeg",
                                    testimonial:
                                        "EduWeb marcó un antes y un despues en mi vida y me fue de gran ayuda a la hora de hacer realidad la idea de Dimensional.",
                                },
                                {
                                    id: 2,
                                    name: "William A. Wachlin",
                                    role: "Gestor de cuentas de socios en Amazon Web Services",
                                    img: "https://cms-images.udemycdn.com/96883mtakkm8/6dT7xusLHYoOUizXeVqgUk/4317f63fe25b2e07ad8c70cda641014b/William_A_Wachlin.jpeg",
                                    testimonial:
                                        "EduWeb te da la posibilidad de ser constante. Aprendí exactamente lo que necesitaba saber en el mundo real. Me ayudó a venderme mejor para conseguir un nuevo puesto.",
                                },
                                {
                                    id: 3,
                                    name: "Ian Stevens",
                                    role: "Head of Capability Development, North America at Publicis Sapient",
                                    img: "https://cms-images.udemycdn.com/96883mtakkm8/4w9dYD4F64ibQwsaAB01Z4/c4610e9b1ac65589d8b1374ad10714e2/Ian_Stevens.png",
                                    testimonial:
                                        "Con EduWeb, los empleados pudieron adquirir tanto conocimientos tecnológicos como capacidades sociales de consultores... para que les ayudasen a avanzar en sus carreras profesionales.",
                                },
                            ].map((tes) => (
                                <div
                                    key={tes.id}
                                    className="bg-base-content/20 p-8 rounded-lg flex flex-col gap-5"
                                >
                                    <QuotesIcon size={40} />
                                    <p className="text-sm italic grow">{tes.testimonial}</p>
                                    <div className="flex items-center gap-3 ">
                                        <div className="avatar">
                                            <div className="w-15 h-fit aspect-square rounded-full">
                                                <img src={tes.img} alt="Imagen testimonio" />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1 text-sm">
                                            <p className="font-semibold">{tes.name}</p>
                                            <p className="text-base-content/70">{tes.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
