import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/firebase";

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/auth/signin"
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {},
      async authorize(credentials): Promise<any> {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, (credentials as any).email || '', (credentials as any).password || '');
          if (userCredential.user) {
            return {
              id: userCredential.user.uid, // Include user ID
              email: userCredential.user.email,
              name: userCredential.user.displayName,
              image: userCredential.user.photoURL
            };
          }
          return null;
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string // Add user ID to the session
        };
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Add user ID to the JWT token
      }
      return token;
    }
  }
};

export default NextAuth(authOptions);