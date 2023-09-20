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
import { EditTrainingSchema, Exercice } from "~/lib/db/schema"

export const AddExerciceDialog = ({
  onConfirm,
  exercices,
}: {
  onConfirm: UseFieldArrayAppend<EditTrainingSchema, "trainings_exercices">
  exercices: Exercice[]
}) => {
  const [open, setOpen] = useState(false)
  const trainings_exercices = useWatch<
    EditTrainingSchema,
    "trainings_exercices"
  >({ name: "trainings_exercices" })
  const trainings_supersets = useWatch<
    EditTrainingSchema,
    "trainings_supersets"
  >({ name: "trainings_supersets" })

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
                  onConfirm({
                    exerciceId: exercice.id,
                    order:
                      (trainings_exercices?.length ?? 0) +
                      (trainings_supersets?.length ?? 0) +
                      1,
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
