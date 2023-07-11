import { ReactElement } from "react"
import { Button } from "./ui/button"
import { RotateCw, SaveIcon } from "lucide-react"

export const SubmitButton = ({
  isPending,
  text = true,
}: {
  isPending: boolean
  text?: boolean
}): ReactElement => {
  return (
    <Button
      type="submit"
      className="gap-2"
      disabled={isPending}
      size={text ? "default" : "icon"}
    >
      {isPending ? (
        <RotateCw className="h-5 w-5 animate-spin" />
      ) : (
        <SaveIcon className="h-5 w-5" />
      )}
      {text ? "Sauvegarder" : null}
    </Button>
  )
}
