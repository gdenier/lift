import { ReactElement, useCallback } from "react"
import { StepFormPartProps } from "../../StepFormPart"
import { useFieldArray, useFormContext, useWatch } from "react-hook-form"
import { EditTraining } from "~/lib/db/schema"
import {
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet"
import { index } from "drizzle-orm/mysql-core"
import { Trash } from "lucide-react"
import { Button } from "~/components/ui/button"
import { useFieldArrayContext } from "~/components/FieldArrayContext"
import { RepOrTimeField } from "../../../../RepOrTimeField"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"

export const ExerciceStepDialogContent = ({
  stepIndex,
}: StepFormPartProps): ReactElement | null => {
  const form = useFormContext<EditTraining>()
  const exercice = useWatch<EditTraining, `steps.${number}.exercice`>({
    name: `steps.${stepIndex}.exercice`,
  })
  const stepFieldArray = useFieldArrayContext("steps")
  const seriesFieldArray = useFieldArray<
    EditTraining,
    `steps.${number}.exercice.series`
  >({ name: `steps.${stepIndex}.exercice.series` })

  const addSerie = () => {
    console.log(seriesFieldArray.fields)
    const lastSerie = form.getValues(
      `steps.${stepIndex}.exercice.series.${seriesFieldArray.fields.length - 1}`
    )
    seriesFieldArray.append({
      // copy the last one or default values
      ...(lastSerie ?? {
        repetition: 10,
        rest: 120,
      }),
      order: seriesFieldArray.fields.length,
    })
  }

  if (!exercice) return null

  return (
    <>
      <SheetHeader>
        <SheetTitle className="first-letter:uppercase">
          {exercice.exercice.name}
        </SheetTitle>
        <SheetDescription>
          Ajouter, modifier, supprimer vos séries
        </SheetDescription>
      </SheetHeader>
      <div className="flex-1 overflow-y-auto">
        {seriesFieldArray.fields.map((field, serieIndex) => (
          <li
            key={field.id}
            className="flex w-full items-end justify-between gap-1"
          >
            <RepOrTimeField
              name={`steps.${stepIndex}.exercice.series.${serieIndex}`}
            />
            <FormField
              control={form.control}
              name={`steps.${stepIndex}.exercice.series.${serieIndex}.weight`}
              render={({ field: { value, ...field } }) => (
                // TODO: Custom Weight input
                <FormItem>
                  <FormLabel>Poids (gramme)</FormLabel>
                  <FormControl>
                    {/* FIXME: resolve null typing error from zod schema */}
                    <Input
                      type="number"
                      placeholder="5000"
                      value={value ?? ""}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`steps.${stepIndex}.exercice.series.${serieIndex}.rest`}
              render={({ field: { value, ...field } }) => (
                <FormItem>
                  <FormLabel>Repos (seconde)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="120"
                      value={value ?? ""}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => seriesFieldArray.remove(serieIndex)}
              className="shrink-0"
            >
              <Trash />
            </Button>
          </li>
        ))}
        <Button
          variant="outline"
          type="button"
          className="mt-4 w-full"
          onClick={addSerie}
        >
          Ajouter une série
        </Button>
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
          onClick={() => stepFieldArray.remove(stepIndex)}
        >
          <Trash />
        </Button>
      </SheetFooter>
    </>
  )
}
