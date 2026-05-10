'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    setDark(saved ? saved === 'dark' : true)
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    const html = document.documentElement
    if (next) {
      html.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      html.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="rounded-full px-4 py-2 text-sm font-medium border border-black/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
    >
      {dark ? 'Light mode' : 'Dark mode'}
    </button>
  )
}
