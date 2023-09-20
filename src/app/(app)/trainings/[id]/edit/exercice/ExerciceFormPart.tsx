"use client"
import { ReactElement } from "react"
import {
  FieldArrayWithId,
  UseFieldArrayRemove,
  useFormContext,
} from "react-hook-form"
import { FormField } from "~/components/ui/form"
import { EditTrainingSchema, Exercice } from "~/lib/db/schema"
import { Draggable } from "react-beautiful-dnd"
import { ResponsiveExercicePanel } from "./ResponsiveExercicePanel"

export const ExerciceFormPart = ({
  field,
  listIndex,
  exerciceIndex,
  exercices,
  removeExercice,
}: {
  field: FieldArrayWithId<EditTrainingSchema, "trainings_exercices">
  removeExercice: UseFieldArrayRemove
  listIndex: number
  exerciceIndex: number
  exercices: Exercice[]
}): ReactElement => {
  const form = useFormContext<EditTrainingSchema>()

  return (
    <Draggable draggableId={`exercices-item-${listIndex}`} index={listIndex}>
      {(provided, snapshot) => (
        <div
          key={field.id}
          className="flex w-full items-center justify-stretch gap-2"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <FormField
            control={form.control}
            name={`trainings_exercices.${exerciceIndex}.order`}
            render={({ field }) => (
              <p
                className="flex aspect-square h-10 w-10 shrink-0 items-center justify-center rounded bg-primary text-primary-foreground"
                {...provided.dragHandleProps}
              >
                {field.value}
              </p>
            )}
          />
          <ResponsiveExercicePanel
            index={exerciceIndex}
            exercice={
              exercices.find(
                (exercice) => exercice.id === field.exerciceId
              ) as Exercice
            }
            remove={removeExercice}
          />
        </div>
      )}
    </Draggable>
  )
}
