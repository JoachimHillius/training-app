import type { Metadata } from "next";
import { Geist, Bebas_Neue } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ProGrip JP",
  description: "World-class training programming by Coach Pascal Isabelle",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${bebasNeue.variable}`}>
      <head>
        {/* Applies dark class from localStorage before paint — defaults to dark */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme')||'dark';if(t==='dark')document.documentElement.classList.add('dark');})()`,
          }}
        />
      </head>
      <body className="flex flex-col min-h-screen bg-white dark:bg-dark-bg text-[#191a1b] dark:text-white antialiased font-[--font-geist-sans]">
        {children}
      </body>
    </html>
  );
}
