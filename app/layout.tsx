import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], display: "swap" });
const mono  = JetBrains_Mono({ subsets: ["latin"], weight: ["400","500"], display: "swap", variable: "--font-mono-loaded" });

export const metadata: Metadata = {
  title: "goonsurf",
  description: "share the gooning web",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en" className={`${inter.className} ${mono.variable}`}>
      <body>
        <Navbar user={user} />
        <main style={{ maxWidth: 720, margin: "0 auto", padding: "32px 16px" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
