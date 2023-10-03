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
import { Button } from "~/components/ui/button"
import { useFieldArrayContext } from "~/components/FieldArrayContext"
import { sortByOrder } from "~/lib/utils"
import { Exercice } from "~/lib/db/schema/exercices.schema"
import { EditTraining } from "~/lib/db/schema/training/trainings.schema"

export const AddSupersetDialog = ({ exercices }: { exercices: Exercice[] }) => {
  const [open, setOpen] = useState(false)

  const [selectedExercices, setSelectedExercices] = useState<
    { exercice: Exercice; order: number }[]
  >([])

  const stepsFieldArray = useFieldArrayContext<EditTraining, "steps">("steps")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button">Ajouter un superset</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter les exercices</DialogTitle>
          <DialogDescription>
            Les exercices séléctionnés seront ajouter dans le superset créer.
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
                  {selectedExercices.find(
                    (sEx) => sEx.exercice.id === exercice.id
                  )?.order ?? "-"}
                </p>
              </div>
              <p>{exercice.name}</p>
              {selectedExercices.find(
                (sEx) => sEx.exercice.id === exercice.id
              ) ? (
                <Button
                  type="button"
                  onClick={() => {
                    setSelectedExercices((old) =>
                      old.filter(({ exercice }) => exercice.id !== exercice.id)
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
                        exercice,
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
              stepsFieldArray.append({
                order: stepsFieldArray.fields.length,
                superset: {
                  intervalRest: 0,
                  rest: 60,
                  nbRound: 1,
                  exercices: sortByOrder(selectedExercices).map(
                    (selectedExercice, index) => ({
                      order: index,
                      exercice: selectedExercice.exercice,
                      exerciceId: selectedExercice.exercice.id,
                      series: [{ order: 0, repetition: 10 }],
                    })
                  ),
                },
              })
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
