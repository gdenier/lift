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
import { ReactElement, useState } from "react"
import {
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFieldArrayReplace,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form"
import { Button } from "~/components/ui/button"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { EditTrainingSchema, Exercice, TrainingSuperset } from "~/lib/db/schema"
import { ResponsiveDialog } from "~/components/ResponsiveDialog"
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "~/components/ui/sheet"
import { Trash } from "lucide-react"
import { Input } from "~/components/ui/input"
import { RepOrTimeField } from "./ExercicesFormPart"

export const SupersetFormPart = ({
  field,
  index,
  exercices,
  removeSuperset,
}: {
  field: FieldArrayWithId<EditTrainingSchema, "trainings_supersets">
  removeSuperset: UseFieldArrayRemove
  index: number
  exercices: Exercice[]
}): ReactElement => {
  const form = useFormContext<EditTrainingSchema>()

  const roundFieldArray = useFieldArray<
    EditTrainingSchema,
    `trainings_supersets.${number}.rounds`
  >({ name: `trainings_supersets.${index}.rounds` })

  const exerciceFieldArray = useFieldArray<
    EditTrainingSchema,
    `trainings_supersets.${number}.exercices`
  >({ name: `trainings_supersets.${index}.exercices` })

  return (
    <div
      key={field.id}
      className="flex w-full items-start justify-stretch gap-2"
    >
      <FormField
        control={form.control}
        name={`trainings_supersets.${index}.order`}
        render={({ field }) => (
          <p className="flex aspect-square h-10 w-10 shrink-0 items-center justify-center rounded bg-primary text-primary-foreground">
            {field.value}
          </p>
        )}
      />
      <div className="w-full">
        <div className="flex w-full gap-2">
          <SupersetSettingsDialog
            index={index}
            removeSuperset={removeSuperset}
            superset={field}
            replaceRound={roundFieldArray.replace}
          />
          <SupersetAddExerciceDialog
            exercices={exercices}
            supersetIndex={index}
          />
        </div>
        <ul>
          {exerciceFieldArray.fields
            .sort((a, b) => a.order - b.order)
            .map((exercice) => (
              <li key={exercice.id}>
                <SupersetExerciceDialog
                  exercice={
                    exercices.find((ex) => ex.id === exercice.exerciceId)!
                  }
                  supersetIndex={index}
                  removeExercice={() => {
                    exerciceFieldArray.remove(
                      exerciceFieldArray.fields.findIndex(
                        (f) => f.order === exercice.order
                      )
                    )
                  }}
                />
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
  onConfirm: UseFieldArrayAppend<EditTrainingSchema, "trainings_supersets">
  exercices: Exercice[]
}) => {
  const [open, setOpen] = useState(false)
  const trainings_supersets = useWatch<
    EditTrainingSchema,
    "trainings_supersets"
  >({ name: "trainings_supersets" })
  const trainings_exercices = useWatch<
    EditTrainingSchema,
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
                  (trainings_supersets?.length ?? 0) +
                  1,
                intervalRest: 0,
                rest: 60, // use default rest time of account
                rounds: [],
              })
              setSelectedExercices([])
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

const SupersetAddExerciceDialog = ({
  exercices,
  supersetIndex,
}: {
  exercices: Exercice[]
  supersetIndex: number
}) => {
  const [open, setOpen] = useState(false)

  const [selectedExercices, setSelectedExercices] = useState<
    { id: string; order: number }[]
  >([])

  const form = useFormContext<EditTrainingSchema>()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" className="min-w-fit">
          Ajouter un exercice
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter les exercices</DialogTitle>
          <DialogDescription>
            Les exercices séléctionnés seront ajouter dans le superset.
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
              const supersetExercices = form.getValues(
                `trainings_supersets.${supersetIndex}.exercices`
              )
              supersetExercices.push(
                ...selectedExercices.map((selectedExercice, index) => ({
                  exerciceId: selectedExercice.id,
                  order: supersetExercices.length + 1 + index,
                }))
              )
              console.log(supersetExercices)
              form.setValue(
                `trainings_supersets.${supersetIndex}.exercices`,
                supersetExercices
              )
              let supersetRounds = form.getValues(
                `trainings_supersets.${supersetIndex}.rounds`
              )
              supersetRounds = supersetRounds.map((round) => {
                round.series.push(
                  ...selectedExercices.map((selectedExercice) => ({
                    order: supersetExercices.find(
                      (supersetExercice) =>
                        supersetExercice.exerciceId === selectedExercice.id
                    )?.order as number,
                  }))
                )
                return round
              })
              console.log(supersetRounds)
              form.setValue(
                `trainings_supersets.${supersetIndex}.rounds`,
                supersetRounds
              )
              setSelectedExercices([])
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

const SupersetSettingsDialog = ({
  index,
  superset,
  removeSuperset,
  replaceRound,
}: {
  index: number
  superset: FieldArrayWithId<EditTrainingSchema, "trainings_supersets">
  removeSuperset: UseFieldArrayRemove
  replaceRound: UseFieldArrayReplace<
    EditTrainingSchema,
    `trainings_supersets.${number}.rounds`
  >
}) => {
  const form = useFormContext<EditTrainingSchema>()
  const rounds = useWatch<
    EditTrainingSchema,
    `trainings_supersets.${number}.rounds`
  >({ name: `trainings_supersets.${index}.rounds` })
  const supersetExercices = useWatch<
    EditTrainingSchema,
    `trainings_supersets.${number}.exercices`
  >({ name: `trainings_supersets.${index}.exercices` })

  return (
    <ResponsiveDialog
      label={
        <>
          <p className="first-letter:uppercase">Super set {index + 1}</p>
          <p>({rounds.length} rounds)</p>
        </>
      }
      panel={
        <>
          <SheetHeader>
            <SheetTitle className="first-letter:uppercase">
              Super set {index + 1}
            </SheetTitle>
            <SheetDescription>
              Modifier les paramètres du superset.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto">
            <FormItem>
              <FormLabel>Nombre de rounds</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="3"
                  defaultValue={rounds.length}
                  onChange={(event) => {
                    const nbRound = +event.target.value
                    console.log(nbRound)
                    if (nbRound > rounds.length) {
                      let order = rounds.length
                      return replaceRound([
                        ...rounds,
                        ...Array(nbRound - rounds.length).fill({
                          order: ++order,
                          series: supersetExercices.map((ex) => ({
                            order: ex.order,
                          })),
                        }),
                      ])
                    }
                    replaceRound(rounds.slice(0, nbRound))
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
            <FormField
              control={form.control}
              name={`trainings_supersets.${index}.rest`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repos entre les rounds (seconde)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="120" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`trainings_supersets.${index}.intervalRest`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repos entre exercices (seconde)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="120" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
              onClick={() => removeSuperset(index)}
            >
              <Trash />
            </Button>
          </SheetFooter>
        </>
      }
    />
  )
}

const SupersetExerciceDialog = ({
  exercice,
  supersetIndex,
  removeExercice,
}: {
  exercice: Exercice
  supersetIndex: number
  removeExercice: () => void
}) => {
  const rounds = useWatch<
    EditTrainingSchema,
    `trainings_supersets.${number}.rounds`
  >({ name: `trainings_supersets.${supersetIndex}.rounds` })

  const supersetExercices = useWatch<
    EditTrainingSchema,
    `trainings_supersets.${number}.exercices`
  >({ name: `trainings_supersets.${supersetIndex}.exercices` })

  return (
    <ResponsiveDialog
      label={
        <>
          <p className="first-letter:uppercase">{exercice.name}</p>
        </>
      }
      panel={
        <>
          <SheetHeader>
            <SheetTitle className="first-letter:uppercase">
              {exercice.name}
            </SheetTitle>
            <SheetDescription>
              Modifier les séries de cet exercice.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto">
            <div className="flex w-full flex-col gap-1">
              {rounds.map((round, roundIndex) => (
                <SupersetSerieField
                  key={`superset-${supersetIndex}-${exercice.id}-serie-${roundIndex}`}
                  roundIndex={roundIndex}
                  supersetIndex={supersetIndex}
                  serieIndex={round.series.findIndex(
                    (s) =>
                      s.order ===
                      supersetExercices.find(
                        (ex) => ex.exerciceId === exercice.id
                      )!.order
                  )}
                />
              ))}
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button type="button" className="w-full" variant="secondary">
                Fermer
              </Button>
            </SheetClose>
            <Button variant="destructive" onClick={removeExercice}>
              Supprimer
            </Button>
          </SheetFooter>
        </>
      }
    />
  )
}

const SupersetSerieField = ({
  supersetIndex,
  roundIndex,
  serieIndex,
}: {
  supersetIndex: number
  roundIndex: number
  serieIndex: number
}) => {
  const form = useFormContext<EditTrainingSchema>()

  const serie = useWatch<
    EditTrainingSchema,
    `trainings_supersets.${number}.rounds.${number}.series.${number}`
  >({
    name: `trainings_supersets.${supersetIndex}.rounds.${roundIndex}.series.${serieIndex}`,
  })

  return (
    <li className="flex w-full items-end justify-between gap-1">
      <RepOrTimeField
        name={`trainings_supersets.${supersetIndex}.rounds.${roundIndex}.series.${serieIndex}`}
      />
      <FormField
        control={form.control}
        name={`trainings_supersets.${supersetIndex}.rounds.${roundIndex}.series.${serieIndex}.weight`}
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
    </li>
  )
}
