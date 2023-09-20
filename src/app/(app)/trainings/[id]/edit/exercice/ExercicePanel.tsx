"use client"
import { Trash } from "lucide-react"
import { UseFieldArrayRemove } from "react-hook-form"
import { Button } from "~/components/ui/button"
import { Exercice } from "~/lib/db/schema"
import {
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet"
import { ExerciceFields } from "./ExerciceFields"

export const ExercicePanel = ({
  index,
  exercice,
  remove,
}: {
  index: number
  exercice: Exercice
  remove: UseFieldArrayRemove
}) => {
  return (
    <>
      <SheetHeader>
        <SheetTitle className="first-letter:uppercase">
          {exercice.name}
        </SheetTitle>
        <SheetDescription>
          Ajouter, modifier, supprimer vos séries
        </SheetDescription>
      </SheetHeader>
      <div className="flex-1 overflow-y-auto">
        <ExerciceFields
          key={`training-exercice-${index}`}
          exercice={exercice}
          index={index}
        />
      </div>
      <SheetFooter>
        <SheetClose asChild>
          <Button type="button" className="w-full" variant="secondary">
            Fermer
          </Button>
        </SheetClose>
        <Button
          type="button"
          variant="destructive"
          size="icon"
          onClick={() => remove(index)}
        >
          <Trash />
        </Button>
      </SheetFooter>
    </>
  )
}
