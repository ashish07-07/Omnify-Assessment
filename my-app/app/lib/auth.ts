// import NextAuth from "next-auth/next";
// import { NextRequest, NextResponse } from "next/server";
// import CredentialsProvider from "next-auth/providers/credentials";
// import bcrypt from "bcrypt";
// import prisma from "../db";
// import { error } from "console";


// export const NEXT_AUTH = {
//   providers: [
//     CredentialsProvider({
//       name: "Email",
//       credentials: {
//         email: { label: "Email", type: "text", placeholder: "your@email.com" },
//         password: { label: "Password", type: "password", placeholder: "••••••" },
//       },
//       async authorize(credentials: any) {
//         const email = credentials.email;
//         const password = credentials.password;

//         if (!email|| !password)
//         {
//              throw new Error("Email and password is  recquired")
//         }


//         const existingUser = await prisma.user.findFirst({
//           where: { email },
//         });

//         if (existingUser) {
//           const passwordValidator = await bcrypt.compare(
//             password,
//             existingUser.password
//           );

//           if (passwordValidator) {
//             return { id: existingUser.id.toString(), email: existingUser.email };
//           }
//           return null;
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);

//         try {
//           const user = await prisma.user.create({
//             data: { email, password: hashedPassword },
//           });

//           return { id: user.id.toString(), email: user.email };
//         } catch (e) {
//           console.error("Error creating user:", e);
//           return null;
//         }
//       },
//     }),

   
    
//   ],

//   secret: process.env.NEXTAUTH_SECRET,

//   callbacks: {
//     async session({ token, session }: any) {
//       if (token) {
//         session.user = {
//           id: token.sub,
//           email: token.email,
//         };

//       }
//       return session;
//     },
//   },
// };


import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import prisma from "../db";

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
    }
  }
}

export const NEXT_AUTH = {
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (user) {
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (isValid) {
            return { 
              id: user.id.toString(),
              email: user.email
            };
          }
          return null;
        }

        // Create new user if not found
        const hashedPassword = await bcrypt.hash(credentials.password, 10);
        const newUser = await prisma.user.create({
          data: {
            email: credentials.email,
            password: hashedPassword,
          },
        });

        return { 
          id: newUser.id.toString(),
          email: newUser.email
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }:any) {
      // Persist user ID to the token
      if (user) {
        token.sub = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }:any) {
      // Add user ID to session
      if (session.user) {
        session.user.id = token.sub || "";
        session.user.email = token.email || "";
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
};