import { useEffect, useRef, useState } from 'react'

interface UseSoundPlayProps {
  src: string
  isLoop?: boolean
}

const useSoundPlayer = ({ src, isLoop = false }: UseSoundPlayProps) => {
  const [isReady, setIsReady] = useState<boolean>(false)
  const [isPlayingLoop, setIsPlayingLoop] = useState<boolean>(isLoop)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const audioRef = useRef<HTMLAudioElement>()

  useEffect(() => {
    audioRef.current = new Audio(src)
    audioRef.current.loop = isPlayingLoop
    audioRef.current.oncanplay = () => {
      setIsReady(true)
    }
    audioRef.current.onplay = () => {
      setIsPlaying(true)
    }
    audioRef.current.onended = () => {
      setIsPlaying(false)
    }

    return () => {
      audioRef.current?.pause()
    }
  }, [])

  const setPlayingLoop = (_isLoop: boolean) => {
    if (!audioRef.current) {
      return false
    }
    audioRef.current.loop = _isLoop
    setIsPlayingLoop(_isLoop)
    return true
  }

  const play = async (): Promise<boolean> => {
    if (!audioRef.current) {
      return false
    }
    await audioRef.current.play()
    return true
  }

  const stop = () => {
    if (!audioRef.current) {
      return false
    }
    audioRef.current.pause()
    audioRef.current.currentTime = 0
    return true
  }

  return {
    isReady,
    isPlayingLoop,
    setPlayingLoop,
    isPlaying,
    play,
    stop
  }
}

export default useSoundPlayer
