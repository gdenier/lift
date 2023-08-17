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
import { ReactElement, useEffect, useState } from "react"
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
import { Exercice, editTrainingSchema } from "~/lib/db/schema"
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
import { RepOrTimeField } from "./ExercicesFormPart"

export const ExerciceFormPart = ({
  field,
  index,
  exercices,
  removeExercice,
}: {
  field: FieldArrayWithId<
    z.infer<typeof editTrainingSchema>,
    "trainings_exercices"
  >
  removeExercice: UseFieldArrayRemove
  index: number
  exercices: Exercice[]
}): ReactElement => {
  const form = useFormContext<z.infer<typeof editTrainingSchema>>()

  return (
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
      <ResponsiveExercicePanel
        index={index}
        exercice={
          exercices.find(
            (exercice) => exercice.id === field.exerciceId
          ) as Exercice
        }
        remove={removeExercice}
      />
    </div>
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
    z.infer<typeof editTrainingSchema>,
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
  const form = useFormContext<z.infer<typeof editTrainingSchema>>()

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

export const AddExerciceDialog = ({
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
