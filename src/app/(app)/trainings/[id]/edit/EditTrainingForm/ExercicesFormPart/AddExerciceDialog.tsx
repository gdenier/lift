"use client"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "~/components/ui/dialog"
import { useState } from "react"
import { UseFieldArrayAppend, useWatch } from "react-hook-form"
import { Button } from "~/components/ui/button"
import { EditTraining, Exercice } from "~/lib/db/schema"
import { useFieldArrayContext } from "~/components/FieldArrayContext"

export const AddExerciceDialog = ({ exercices }: { exercices: Exercice[] }) => {
  const [open, setOpen] = useState(false)

  const stepsFieldArray = useFieldArrayContext<EditTraining, "steps">("steps")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button">Ajouter un exercice</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un exercice</DialogTitle>
          <DialogDescription>
            Vous pourrez ensuite modifier les series.
          </DialogDescription>
        </DialogHeader>
        <ul className="flex max-h-[70dvh] flex-col gap-px overflow-auto">
          {exercices.map((exercice) => (
            <li
              key={exercice.id}
              className="flex w-full items-center justify-between gap-2 rounded border border-transparent p-2 hover:border hover:border-border hover:bg-muted"
            >
              <p>{exercice.name}</p>
              <Button
                type="button"
                onClick={() => {
                  stepsFieldArray.append({
                    order: stepsFieldArray.fields.length,
                    exercice: {
                      exerciceId: exercice.id,
                      exercice,
                    },
                  })
                  setOpen(false)
                }}
              >
                Ajouter
              </Button>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  )
}
