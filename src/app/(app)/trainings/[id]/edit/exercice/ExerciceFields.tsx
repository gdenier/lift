"use client"
import { useFieldArray, useFormContext } from "react-hook-form"
import { Button } from "~/components/ui/button"
import { EditTrainingSchema, Exercice } from "~/lib/db/schema"
import { ExerciceField } from "./ExerciceField"

export const ExerciceFields = ({
  index: fieldIndex,
  exercice,
}: {
  index: number
  exercice: Exercice
}) => {
  const { fields, append, remove } = useFieldArray<
    EditTrainingSchema,
    `trainings_exercices.${number}.series`
  >({ name: `trainings_exercices.${fieldIndex}.series` })

  const form = useFormContext<EditTrainingSchema>()

  return (
    <>
      <div className="flex w-full flex-col gap-1">
        {fields
          .sort((a, b) => a.order - b.order)
          .map((field, index) => (
            <ExerciceField
              exercice={exercice}
              fieldIndex={fieldIndex}
              index={index}
              remove={remove}
              key={field.id}
            />
          ))}
      </div>
      <Button
        variant="outline"
        type="button"
        className="mt-4 w-full"
        onClick={() =>
          append({
            repetition: 1,
            rest: 120,
            order: fields.length + 1,
          })
        }
      >
        Ajouter une série
      </Button>
    </>
  )
}
