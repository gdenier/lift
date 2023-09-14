"use client"

import { ReactElement, useMemo, useState } from "react"
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
import { EditTrainingSchema, Exercice } from "~/lib/db/schema"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { AddExerciceDialog, ExerciceFormPart } from "./ExerciceFormPart"
import { AddSupersetDialog, SupersetFormPart } from "./SupersetFormPart"

export const ExercicesFormPart = ({
  exercices,
}: {
  exercices: Exercice[]
}): ReactElement => {
  const {
    fields: training_exercices,
    append: appendExercice,
    remove: removeExercice,
  } = useFieldArray<EditTrainingSchema, "trainings_exercices">({
    name: "trainings_exercices",
  })
  const {
    fields: training_supersets,
    append: appendSuperset,
    remove: removeSuperset,
  } = useFieldArray<EditTrainingSchema, "trainings_supersets">({
    name: "trainings_supersets",
  })

  const form = useFormContext<EditTrainingSchema>()

  const training_parts = useMemo(() => {
    const parts: {
      index: number
      field:
        | FieldArrayWithId<EditTrainingSchema, "trainings_exercices">
        | FieldArrayWithId<EditTrainingSchema, "trainings_supersets">
    }[] = []
    parts.push(
      ...training_exercices.map((tEx, index) => ({ index, field: tEx }))
    )
    parts.push(
      ...training_supersets.map((tEx, index) => ({ index, field: tEx }))
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [training_exercices.length, training_supersets.length])

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
        <ul className="flex w-full flex-col gap-px">
          {training_parts.map(({ field, index }) => {
            if ("rounds" in field) {
              return (
                <SupersetFormPart
                  key={field.id}
                  exercices={exercices}
                  field={field}
                  index={index}
                  removeSuperset={removeSuperset}
                />
              )
            }
            return (
              <ExerciceFormPart
                key={field.id}
                exercices={exercices}
                field={field}
                index={index}
                removeExercice={removeExercice}
              />
            )
          })}
        </ul>
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
