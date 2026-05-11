import Image from 'next/image'
import Link from 'next/link'
import ThemeToggle from './theme-toggle'

export default function Nav() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-black/10 dark:border-white/10 bg-white/90 dark:bg-dark-bg/80 backdrop-blur-sm">
      <Link href="/" className="flex items-center">
        <Image
          src="/logo.png"
          alt="Logo"
          width={120}
          height={40}
          priority
          className="h-10 w-auto object-contain"
        />
      </Link>
      <ThemeToggle />
    </nav>
  )
}
