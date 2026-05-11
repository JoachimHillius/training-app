'use client'

export type SoundPreset = 'bell' | 'beep' | 'double' | 'chime' | 'none'

export const SOUND_PRESETS: { value: SoundPreset; label: string }[] = [
  { value: 'bell', label: 'Bell' },
  { value: 'beep', label: 'Beep' },
  { value: 'double', label: 'Double' },
  { value: 'chime', label: 'Chime' },
  { value: 'none', label: 'Silent' },
]

export const SOUND_STORAGE_KEY = 'progripjp_timer_sound'

export function playTimerSound(preset: SoundPreset) {
  if (preset === 'none' || typeof window === 'undefined') return

  const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  const ctx = new AudioCtx()

  function tone(
    freq: number,
    startTime: number,
    duration: number,
    type: OscillatorType = 'sine',
    volume = 0.4,
  ) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = type
    osc.frequency.setValueAtTime(freq, startTime)
    gain.gain.setValueAtTime(volume, startTime)
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
    osc.start(startTime)
    osc.stop(startTime + duration)
  }

  const t = ctx.currentTime

  switch (preset) {
    case 'bell':
      tone(880, t, 1.5)
      break
    case 'beep':
      tone(1000, t, 0.15, 'square', 0.3)
      break
    case 'double':
      tone(1000, t, 0.12, 'square', 0.3)
      tone(1000, t + 0.25, 0.12, 'square', 0.3)
      break
    case 'chime':
      tone(1047, t, 0.6)
      tone(1319, t + 0.25, 0.6)
      tone(1568, t + 0.5, 1.0)
      break
  }
}
