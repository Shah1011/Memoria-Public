import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/app/firebase";
import { doc, getDoc } from "firebase/firestore";

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
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials): Promise<any> {
        if (!credentials) return null;

        try {
          // Sign in with email and password
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          );

          if (userCredential.user) {
            // Fetch user name from Firestore
            const userDoc = doc(db, "user", userCredential.user.uid);
            const userSnapshot = await getDoc(userDoc);

            let userName = 'User'; // Default name
            if (userSnapshot.exists()) {
              const data = userSnapshot.data();
              console.log("Firestore Data:", data); // Debugging: Log Firestore data
              userName = data?.name || 'User'; // Fetch name from Firestore
            }

            return {
              id: userCredential.user.uid,
              email: userCredential.user.email,
              name: userName,
              image: userCredential.user.photoURL || null,
            };
          }
          return null;
        } catch (error) {
          console.error('Authentication error:', error); // Log errors
          return null;
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      console.log("Session Callback - Token:", token); // Debugging: Log token in session callback
      session.user = {
        ...session.user,
        id: token.id as string, // Add user ID to the session
        name: token.name as string || 'User', // Add name to the session
        image: token.image as string || null, // Add image to the session
      };
      return session;
    },
    async jwt({ token, user }) {
      console.log("JWT Callback - User:", user); // Debugging: Log user object in JWT callback
      if (user) {
        token.id = user.id as string; // Add user ID to the JWT token
        token.name = user.name as string || 'User'; // Add name to the JWT token
        token.image = user.image as string || null; // Add image to the JWT token
      }
      return token;
    }
  }
};

export default NextAuth(authOptions);
