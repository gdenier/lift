"use client"
import { useFormContext, useWatch } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { EditTrainingSchema } from "~/lib/db/schema"
import { Input } from "~/components/ui/input"
import { RepOrTimeField } from "../RepOrTimeField"

export const SupersetSerieField = ({
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
