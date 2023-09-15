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
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form"
import { Button } from "~/components/ui/button"
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
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet"
import { RepOrTimeField } from "./ExercicesFormPart"
import { ResponsiveDialog } from "~/components/ResponsiveDialog"
import { Draggable } from "react-beautiful-dnd"

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
    <Draggable draggableId={`item-${listIndex}`} index={listIndex}>
      {(provided, snapshot) => (
        <div
          key={field.id}
          className="flex w-full items-center justify-stretch gap-2"
          {...provided.draggableProps}
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

const ExercicePanel = ({
  index,
  exercice,
  remove,
}: {
  index: number
  exercice: Exercice
  remove: UseFieldArrayRemove
}) => {
  return (
    <>
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
    </>
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
      <RepOrTimeField
        name={`trainings_exercices.${fieldIndex}.series.${index}`}
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

export const AddExerciceDialog = ({
  onConfirm,
  exercices,
}: {
  onConfirm: UseFieldArrayAppend<EditTrainingSchema, "trainings_exercices">
  exercices: Exercice[]
}) => {
  const [open, setOpen] = useState(false)
  const trainings_exercices = useWatch<
    EditTrainingSchema,
    "trainings_exercices"
  >({ name: "trainings_exercices" })
  const trainings_supersets = useWatch<
    EditTrainingSchema,
    "trainings_supersets"
  >({ name: "trainings_supersets" })

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
                    order:
                      (trainings_exercices?.length ?? 0) +
                      (trainings_supersets?.length ?? 0) +
                      1,
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
