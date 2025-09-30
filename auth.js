import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import NextAuth from "next-auth";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
	pages: {
		signIn: "/register",
		error: "/login",
	},
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60, // 30 days
		updateAge: 24 * 60 * 60, // 24 hours
	},
	adapter: PrismaAdapter(prisma),
	providers: [
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials) return null;

				//find user from db
				const user = await prisma.user.findUnique({
					where: { email: credentials.email },
				});

				//check if user exist and matched password
				if (user && user.password) {
					const isMatch = bcrypt.compareSync(
						credentials.password,
						user.password
					); //retuen boolean
					if (isMatch) {
						return {
							id: user.id,
							name: user.name,
							email: user.email,
							role: user.role,
						};
					}
				}
				throw new Error("Invalid email or password"); //if user does not exist
			},
		}),
	],
	callbacks: {
		async signIn({ account, profile }) {
			if (account.provider === "google") {
				return profile.email_verified ?? false;
			}
			return true;
		},

		async authorized({ request, auth }) {
			//check session cart cookie
			if (!request.cookies.get("sessionCartId")) {
				const sessionCartId = crypto.randomUUID();

				//clone header
				const newRequestHeader = new Headers(request.headers);

				//create new response and add new headers
				const response = NextResponse.next({
					request: {
						headers: newRequestHeader,
					},
				});
				response.cookies.set("sessionCartId", sessionCartId);
				return response;
			} else {
				return true;
			}
		},

		async session({ session, user, trigger, token }) {
			session.user.id = token.sub;
			session.user.role = token.role;
			session.user.name = token.name;

			if (trigger === "update") {
				session.user.name = user.name;
			}
			return session;
		},

		async jwt({ session, user, trigger, token }) {
			// check if user is authenticated?
			if (user) {
				token.id = user.id,
				token.role = user.role,
				token.name = user.name !== "NO_NAME" ? user.name : user.email.split("@")[0];
			}

			//handle cart assignment on sign in or sign up (ill have session id)
			if (trigger === "signIn" || trigger === "signUp") {
				const cookieObjext = await cookies();
				const sessionCartId = cookieObjext.get("sessionCartId")?.value;
				if (sessionCartId) {
					// try to get the sessionCartId from cart table in db
					const sessionCart = await prisma.cart.findFirst({
						where: { sessionCartId },
						select: { id: true},
					});
					// then update userId of that sessionCartId
					if (sessionCart) {
						await prisma.cart.update({
							where:{ id: sessionCart.id },
							data: { userId: user.id}
						});
					}
				}
			};

			// handle session update in case user update their name
			if (session?.user?.name && trigger === "update") {
				token.name = session.user.name;
			}
			return token; // return token(with updated info) after authenticating the user
		},
	},
});
