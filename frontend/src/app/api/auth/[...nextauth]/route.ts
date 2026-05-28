import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: credentials?.username,
              password: credentials?.password,
            }),
          });

          const user = await res.json();

          if (res.ok && user) {
            return {
              id: user.id?.toString() || "0",
              name: user.nama,
              role: user.role,
              token: user.token, 
            };
          }
          throw new Error(user.message || "Username atau Password salah");
        } catch (error: any) {
          throw new Error(error.message);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.token; 
      }
      return token;
    },
    async session({ session, token }) {
      // Menyisipkan token ke dalam sesi
      session.accessToken = token.accessToken;
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Menggunakan authOptions yang sudah dipisah
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };