"use client"
import { UseFieldArrayRemove, useWatch } from "react-hook-form"
import { EditTrainingSchema, Exercice } from "~/lib/db/schema"
import { ResponsiveDialog } from "~/components/ResponsiveDialog"
import { ExercicePanel } from "./ExercicePanel"

export const ResponsiveExercicePanel = ({
  index,
  exercice,
  remove,
}: {
  index: number
  exercice: Exercice
  remove: UseFieldArrayRemove
}) => {
  const training_exerice = useWatch<
    EditTrainingSchema,
    `trainings_exercices.${number}`
  >({ name: `trainings_exercices.${index}` })

  return (
    <ResponsiveDialog
      label={
        <>
          <p className="first-letter:uppercase">{exercice.name}</p>
          <p>({training_exerice.series?.length ?? 0} séries)</p>
        </>
      }
      panel={
        <ExercicePanel index={index} exercice={exercice} remove={remove} />
      }
    />
  )
}
