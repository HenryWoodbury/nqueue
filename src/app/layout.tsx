import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'

import { ClerkSigned } from "../components/clerk/Signed";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Draft Queue",
  description: "A Fantasy Draft Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const year = new Date().getFullYear();
  return (
    <ClerkProvider
      appearance={{
        cssLayerName: 'clerk',
      }}
    >
      <html lang="en" className="h-dvh">
        <head>
          <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        </head>
        <body className={`${roboto.className} antialiased flex min-h-full flex-col`}>
          <header className="flex justify-end items-center p-4 gap-4 h-16">
            <ClerkSigned />
          </header>
          <main className="grow">
            {children}
          </main>
          <footer className="flex p-4 h-16 items-center justify-center">
            <p className=""> 
              &copy; {year} Henry Woodbury
            </p>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
