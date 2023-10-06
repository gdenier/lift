"use client"

import Link from "next/link"
import { ReactElement, useState } from "react"
import { LogoutButton } from "./LogoutButton"
import { Button, buttonVariants } from "./ui/button"
import { cn, formatTime } from "~/lib/utils"
import { useTimer } from "./Timer"
import { PauseCircle, PlayCircle } from "lucide-react"

export const Sidebar = (): ReactElement | null => {
  return (
    <div
      className="hidden flex-col justify-between gap-8 bg-primary px-4 py-8 text-primary-foreground data-[expanded=true]:w-[180px] md:flex"
      data-expanded={true}
    >
      <p className="text-4xl font-bold">Lift</p>
      <nav className="h-full">
        <ul className="flex flex-col gap-4">
          <li>
            <Link
              href="/"
              className={buttonVariants({
                variant: "secondary",
                className: cn("w-full !justify-start"),
              })}
              suppressHydrationWarning
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/exercices"
              className={buttonVariants({
                variant: "secondary",
                className: cn("w-full !justify-start"),
              })}
              suppressHydrationWarning
            >
              Exercices
            </Link>
          </li>
          <li>
            <Link
              href="/profile"
              className={buttonVariants({
                variant: "secondary",
                className: cn("w-full !justify-start"),
              })}
              suppressHydrationWarning
            >
              Profile
            </Link>
          </li>
        </ul>
      </nav>
      <div className={cn("flex-col gap-2")}>
        <TimerMenu />
        <LogoutButton expanded={true} />
      </div>
    </div>
  )
}

const TimerMenu = () => {
  const { time, pause, start, resume, isPaused, isActive } = useTimer()

  return (
    <div className="space-y-1">
      <div className="grid grid-cols-2 gap-1">
        <Button variant="secondary" onClick={() => start(30)}>
          {formatTime(30)}
        </Button>
        <Button variant="secondary" onClick={() => start(60)}>
          {formatTime(60)}
        </Button>
        <Button variant="secondary" onClick={() => start(90)}>
          {formatTime(90)}
        </Button>
        <Button variant="secondary" onClick={() => start(120)}>
          {formatTime(120)}
        </Button>
      </div>
      <div className="flex items-center justify-between gap-1">
        <p className="flex-1 text-center">{formatTime(time)}</p>
        <Button
          variant="secondary"
          size="icon"
          disabled={!isActive}
          onClick={() => (isPaused ? resume() : pause())}
        >
          {isPaused ? (
            <PlayCircle className="h-5 w-5" />
          ) : (
            <PauseCircle className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  )
}
