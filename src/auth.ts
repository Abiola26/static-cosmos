import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { AuthResponseDto, ApiResponse } from "@/types";

// Custom error class so we can surface the real backend message.
// In NextAuth v5, throwing a plain Error inside authorize() wraps it
// as a "Configuration" error on the client side. Using CredentialsSignin
// and storing the message in `code` is the safe, supported approach.
class LoginError extends CredentialsSignin {
    constructor(message: string) {
        super(message);
        this.code = message;
    }
}

// Server-side URL uses HTTP to avoid self-signed certificate rejection by Node.js
const INTERNAL_API_URL = process.env.INTERNAL_API_URL ?? "http://127.0.0.1:5085/api";

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                try {
                    const res = await fetch(`${INTERNAL_API_URL}/auth/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: (credentials as any).email.trim(),
                            password: (credentials as any).password,
                        }),
                    });

                    const json: ApiResponse<AuthResponseDto> = await res.json();

                    if (!res.ok || !json.success || !json.data) {
                        const msg = json.message || "Invalid credentials";
                        throw new LoginError(msg);
                    }

                    const data = json.data;
                    return {
                        id: data.userId,
                        name: data.fullName,
                        email: data.email,
                        role: data.role,
                        token: data.token,
                    };
                } catch (error: any) {
                    // Re-throw LoginError as-is; wrap anything else.
                    if (error instanceof LoginError) throw error;
                    console.error("Auth error detail:", error.message ?? error);
                    throw new LoginError(error.message ?? "An error occurred during login");
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.role = user.role;
                token.accessToken = user.token;
            }
            return token;
        },
        async session({ session, token }: any) {
            if (token) {
                session.user.role = token.role;
                session.accessToken = token.accessToken;
            }
            return session;
        },
    },
    pages: {
        signIn: "/auth/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
});
