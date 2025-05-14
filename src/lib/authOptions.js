import bcrypt from "bcrypt";
import Credentials from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { User } from "@/database/models";

export const authOptions = {
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                user_email: {
                    label: "Correo electrónico",
                    type: "email",
                    placeholder: "ejemplo@gmail.com",
                },
                user_password: {
                    label: "Contraseña",
                    type: "password",
                    placeholder: "******",
                },
            },
            async authorize(credentials) {
                const { user_email, user_password } = credentials;

                const user = await User.findOne({
                    where: { user_email },
                });
                if (!user) throw new Error("El usuario no existe");

                const isPasswordValid = await bcrypt.compare(user_password, user.user_password);
                if (!isPasswordValid) throw new Error("La contraseña es incorrecta");

                return {
                    id: user.user_id,
                    email: user.user_email,
                    name: user.user_name + " " + user.user_lastname,
                };
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            if (account.provider === "google") {
                await User.findOrCreate({
                    where: { user_email: user.email },
                    defaults: {
                        user_name: profile.given_name,
                        user_lastname: profile.family_name,
                        user_email: user.email,
                        user_password: user.id,
                        user_image: profile.picture,
                        role_id: 1,
                    },
                });
            }
            return true;
        },
        async session({ session, token }) {
            const user = await User.findOne({
                where: { user_email: token.email },
                attributes: {
                    exclude: ["user_password"],
                },
                include: ["role"],
            });

            session.user = user.toJSON();
            session.user.id = token.id;

            return session;
        },
        redirect({ baseUrl }) {
            return baseUrl;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};
