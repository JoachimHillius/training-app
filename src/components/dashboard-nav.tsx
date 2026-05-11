'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { signOut } from '@/app/actions/auth'
import ThemeToggle from './theme-toggle'
import { SOUND_PRESETS, SOUND_STORAGE_KEY, type SoundPreset } from '@/lib/workout-sounds'

export default function DashboardNav({
  email,
  isAdmin,
}: {
  email: string
  isAdmin: boolean
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [sound, setSound] = useState<SoundPreset>('bell')

  useEffect(() => {
    const saved = localStorage.getItem(SOUND_STORAGE_KEY) as SoundPreset | null
    if (saved) setSound(saved)
  }, [])

  function handleSoundChange(preset: SoundPreset) {
    setSound(preset)
    localStorage.setItem(SOUND_STORAGE_KEY, preset)
  }

  return (
    <nav className="sticky top-0 z-30 border-b border-black/10 dark:border-white/10 bg-white/95 dark:bg-dark-bg/90 backdrop-blur-sm px-6 sm:px-10">
      {/* Main row */}
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-8">
          <Link href="/">
            <Image
              src="/NEw_ProGrip_JP_Logo.png"
              alt="ProGrip JP"
              width={100}
              height={34}
              priority
              className="h-8 w-auto object-contain"
            />
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-black/70 dark:text-white/70 transition-colors hover:text-black dark:hover:text-white"
            >
              Dashboard
            </Link>
            <Link
              href="/coach"
              className="text-sm font-medium text-black/70 dark:text-white/70 transition-colors hover:text-black dark:hover:text-white"
            >
              Meet the Coach
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="text-sm font-medium text-accent transition-colors hover:text-accent/80"
              >
                Admin
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <select
            value={sound}
            onChange={(e) => handleSoundChange(e.target.value as SoundPreset)}
            className="hidden md:block rounded-lg border border-black/20 dark:border-white/20 bg-transparent px-2 py-1 text-xs text-black/60 dark:text-white/60 focus:outline-none focus:border-accent"
            title="Timer sound"
          >
            {SOUND_PRESETS.map((p) => (
              <option key={p.value} value={p.value} className="bg-white dark:bg-dark-bg">
                {p.label}
              </option>
            ))}
          </select>
          <span className="hidden max-w-[160px] truncate text-sm text-black/40 dark:text-white/40 sm:inline">
            {email}
          </span>
          <form action={signOut} className="hidden md:block">
            <button
              type="submit"
              className="rounded-full border border-black/20 dark:border-white/20 px-4 py-2 text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/10"
            >
              Sign out
            </button>
          </form>
          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="flex flex-col justify-center gap-[5px] p-2 md:hidden"
          >
            <span
              className={`block h-0.5 w-5 bg-current transition-all duration-200 ${
                menuOpen ? 'translate-y-[7px] rotate-45' : ''
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-current transition-all duration-200 ${
                menuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-current transition-all duration-200 ${
                menuOpen ? '-translate-y-[7px] -rotate-45' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile dropdown — inside the sticky nav so it scrolls with it */}
      {menuOpen && (
        <div className="border-t border-black/10 dark:border-white/10 pb-4 pt-4 md:hidden">
          <div className="flex flex-col gap-4">
            <Link
              href="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-black/70 dark:text-white/70"
            >
              Dashboard
            </Link>
            <Link
              href="/coach"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-black/70 dark:text-white/70"
            >
              Meet the Coach
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-accent"
              >
                Admin
              </Link>
            )}
            <p className="text-sm text-black/40 dark:text-white/40">{email}</p>
            <div className="flex items-center gap-2">
              <label className="text-xs text-black/40 dark:text-white/40">Timer sound</label>
              <select
                value={sound}
                onChange={(e) => handleSoundChange(e.target.value as SoundPreset)}
                className="rounded-lg border border-black/20 dark:border-white/20 bg-transparent px-2 py-1 text-xs text-black/60 dark:text-white/60 focus:outline-none focus:border-accent"
              >
                {SOUND_PRESETS.map((p) => (
                  <option key={p.value} value={p.value} className="bg-white dark:bg-dark-bg">
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-full border border-black/20 dark:border-white/20 px-4 py-2 text-sm font-medium"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      )}
    </nav>
  )
}
