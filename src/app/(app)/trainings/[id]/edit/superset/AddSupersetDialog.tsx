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
import { UseFieldArrayAppend, useWatch } from "react-hook-form"
import { Button } from "~/components/ui/button"
import { EditTrainingSchema, Exercice } from "~/lib/db/schema"

export const AddSupersetDialog = ({
  onConfirm,
  exercices,
}: {
  onConfirm: UseFieldArrayAppend<EditTrainingSchema, "trainings_supersets">
  exercices: Exercice[]
}) => {
  const [open, setOpen] = useState(false)
  const trainings_supersets = useWatch<
    EditTrainingSchema,
    "trainings_supersets"
  >({ name: "trainings_supersets" })
  const trainings_exercices = useWatch<
    EditTrainingSchema,
    "trainings_exercices"
  >({ name: "trainings_exercices" })

  const [selectedExercices, setSelectedExercices] = useState<
    { id: string; order: number }[]
  >([])

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
              onConfirm({
                exercices: selectedExercices.map((sEx) => ({
                  order: sEx.order,
                  exerciceId: sEx.id,
                })),
                order:
                  (trainings_exercices?.length ?? 0) +
                  (trainings_supersets?.length ?? 0) +
                  1,
                intervalRest: 0,
                rest: 60, // use default rest time of account
                rounds: [],
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
