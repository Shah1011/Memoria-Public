import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import SessionProvider from "./SessionProvider";
import Head from 'next/head';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Memoria",
  description: "Memory Maintainer App",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <Head>
        <title>Memoria</title>
        <meta property="og:description" content="A Memory Maintainer App" />
        <meta property="og:image" content="https://i.ibb.co/YBL9C9F/logo.png" />
      </Head>
      <body className={`$inter.className`}>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
