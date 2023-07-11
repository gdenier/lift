"use client"

import Link from "next/link"
import { ReactElement } from "react"
import { buttonVariants } from "./ui/button"
import { HomeIcon } from "lucide-react"
import { LogoutButton } from "./LogoutButton"

export const MobileNavbar = (): ReactElement => {
  return (
    <div className="flex w-full justify-center gap-6 bg-primary px-6 py-2 md:hidden">
      <Link
        href="/"
        className={buttonVariants({ variant: "secondary", size: "icon" })}
      >
        <HomeIcon />
      </Link>
      <LogoutButton expanded={false} />
    </div>
  )
}
