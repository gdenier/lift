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

export const SupersetFormPart = ({
  field,
  index,
  exercices,
  removeSuperset,
}: {
  field: FieldArrayWithId<
    z.infer<typeof editTrainingSchema>,
    "trainings_superset"
  >
  removeSuperset: UseFieldArrayRemove
  index: number
  exercices: Exercice[]
}): ReactElement => {
  const form = useFormContext<z.infer<typeof editTrainingSchema>>()
  return (
    <div
      key={field.id}
      className="flex w-full items-start justify-stretch gap-2"
    >
      <FormField
        control={form.control}
        name={`trainings_superset.${index}.order`}
        render={({ field }) => (
          <p className="flex aspect-square h-10 w-10 shrink-0 items-center justify-center rounded bg-primary text-primary-foreground">
            {field.value}
          </p>
        )}
      />
      <div>
        <p className="first-letter:uppercase">
          Super set {index + 1} ({field.rounds.length} rounds)
        </p>
        <ul>
          {field.exercices.map((exercice) => (
            <li key={exercice.id}>
              <p>
                {exercices.find((ex) => ex.id === exercice.exerciceId)?.name}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export const AddSupersetDialog = ({
  onConfirm,
  exercices,
}: {
  onConfirm: UseFieldArrayAppend<
    z.infer<typeof editTrainingSchema>,
    "trainings_superset"
  >
  exercices: Exercice[]
}) => {
  const [open, setOpen] = useState(false)
  const trainings_superset = useWatch<
    z.infer<typeof editTrainingSchema>,
    "trainings_superset"
  >({ name: "trainings_superset" })
  const trainings_exercices = useWatch<
    z.infer<typeof editTrainingSchema>,
    "trainings_exercices"
  >({ name: "trainings_exercices" })

  const [selectedExercices, setSelectedExercices] = useState<
    { id: string; order: number }[]
  >([])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button">Ajouter un superset</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter les exercices</DialogTitle>
          <DialogDescription>
            Les exercices séléctionnés seront ajouter dans le superset créer.
          </DialogDescription>
        </DialogHeader>
        <ul className="flex max-h-[70dvh] flex-col gap-px overflow-auto">
          {exercices.map((exercice) => (
            <li
              key={exercice.id}
              className="flex w-full items-center justify-between gap-2 rounded border border-transparent p-2 hover:border hover:border-border hover:bg-muted"
            >
              <div>
                <p>
                  {selectedExercices.find((sEx) => sEx.id === exercice.id)
                    ?.order ?? "-"}
                </p>
              </div>
              <p>{exercice.name}</p>
              {selectedExercices.find((sEx) => sEx.id === exercice.id) ? (
                <Button
                  type="button"
                  onClick={() => {
                    setSelectedExercices((old) =>
                      old.filter(({ id }) => id !== exercice.id)
                    )
                  }}
                >
                  Supprimer
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => {
                    setSelectedExercices((old) => [
                      ...old,
                      {
                        id: exercice.id,
                        order: (old?.length ?? 0) + 1,
                      },
                    ])
                  }}
                >
                  Ajouter
                </Button>
              )}
            </li>
          ))}
        </ul>
        <DialogFooter>
          <Button
            type="button"
            onClick={() => {
              onConfirm({
                exercices: selectedExercices.map((sEx) => ({
                  order: sEx.order,
                  exerciceId: sEx.id,
                })),
                order:
                  (trainings_exercices?.length ?? 0) +
                  (trainings_superset?.length ?? 0) +
                  1,
                rounds: [],
              })
              setOpen(false)
            }}
          >
            Ajouter les exercices
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
