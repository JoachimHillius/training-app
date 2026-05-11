import type { Metadata } from "next"
import { Geist, Bebas_Neue } from "next/font/google"
import Image from "next/image"
import "./globals.css"

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "ProGrip JP",
  description: "World-class training programming by Coach Pascal Isabelle",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${bebasNeue.variable}`}>
      <head>
        {/* Apply dark class from localStorage before paint — defaults to dark */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme')||'dark';if(t==='dark')document.documentElement.classList.add('dark');})()`,
          }}
        />
      </head>
      <body className="flex flex-col min-h-screen text-[#191a1b] dark:text-white antialiased font-[--font-geist-sans]">
        {/* Fixed hero background — dark mode only, sits behind everything */}
        <div className="fixed inset-0 -z-10 hidden dark:block" aria-hidden>
          <Image
            src="/Bareback_Rodeo_Webinar_with_ProGrip_JP.png"
            alt=""
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-dark-bg/80" />
        </div>
        {/* Light mode solid background */}
        <div className="fixed inset-0 -z-10 bg-neutral-50 dark:hidden" aria-hidden />
        {children}
      </body>
    </html>
  )
}
