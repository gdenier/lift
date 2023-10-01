"use client"

import { ReactElement } from "react"
import { Button } from "./ui/button"
import { RotateCw, SaveIcon } from "lucide-react"
import { useFormContext } from "react-hook-form"

export const SubmitButton = ({
  isLoading,
  text = true,
}: {
  isLoading: boolean
  text?: boolean
}): ReactElement => {
  return (
    <Button
      type="submit"
      className="gap-2"
      disabled={isLoading}
      size={text ? "default" : "icon"}
    >
      {isLoading ? (
        <RotateCw className="h-5 w-5 animate-spin" />
      ) : (
        <SaveIcon className="h-5 w-5" />
      )}
      {text ? "Sauvegarder" : null}
    </Button>
  )
}
