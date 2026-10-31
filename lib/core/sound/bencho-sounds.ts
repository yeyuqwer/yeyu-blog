// Adapted from Bencho's Tap and Tick Web Audio sounds.
let audioContext: AudioContext | null = null

function playNote(
  {
    hz,
    to,
    ms,
    gain,
    cut,
    attack,
  }: {
    hz: number
    to?: number
    ms: number
    gain: number
    cut: number
    attack: number
  },
  volume: number,
) {
  if (volume <= 0) return

  audioContext ??= new AudioContext()
  const context = audioContext
  if (context.state !== 'running') void context.resume()

  const start = context.currentTime + 0.005
  const end = start + ms / 1000
  const oscillator = context.createOscillator()
  const filter = context.createBiquadFilter()
  const envelope = context.createGain()

  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(hz, start)
  if (to !== undefined) oscillator.frequency.exponentialRampToValueAtTime(to, end)

  filter.type = 'lowpass'
  filter.frequency.value = cut
  envelope.gain.setValueAtTime(0.0001, start)
  envelope.gain.exponentialRampToValueAtTime(gain * Math.min(volume, 1), start + attack / 1000)
  envelope.gain.exponentialRampToValueAtTime(0.0001, end)

  oscillator.connect(filter).connect(envelope).connect(context.destination)
  oscillator.onended = () => {
    oscillator.disconnect()
    filter.disconnect()
    envelope.disconnect()
  }
  oscillator.start(start)
  oscillator.stop(end + 0.02)
}

export function playTap(volume = 1) {
  playNote({ hz: 168, ms: 95, gain: 0.06, cut: 480, attack: 14 }, volume)
}

export function playTick(volume = 1) {
  playNote({ hz: 196, to: 130, ms: 150, gain: 0.09, cut: 900, attack: 4 }, volume)
}
