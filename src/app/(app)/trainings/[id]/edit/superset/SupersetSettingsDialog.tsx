"use client"

import {
  FieldArrayWithId,
  UseFieldArrayRemove,
  UseFieldArrayReplace,
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
import { EditTrainingSchema } from "~/lib/db/schema"
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

export const SupersetSettingsDialog = ({
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
