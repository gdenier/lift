import { SignOutButton } from "@clerk/nextjs"
import { ReactElement } from "react"
import { Button } from "./ui/button"

export const LogoutButton = ({
  expanded,
}: {
  expanded: boolean
}): ReactElement => {
  return (
    <SignOutButton>
      <Button variant="destructive" suppressHydrationWarning>
        {expanded ? "Déconnexion" : "D"}
      </Button>
    </SignOutButton>
  )
}
