'use client'

import type { SoundAsset, UseSoundOptions, UseSoundReturn } from '@/lib/core/sound'
import { useCallback, useEffect, useRef, useState } from 'react'
import { decodeAudioData, getAudioContext } from '@/lib/core/sound'

export function useSound(sound: SoundAsset, options: UseSoundOptions = {}): UseSoundReturn {
  const {
    volume = 1,
    playbackRate = 1,
    interrupt = false,
    soundEnabled = true,
    onPlay,
    onEnd,
    onPause,
    onStop,
  } = options

  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState<number | null>(sound.duration ?? null)
  const sourceRef = useRef<AudioBufferSourceNode | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const bufferRef = useRef<AudioBuffer | null>(null)
  const isStoppingRef = useRef(false)

  useEffect(() => {
    let cancelled = false
    decodeAudioData(sound.dataUri).then(buffer => {
      if (!cancelled) {
        bufferRef.current = buffer
        setDuration(buffer.duration)
      }
    })
    return () => {
      cancelled = true
    }
  }, [sound.dataUri])

  const stop = useCallback(() => {
    const source = sourceRef.current

    if (source !== null) {
      isStoppingRef.current = true
      sourceRef.current = null
      source.stop()
    }

    setIsPlaying(false)
    onStop?.()
  }, [onStop])

  const play = useCallback(
    (overrides?: { volume?: number; playbackRate?: number }) => {
      if (!soundEnabled || !bufferRef.current) return

      const ctx = getAudioContext()

      if (ctx.state === 'suspended') {
        ctx.resume()
      }

      if (interrupt && sourceRef.current) {
        stop()
      }

      const source = ctx.createBufferSource()
      const gain = ctx.createGain()

      source.buffer = bufferRef.current
      source.playbackRate.value = overrides?.playbackRate ?? playbackRate
      gain.gain.value = overrides?.volume ?? volume

      source.connect(gain)
      gain.connect(ctx.destination)

      source.onended = () => {
        if (isStoppingRef.current) {
          isStoppingRef.current = false
          return
        }

        sourceRef.current = null
        setIsPlaying(false)
        onEnd?.()
      }

      source.start(0)
      sourceRef.current = source
      gainRef.current = gain
      setIsPlaying(true)
      onPlay?.()
    },
    [soundEnabled, playbackRate, volume, interrupt, stop, onPlay, onEnd],
  )

  const pause = useCallback(() => {
    stop()
    onPause?.()
  }, [stop, onPause])

  useEffect(() => {
    if (gainRef.current) {
      gainRef.current.gain.value = volume
    }
  }, [volume])

  useEffect(() => {
    return () => {
      const source = sourceRef.current

      if (source !== null) {
        isStoppingRef.current = true
        sourceRef.current = null
        source.stop()
      }
    }
  }, [])

  return [play, { stop, pause, isPlaying, duration, sound }] as const
}
