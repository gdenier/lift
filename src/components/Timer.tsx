"use client"

import { ReactElement, useEffect, useState } from "react"
import { formatTime } from "~/lib/utils"
import { Button } from "./ui/button"
import { PlayCircle, PauseCircle, StopCircle } from "lucide-react"

export const Timer = (): ReactElement => {
  const { time, isActive, pause, resume, start, stop } = useTimer({
    onFinish: () => alert("finished"),
  })
  return (
    <div>
      <p>{formatTime(time)}</p>
      <Button
        variant="outline"
        size="icon"
        onClick={() => (isActive ? resume() : start(10))}
      >
        <PlayCircle className="h-5 w-5" />
      </Button>
      <Button variant="outline" size="icon" onClick={() => stop()}>
        <StopCircle className="h-5 w-5" />
      </Button>
      <Button variant="outline" size="icon" onClick={() => pause()}>
        <PauseCircle className="h-5 w-5" />
      </Button>
    </div>
  )
}

const useTimer = (props?: { onFinish?: () => void }) => {
  const [time, setTime] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(true)
  const [timeInterval, setTimerInterval] =
    useState<ReturnType<typeof setInterval>>()

  useEffect(() => {
    if (isActive && !isPaused) {
      setTimerInterval(
        setInterval(() => {
          setTime((time) => time - 1)
        }, 1000)
      )
    } else {
      clearInterval(timeInterval)
    }
    return () => clearInterval(timeInterval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, isPaused])

  useEffect(() => {
    if (time <= 0) {
      stop()
      props?.onFinish?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time])

  function start(time: number) {
    setTime(time)
    setIsActive(true)
    setIsPaused(false)
  }
  function stop() {
    setTime(0)
    setIsActive(false)
    setIsPaused(true)
  }
  function pause() {
    setIsPaused(true)
  }
  function resume() {
    setIsPaused(false)
  }

  return {
    time,
    isActive,
    start,
    stop,
    pause,
    resume,
  }
}
