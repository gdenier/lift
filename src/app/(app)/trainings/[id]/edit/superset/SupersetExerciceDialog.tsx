"use client"

import { useWatch } from "react-hook-form"
import { Button } from "~/components/ui/button"
import { EditTrainingSchema, Exercice } from "~/lib/db/schema"
import { ResponsiveDialog } from "~/components/ResponsiveDialog"
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "~/components/ui/sheet"
import { SupersetSerieField } from "./SupersetSerieField"

export const SupersetExerciceDialog = ({
  exercice,
  supersetIndex,
  removeExercice,
}: {
  exercice: Exercice
  supersetIndex: number
  removeExercice: () => void
}) => {
  const rounds = useWatch<
    EditTrainingSchema,
    `trainings_supersets.${number}.rounds`
  >({ name: `trainings_supersets.${supersetIndex}.rounds` })

  const supersetExercices = useWatch<
    EditTrainingSchema,
    `trainings_supersets.${number}.exercices`
  >({ name: `trainings_supersets.${supersetIndex}.exercices` })

  return (
    <ResponsiveDialog
      label={
        <>
          <p className="first-letter:uppercase">{exercice.name}</p>
        </>
      }
      panel={
        <>
          <SheetHeader>
            <SheetTitle className="first-letter:uppercase">
              {exercice.name}
            </SheetTitle>
            <SheetDescription>
              Modifier les séries de cet exercice.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto">
            <div className="flex w-full flex-col gap-1">
              {rounds.map((round, roundIndex) => (
                <SupersetSerieField
                  key={`superset-${supersetIndex}-${exercice.id}-serie-${roundIndex}`}
                  roundIndex={roundIndex}
                  supersetIndex={supersetIndex}
                  serieIndex={round.series.findIndex(
                    (s) =>
                      s.order ===
                      supersetExercices.find(
                        (ex) => ex.exerciceId === exercice.id
                      )!.order
                  )}
                />
              ))}
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button type="button" className="w-full" variant="secondary">
                Fermer
              </Button>
            </SheetClose>
            <Button variant="destructive" onClick={removeExercice}>
              Supprimer
            </Button>
          </SheetFooter>
        </>
      }
    />
  )
}
