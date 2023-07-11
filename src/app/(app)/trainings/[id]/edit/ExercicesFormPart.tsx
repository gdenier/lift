"use client"

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "~/components/ui/dialog"
import { Trash } from "lucide-react"
import { ReactElement, useEffect, useState } from "react"
import {
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
import { Exercice, editTrainingSchema } from "~/lib/db/schema"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet"

export const ExercicesFormPart = ({
  exercices,
}: {
  exercices: Exercice[]
}): ReactElement => {
  const { fields, append, remove } = useFieldArray<
    z.infer<typeof editTrainingSchema>,
    "trainings_exercices"
  >({ name: "trainings_exercices" })

  const form = useFormContext<z.infer<typeof editTrainingSchema>>()

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Exercices</CardTitle>
        <AddExerciceDialog exercices={exercices} onConfirm={append} />
      </CardHeader>
      <CardContent>
        <ul className="flex w-full flex-col gap-px">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex w-full items-center justify-stretch gap-2"
            >
              <FormField
                control={form.control}
                name={`trainings_exercices.${index}.order`}
                render={({ field }) => (
                  <p className="flex aspect-square h-10 w-10 shrink-0 items-center justify-center rounded bg-primary text-primary-foreground">
                    {field.value}
                  </p>
                )}
              />
              <ExercicePanel
                index={index}
                exercice={
                  exercices.find(
                    (exercice) => exercice.id === field.exerciceId
                  ) as Exercice
                }
                remove={remove}
              />
            </div>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

const AddExerciceDialog = ({
  onConfirm,
  exercices,
}: {
  onConfirm: UseFieldArrayAppend<
    z.infer<typeof editTrainingSchema>,
    "trainings_exercices"
  >
  exercices: Exercice[]
}) => {
  const [open, setOpen] = useState(false)
  const trainings_exercices = useWatch<
    z.infer<typeof editTrainingSchema>,
    "trainings_exercices"
  >({ name: "trainings_exercices" })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button">Ajouter un exercice</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un exercice</DialogTitle>
          <DialogDescription>
            Vous pourrez ensuite modifier les series.
          </DialogDescription>
        </DialogHeader>
        <ul className="flex max-h-[70dvh] flex-col gap-px overflow-auto">
          {exercices.map((exercice) => (
            <li
              key={exercice.id}
              className="flex w-full items-center justify-between gap-2 rounded border border-transparent p-2 hover:border hover:border-border hover:bg-muted"
            >
              <p>{exercice.name}</p>
              <Button
                type="button"
                onClick={() => {
                  onConfirm({
                    exerciceId: exercice.id,
                    order: (trainings_exercices?.length ?? 0) + 1,
                  })
                  setOpen(false)
                }}
              >
                Ajouter
              </Button>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  )
}

const ExercicePanel = ({
  index,
  exercice,
  remove,
}: {
  index: number
  exercice: Exercice
  remove: UseFieldArrayRemove
}) => {
  const training_exerice = useWatch<
    z.infer<typeof editTrainingSchema>,
    `trainings_exercices.${number}`
  >({ name: `trainings_exercices.${index}` })

  const form = useFormContext<z.infer<typeof editTrainingSchema>>()

  useEffect(() => {
    console.log("update order of exercices")
    form.setValue(`trainings_exercices.${index}.order`, index + 1)
  }, [form, index])

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button type="button" variant="ghost" className="w-full justify-start">
          <p className="first-letter:uppercase">{exercice.name}</p>
          <p>({training_exerice.series?.length ?? 0} séries)</p>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col justify-between sm:max-w-md">
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
    </Sheet>
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
    z.infer<typeof editTrainingSchema>,
    `trainings_exercices.${number}.series`
  >({ name: `trainings_exercices.${fieldIndex}.series` })

  const form = useFormContext<z.infer<typeof editTrainingSchema>>()

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
  const form = useFormContext<z.infer<typeof editTrainingSchema>>()

  useEffect(() => {
    console.log("update order of serie")
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
      <FormField
        control={form.control}
        name={`trainings_exercices.${fieldIndex}.series.${index}.order`}
        render={({ field }) => (
          <p className="flex aspect-square h-10 w-10 shrink-0 items-center justify-center rounded bg-primary text-primary-foreground">
            {field.value}
          </p>
        )}
      />
      <FormField
        control={form.control}
        name={`trainings_exercices.${fieldIndex}.series.${index}.repetition`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Répétition</FormLabel>
            <FormControl>
              <Input type="number" placeholder="10" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
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