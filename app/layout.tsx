import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "BVRIT Civil Assistant",
  description: "A comprehensive tool for BVRIT students",
  icons: {
    icon: "/bvrit.jpg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="en" className="dark">
        <body className={`antialiased`}>
          <Toaster />
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}
