import { Trash } from "lucide-react"
import { ReactElement } from "react"
import { Button } from "~/components/ui/button"
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "~/components/ui/sheet"
import { StepFormPartProps } from "../../StepFormPart"
import { useFieldArrayContext } from "~/components/FieldArrayContext"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { useFormContext } from "react-hook-form"
import { EditTraining } from "~/lib/db/schema"

export const SupersetStepDialogContent = ({
  stepIndex,
  title,
}: StepFormPartProps & { title: string }): ReactElement | null => {
  const stepFieldArray = useFieldArrayContext("steps")
  const form = useFormContext<EditTraining>()

  const handleNbRoundUpdate = (newNbRound: number) => {
    const oldNbRound = form.getValues(`steps.${stepIndex}.superset.nbRound`)
    if (newNbRound === oldNbRound) return

    const exercices = form.getValues(`steps.${stepIndex}.superset.exercices`)
    exercices?.forEach((exercice, exerciceIndex) => {
      const series = form.getValues(
        `steps.${stepIndex}.superset.exercices.${exerciceIndex}.series`
      )
      if (newNbRound > oldNbRound) {
        for (let i = 0; i < newNbRound - oldNbRound; i++) {
          series?.push({
            ...(series[series.length - 1] ?? {
              repetition: 10,
              rest: 120,
            }),
            id: undefined,
          })
        }
      }
      form.setValue(
        `steps.${stepIndex}.superset.exercices.${exerciceIndex}.series`,
        series
      )
    })
  }

  return (
    <>
      <SheetHeader>
        <SheetTitle className="first-letter:uppercase">{title}</SheetTitle>
        <SheetDescription>
          Modifier les paramètres du superset.
        </SheetDescription>
      </SheetHeader>
      <div className="flex-1 overflow-y-auto">
        <FormField
          name={`steps.${stepIndex}.superset.nbRound`}
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Nombre de tour</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="3"
                  value={value ?? ""}
                  onChange={(e) => {
                    handleNbRoundUpdate(+e.target.value)
                    onChange(e)
                  }}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name={`steps.${stepIndex}.superset.rest`}
          render={({ field: { value, ...field } }) => (
            <FormItem>
              <FormLabel>Repos entre les tours</FormLabel>
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
        <FormField
          name={`steps.${stepIndex}.superset.intervalRest`}
          render={({ field: { value, ...field } }) => (
            <FormItem>
              <FormLabel>Repos entre les exercices</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="15"
                  value={value ?? ""}
                  {...field}
                />
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
          onClick={() => stepFieldArray.remove(stepIndex)}
        >
          <Trash />
        </Button>
      </SheetFooter>
    </>
  )
}
