"use client"

import { ReactElement, useCallback, useEffect, useMemo, useState } from "react"
import {
  FieldArrayWithId,
  FieldName,
  useFieldArray,
  useFormContext,
} from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { EditTrainingSchema, Exercice, TrainingExercice } from "~/lib/db/schema"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { AddExerciceDialog, ExerciceFormPart } from "./ExerciceFormPart"
import { AddSupersetDialog, SupersetFormPart } from "./SupersetFormPart"
import {
  DragDropContext,
  Droppable,
  OnDragEndResponder,
} from "react-beautiful-dnd"

export const ExercicesFormPart = ({
  exercices,
}: {
  exercices: Exercice[]
}): ReactElement => {
  const {
    fields: training_exercices,
    append: appendExercice,
    remove: removeExercice,
    move: moveExercice,
  } = useFieldArray<EditTrainingSchema, "trainings_exercices">({
    name: "trainings_exercices",
  })
  const {
    fields: training_supersets,
    append: appendSuperset,
    remove: removeSuperset,
    move: moveSuperset,
  } = useFieldArray<EditTrainingSchema, "trainings_supersets">({
    name: "trainings_supersets",
  })

  const form = useFormContext<EditTrainingSchema>()

  const reorderTrainingParts = useCallback(
    (
      exercices: FieldArrayWithId<EditTrainingSchema, "trainings_exercices">[],
      supersets: FieldArrayWithId<EditTrainingSchema, "trainings_supersets">[]
    ) => {
      const parts: {
        index: number
        field:
          | FieldArrayWithId<EditTrainingSchema, "trainings_exercices">
          | FieldArrayWithId<EditTrainingSchema, "trainings_supersets">
      }[] = []
      parts.push(
        ...(exercices?.map((tEx, index) => ({ index, field: tEx })) ?? [])
      )
      parts.push(
        ...(supersets?.map((tEx, index) => ({ index, field: tEx })) ?? [])
      )
      parts.sort((a, b) => a.field.order - b.field.order)
      parts.forEach((part, index) => {
        if ("rounds" in part.field) {
          form.setValue(`trainings_supersets.${part.index}.order`, index + 1)
        } else {
          form.setValue(`trainings_exercices.${part.index}.order`, index + 1)
        }
        parts[index].field.order = index + 1
      })
      return parts
    },
    []
  )

  const [training_parts, setTrainingParts] = useState<
    {
      index: number
      field:
        | FieldArrayWithId<EditTrainingSchema, "trainings_exercices">
        | FieldArrayWithId<EditTrainingSchema, "trainings_supersets">
    }[]
  >()
  useEffect(() => {
    setTrainingParts(
      reorderTrainingParts(training_exercices, training_supersets)
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    training_exercices.length,
    training_supersets.length,
    reorderTrainingParts,
  ])

  const handleDrag: OnDragEndResponder = ({ source, destination }) => {
    if (!destination || !training_parts) return

    const sourcePart = training_parts[source.index]
    const destinationPart = training_parts[destination.index]

    // if dragged element is moved to top
    if (source.index > destination.index) {
      training_parts?.slice(destination.index, source.index).forEach((part) => {
        if ("rounds" in part.field) {
          const oldOrder = form.getValues(
            `trainings_supersets.${part.index}.order`
          )
          return form.setValue(
            `trainings_supersets.${part.index}.order`,
            oldOrder + 1
          )
        }
        const oldOrder = form.getValues(
          `trainings_exercices.${part.index}.order`
        )
        form.setValue(`trainings_exercices.${part.index}.order`, oldOrder + 1)
      })
    }
    // if dragged element is moved to bottom
    else {
      training_parts?.slice(source.index, destination.index).forEach((part) => {
        if ("rounds" in part.field) {
          const oldOrder = form.getValues(
            `trainings_supersets.${part.index}.order`
          )
          return form.setValue(
            `trainings_supersets.${part.index}.order`,
            oldOrder - 1
          )
        }
        const oldOrder = form.getValues(
          `trainings_exercices.${part.index}.order`
        )
        form.setValue(`trainings_exercices.${part.index}.order`, oldOrder - 1)
      })
    }

    if ("rounds" in sourcePart.field) {
      form.setValue(
        `trainings_supersets.${sourcePart.index}.order`,
        destinationPart.field.order
      )
    } else {
      form.setValue(
        `trainings_exercices.${sourcePart.index}.order`,
        destinationPart.field.order
      )
    }

    setTrainingParts(() =>
      reorderTrainingParts(
        (form.getValues("trainings_exercices") ?? []) as FieldArrayWithId<
          EditTrainingSchema,
          "trainings_exercices"
        >[],
        (form.getValues("trainings_supersets") ?? []) as FieldArrayWithId<
          EditTrainingSchema,
          "trainings_supersets"
        >[]
      )
    )
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Exercices</CardTitle>
        <div className="flex gap-1">
          <AddExerciceDialog exercices={exercices} onConfirm={appendExercice} />
          <AddSupersetDialog exercices={exercices} onConfirm={appendSuperset} />
        </div>
      </CardHeader>
      <CardContent>
        <DragDropContext onDragEnd={handleDrag}>
          <ul className="flex w-full flex-col gap-px">
            <Droppable droppableId="test-items">
              {(provided, snapshot) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {training_parts?.map(({ field, index: partIndex }, index) => {
                    if ("rounds" in field) {
                      return (
                        <SupersetFormPart
                          key={field.id}
                          exercices={exercices}
                          field={field}
                          superSetIndex={partIndex}
                          listIndex={index}
                          removeSuperset={removeSuperset}
                        />
                      )
                    }
                    return (
                      <ExerciceFormPart
                        key={field.id}
                        exercices={exercices}
                        field={field}
                        exerciceIndex={partIndex}
                        listIndex={index}
                        removeExercice={removeExercice}
                      />
                    )
                  })}
                </div>
              )}
            </Droppable>
          </ul>
        </DragDropContext>
      </CardContent>
    </Card>
  )
}

export const RepOrTimeField = ({ name }: { name: string }) => {
  const form = useFormContext<EditTrainingSchema>()

  const [selected, setSelected] = useState(
    form.getValues(`${name}.time` as any) !== undefined ? "time" : "repetition"
  )
  const [open, setOpen] = useState(false)

  const onChange = (value: string) => {
    if (value === "repetition") {
      form.setValue(`${name}.time` as any, undefined)
    } else {
      form.setValue(`${name}.repetition` as any, undefined)
    }
    setSelected(value)
  }

  return (
    <div className="flex w-[110px] min-w-[110px] max-w-[110px] flex-col">
      <Select
        defaultValue={selected}
        onValueChange={onChange}
        open={open}
        onOpenChange={() => {
          // hack for radix select on touch device
          // issue: https://github.com/radix-ui/primitives/issues/1658
          if (open)
            setTimeout(() => {
              setOpen((open) => !open)
            }, 50)
          else setOpen((open) => !open)
        }}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="repetition">Répétition</SelectItem>
          <SelectItem value="time">Temps</SelectItem>
        </SelectContent>
      </Select>
      {selected === "repetition" ? (
        <>
          <FormField
            control={form.control}
            name={`${name}.repetition` as any}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Répétition</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      ) : (
        <>
          <FormField
            control={form.control}
            name={`${name}.time` as any}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Temps d&apos;exercice</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="120" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </div>
  )
}
