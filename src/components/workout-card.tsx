'use client'

import { useState } from 'react'
import Image from 'next/image'

type WorkoutCategory = {
  category: string
  image: string
  description: string
}

export default function WorkoutCard({ workout }: { workout: WorkoutCategory }) {
  const [revealed, setRevealed] = useState(false)

  return (
    <button
      onClick={() => setRevealed(true)}
      className="group relative w-full overflow-hidden rounded-2xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent aspect-[4/5]"
    >
      <Image
        src={workout.image}
        alt={workout.category}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/30 to-transparent" />

      {/* Normal state */}
      <div
        className={`absolute inset-x-0 bottom-0 p-7 transition-opacity duration-300 ${
          revealed ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <h3 className="font-display text-3xl uppercase tracking-tight">{workout.category}</h3>
        <p className="mt-2 text-sm text-white/70">{workout.description}</p>
        <span className="mt-4 inline-block text-xs font-semibold uppercase tracking-widest text-accent">
          View workouts →
        </span>
      </div>

      {/* Coming soon overlay */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center bg-dark-bg/90 p-8 text-center transition-opacity duration-300 ${
          revealed ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent">Coming Soon</span>
        <h3 className="mt-3 font-display text-4xl uppercase tracking-tight">{workout.category}</h3>
        <p className="mt-4 text-sm leading-relaxed text-white/60">
          {workout.category} workouts are being built out. Check back soon — or sign up to get
          notified when they drop.
        </p>
        <button
          onClick={(e) => { e.stopPropagation(); setRevealed(false) }}
          className="mt-6 text-xs text-white/40 underline hover:text-white/70"
        >
          Go back
        </button>
      </div>
    </button>
  )
}
