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
import { Trash } from "lucide-react"
import { ReactElement, useEffect, useMemo, useState } from "react"
import {
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form"
import { z } from "zod"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import {
  EditTrainingSchema,
  Exercice,
  editTrainingSchema,
} from "~/lib/db/schema"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetContentProps,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet"
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
  } = useFieldArray<EditTrainingSchema, "trainings_superset">({
    name: "trainings_superset",
  })

  const training_parts = useMemo(() => {
    const parts: {
      index: number
      field:
        | FieldArrayWithId<EditTrainingSchema, "trainings_exercices">
        | FieldArrayWithId<EditTrainingSchema, "trainings_superset">
    }[] = []
    training_exercices.forEach((tEx, index) => {
      parts.splice(tEx.order, 0, { index, field: tEx })
    })
    training_supersets.forEach((tSuperset, index) => {
      parts.splice(tSuperset.order, 0, { index, field: tSuperset })
    })
    return parts
  }, [training_exercices, training_supersets])

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

const ResponsiveExercicePanel = ({
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
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className="hidden w-full justify-start md:flex"
          >
            <p className="first-letter:uppercase">{exercice.name}</p>
            <p>({training_exerice.series?.length ?? 0} séries)</p>
          </Button>
        </SheetTrigger>
        <ExercicePanel
          index={index}
          exercice={exercice}
          remove={remove}
          side="right"
        />
      </Sheet>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className="flex w-full justify-start md:hidden"
          >
            <p className="first-letter:uppercase">{exercice.name}</p>
            <p>({training_exerice.series?.length ?? 0} séries)</p>
          </Button>
        </SheetTrigger>
        <ExercicePanel
          index={index}
          exercice={exercice}
          remove={remove}
          side="bottom"
        />
      </Sheet>
    </>
  )
}

const ExercicePanel = ({
  index,
  exercice,
  remove,
  side,
}: {
  index: number
  exercice: Exercice
  remove: UseFieldArrayRemove
} & Pick<SheetContentProps, "side">) => {
  const form = useFormContext<EditTrainingSchema>()

  useEffect(() => {
    form.setValue(`trainings_exercices.${index}.order`, index + 1)
  }, [form, index])

  return (
    <SheetContent
      className="flex flex-col justify-between max-md:max-h-[90dvh] sm:max-w-md"
      side={side}
      onOpenAutoFocus={(e) => e.preventDefault()}
    >
      <SheetHeader>
        <SheetTitle className="first-letter:uppercase">
          {exercice.name}
        </SheetTitle>
        <SheetDescription>
          Ajouter, modifier, supprimer vos séries
        </SheetDescription>
      </SheetHeader>
      <div className="flex-1 overflow-y-auto">
        <ExerciceFields
          key={`training-exercice-${index}`}
          exercice={exercice}
          index={index}
        />
      </div>
      <SheetFooter>
        <SheetClose asChild>
          <Button type="button" className="w-full" variant="secondary">
            Fermer
          </Button>
        </SheetClose>
        <Button
          type="button"
          variant="destructive"
          size="icon"
          onClick={() => remove(index)}
        >
          <Trash />
        </Button>
      </SheetFooter>
    </SheetContent>
  )
}

const ExerciceFields = ({
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

const ExerciceField = ({
  index,
  fieldIndex,
  exercice,
  remove,
}: {
  fieldIndex: number
  index: number
  exercice: Exercice
  remove: UseFieldArrayRemove
}) => {
  const form = useFormContext<EditTrainingSchema>()

  useEffect(() => {
    form.setValue(
      `trainings_exercices.${fieldIndex}.series.${index}.order`,
      index + 1
    )
  }, [index, form, fieldIndex])

  return (
    <li
      key={`${exercice.id}-serie-${index}`}
      className="flex w-full items-end justify-between gap-1"
    >
      <RepOrTimeField fieldIndex={fieldIndex} index={index} />
      <FormField
        control={form.control}
        name={`trainings_exercices.${fieldIndex}.series.${index}.weight`}
        render={({ field }) => (
          // TODO: Custom Weight input
          <FormItem>
            <FormLabel>Poids (gramme)</FormLabel>
            <FormControl>
              <Input type="number" placeholder="5000" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`trainings_exercices.${fieldIndex}.series.${index}.rest`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Repos (seconde)</FormLabel>
            <FormControl>
              <Input type="number" placeholder="120" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button
        type="button"
        variant="destructive"
        size="icon"
        onClick={() => remove(index)}
        className="shrink-0"
      >
        <Trash />
      </Button>
    </li>
  )
}

export const RepOrTimeField = ({
  fieldIndex,
  index,
}: {
  fieldIndex: number
  index: number
}) => {
  const form = useFormContext<EditTrainingSchema>()

  const [selected, setSelected] = useState(
    form.getValues(
      `trainings_exercices.${fieldIndex}.series.${index}.repetition`
    ) !== undefined
      ? "repetition"
      : "time"
  )
  const [open, setOpen] = useState(false)

  const onChange = (value: string) => {
    if (value === "repetition") {
      form.setValue(
        `trainings_exercices.${fieldIndex}.series.${index}.time`,
        undefined
      )
    } else {
      form.setValue(
        `trainings_exercices.${fieldIndex}.series.${index}.repetition`,
        undefined
      )
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
            name={`trainings_exercices.${fieldIndex}.series.${index}.repetition`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Répétition</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="120" {...field} />
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
            name={`trainings_exercices.${fieldIndex}.series.${index}.time`}
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
