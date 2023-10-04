import { ReactElement, useState } from "react"
import { UseFieldArrayReturn } from "react-hook-form"
import { useFieldArrayContext } from "~/components/FieldArrayContext"
import { Button } from "~/components/ui/button"
import {
  DialogHeader,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog"
import { EditTraining, Exercice, exercices } from "~/lib/db/schema"

export const AddSupersetExerciceDialog = ({
  exercices,
  fieldArray,
}: {
  exercices: Exercice[]
  fieldArray: UseFieldArrayReturn<
    EditTraining,
    `steps.${number}.superset.exercices`
  >
}): ReactElement | null => {
  const [open, setOpen] = useState(false)

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
                  fieldArray.append({
                    exercice: exercice,
                    exerciceId: exercice.id,
                    order: fieldArray.fields.length,
                    series: fieldArray.fields[
                      fieldArray.fields.length - 1
                    ].series?.map(
                      ({ id, trainingExerciceId, ...serie }) => serie
                    ),
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
