import { ReactElement } from "react"
import { Button } from "./ui/button"
import { RotateCw, SaveIcon } from "lucide-react"

export const SubmitButton = ({
  isPending,
}: {
  isPending: boolean
}): ReactElement => {
  return (
    <Button type="submit" className="gap-2" disabled={isPending}>
      {isPending ? (
        <RotateCw className="h-5 w-5 animate-spin" />
      ) : (
        <SaveIcon className="h-5 w-5" />
      )}
      Sauvegarder
    </Button>
  )
}
