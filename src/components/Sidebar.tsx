"use client"

import Link from "next/link"
import { ReactElement, useState } from "react"
import { LogoutButton } from "./LogoutButton"
import { Button, buttonVariants } from "./ui/button"
import { cn } from "~/lib/utils"

export const Sidebar = (): ReactElement | null => {
  // const [state, setState] = useState<boolean | null>(
  //   typeof window !== "undefined"
  //     ? JSON.parse(localStorage?.getItem("sidebar_state") ?? "true")
  //     : null
  // )

  // const toggle = () => {
  //   setState((old) => {
  //     localStorage?.setItem("sidebar_state", JSON.stringify(!old))
  //     return !old
  //   })
  // }

  // if (state === null) return null
  const state = true

  return (
    <div
      className="hidden flex-col justify-between gap-8 bg-primary px-4 py-8 text-primary-foreground data-[expanded=true]:w-[180px] md:flex"
      data-expanded={state}
    >
      <p className="text-4xl font-bold">Lift</p>
      <nav className="h-full">
        <ul className="flex flex-col gap-4">
          <li>
            <Link
              href="/"
              className={buttonVariants({
                variant: "secondary",
                className: cn("w-full", state && "!justify-start"),
              })}
              suppressHydrationWarning
            >
              {state ? "Home" : "H"}
            </Link>
          </li>
          <li>
            <Link
              href="/exercices"
              className={buttonVariants({
                variant: "secondary",
                className: cn("w-full", state && "!justify-start"),
              })}
              suppressHydrationWarning
            >
              {state ? "Exercices" : "E"}
            </Link>
          </li>
        </ul>
      </nav>
      <div className={cn("flex justify-between gap-2", state || "flex-col")}>
        <LogoutButton expanded={state} />
        {/* <Button variant="secondary" onClick={toggle} suppressHydrationWarning>
          E
        </Button> */}
      </div>
    </div>
  )
}
