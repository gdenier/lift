"use client"

import { ReactElement } from "react"
import {
  FieldArrayWithId,
  UseFieldArrayRemove,
  UseFieldArrayReturn,
  useFieldArray,
  useFormContext,
} from "react-hook-form"
import { FormField } from "~/components/ui/form"
import { EditTrainingSchema, Exercice } from "~/lib/db/schema"
import { Draggable } from "react-beautiful-dnd"
import { SupersetAddExerciceDialog } from "./SupersetAddExerciceDialog"
import { SupersetSettingsDialog } from "./SupersetSettingsDialog"
import { SupersetExerciceDialog } from "./SupersetExerciceDialog"
import { SuperSetExercicesList } from "./SuperSetExercicesList"

export const SupersetFormPart = ({
  field,
  listIndex,
  superSetIndex,
  exercices,
  supersetFieldArray,
}: {
  field: FieldArrayWithId<EditTrainingSchema, "trainings_supersets">
  listIndex: number
  superSetIndex: number
  exercices: Exercice[]
  supersetFieldArray: UseFieldArrayReturn<
    EditTrainingSchema,
    `trainings_supersets`
  >
}): ReactElement => {
  const form = useFormContext<EditTrainingSchema>()

  const roundFieldArray = useFieldArray<
    EditTrainingSchema,
    `trainings_supersets.${number}.rounds`
  >({ name: `trainings_supersets.${superSetIndex}.rounds` })

  const exerciceFieldArray = useFieldArray<
    EditTrainingSchema,
    `trainings_supersets.${number}.exercices`
  >({ name: `trainings_supersets.${superSetIndex}.exercices` })

  return (
    <Draggable draggableId={`exercices-item-${listIndex}`} index={listIndex}>
      {(provided, snapshot) => (
        <li
          key={field.id}
          className="flex w-full items-start justify-stretch gap-2"
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <FormField
            control={form.control}
            name={`trainings_supersets.${superSetIndex}.order`}
            render={({ field }) => (
              <p
                className="flex aspect-square h-10 w-10 shrink-0 items-center justify-center rounded bg-primary text-primary-foreground"
                {...provided.dragHandleProps}
              >
                {field.value}
              </p>
            )}
          />
          <div className="w-full">
            <div className="flex w-full gap-2">
              <SupersetSettingsDialog
                index={superSetIndex}
                removeSuperset={supersetFieldArray.remove}
                superset={field}
                replaceRound={roundFieldArray.replace}
              />
              <SupersetAddExerciceDialog
                exercices={exercices}
                supersetIndex={superSetIndex}
              />
            </div>
            <SuperSetExercicesList
              exerciceFieldArray={exerciceFieldArray}
              supersetFieldArray={supersetFieldArray}
              exercices={exercices}
              superSetIndex={superSetIndex}
            />
          </div>
        </li>
      )}
    </Draggable>
  )
}
