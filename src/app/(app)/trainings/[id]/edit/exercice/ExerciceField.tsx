"use client"
import { Trash } from "lucide-react"
import { useEffect } from "react"
import { UseFieldArrayRemove, useFormContext } from "react-hook-form"
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
import { RepOrTimeField } from "../RepOrTimeField"

export const ExerciceField = ({
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
