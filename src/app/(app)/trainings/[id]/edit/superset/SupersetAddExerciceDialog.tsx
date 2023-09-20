"use client"

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "~/components/ui/dialog"
import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { Button } from "~/components/ui/button"
import { EditTrainingSchema, Exercice } from "~/lib/db/schema"

export const SupersetAddExerciceDialog = ({
  exercices,
  supersetIndex,
}: {
  exercices: Exercice[]
  supersetIndex: number
}) => {
  const [open, setOpen] = useState(false)

  const [selectedExercices, setSelectedExercices] = useState<
    { id: string; order: number }[]
  >([])

  const form = useFormContext<EditTrainingSchema>()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" className="min-w-fit">
          Ajouter un exercice
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter les exercices</DialogTitle>
          <DialogDescription>
            Les exercices séléctionnés seront ajouter dans le superset.
          </DialogDescription>
        </DialogHeader>
        <ul className="flex max-h-[70dvh] flex-col gap-px overflow-auto">
          {exercices.map((exercice) => (
            <li
              key={exercice.id}
              className="flex w-full items-center justify-between gap-2 rounded border border-transparent p-2 hover:border hover:border-border hover:bg-muted"
            >
              <div>
                <p>
                  {selectedExercices.find((sEx) => sEx.id === exercice.id)
                    ?.order ?? "-"}
                </p>
              </div>
              <p>{exercice.name}</p>
              {selectedExercices.find((sEx) => sEx.id === exercice.id) ? (
                <Button
                  type="button"
                  onClick={() => {
                    setSelectedExercices((old) =>
                      old.filter(({ id }) => id !== exercice.id)
                    )
                  }}
                >
                  Supprimer
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => {
                    setSelectedExercices((old) => [
                      ...old,
                      {
                        id: exercice.id,
                        order: (old?.length ?? 0) + 1,
                      },
                    ])
                  }}
                >
                  Ajouter
                </Button>
              )}
            </li>
          ))}
        </ul>
        <DialogFooter>
          <Button
            type="button"
            onClick={() => {
              const supersetExercices = form.getValues(
                `trainings_supersets.${supersetIndex}.exercices`
              )
              supersetExercices.push(
                ...selectedExercices.map((selectedExercice, index) => ({
                  exerciceId: selectedExercice.id,
                  order: supersetExercices.length + 1 + index,
                }))
              )
              form.setValue(
                `trainings_supersets.${supersetIndex}.exercices`,
                supersetExercices
              )
              let supersetRounds = form.getValues(
                `trainings_supersets.${supersetIndex}.rounds`
              )
              supersetRounds = supersetRounds.map((round) => {
                round.series.push(
                  ...selectedExercices.map((selectedExercice) => ({
                    order: supersetExercices.find(
                      (supersetExercice) =>
                        supersetExercice.exerciceId === selectedExercice.id
                    )?.order as number,
                  }))
                )
                return round
              })
              form.setValue(
                `trainings_supersets.${supersetIndex}.rounds`,
                supersetRounds
              )
              setSelectedExercices([])
              setOpen(false)
            }}
          >
            Ajouter les exercices
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
