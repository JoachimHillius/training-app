'use client'

import { useState } from 'react'
import Link from 'next/link'

const INTENSITIES = ['Beginner', 'Intermediate', 'Advanced', 'Elite'] as const

type Program = {
  label: string
  duration: string
  title: string
  description: string
  features: string[]
  featured: boolean
}

export default function ProgramCard({ program }: { program: Program }) {
  const [intensity, setIntensity] = useState<string>('Beginner')

  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-8 transition-transform duration-300 hover:-translate-y-1 ${
        program.featured
          ? 'border-accent bg-accent/10'
          : 'border-white/10 bg-white/5'
      }`}
    >
      {program.featured && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-bold text-dark-bg">
          Most Popular
        </span>
      )}

      <div className="mb-6">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            {program.label}
          </span>
          <span className="text-xs text-white/40">{program.duration}</span>
        </div>
        <h3 className="mt-2 font-display text-3xl uppercase tracking-tight text-white">
          {program.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-white/60">{program.description}</p>
      </div>

      <ul className="mb-8 flex-1 space-y-3">
        {program.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm text-white/80">
            <span className="mt-0.5 shrink-0 text-accent">✓</span>
            {feature}
          </li>
        ))}
      </ul>

      {/* Intensity selector */}
      <div className="mb-4">
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/50">
          Select Intensity
        </label>
        <select
          value={intensity}
          onChange={(e) => setIntensity(e.target.value)}
          className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        >
          {INTENSITIES.map((level) => (
            <option key={level} value={level} className="bg-dark-bg text-white">
              {level}
            </option>
          ))}
        </select>
      </div>

      <Link
        href={`/auth/sign-up?program=${encodeURIComponent(program.label)}&intensity=${encodeURIComponent(intensity)}`}
        className={`block rounded-full py-3 text-center text-sm font-bold transition-colors ${
          program.featured
            ? 'bg-accent text-dark-bg hover:bg-accent/90'
            : 'border border-white/20 hover:bg-white/10'
        }`}
      >
        Start Program
      </Link>
    </div>
  )
}
