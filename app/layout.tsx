import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/app/(lib)/axios";
import { Providers } from "./providers";
import SidebarWrapper from "./(components)/SidebarWrapper";
import { ChakraProvider } from "@chakra-ui/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StageProcess",
  description: "StageProcess",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let user = null;

  if (typeof window !== "undefined") {
    const userString = localStorage.getItem("user");

    if (userString) {
      try {
        user = JSON.parse(userString);
      } catch (error) {
        console.error("Erro ao analisar o usuário do localStorage:", error);
      }
    }
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ChakraProvider>
          <SidebarWrapper />
          <Providers>{children}</Providers>
        </ChakraProvider>
      </body>
    </html>
  );
}