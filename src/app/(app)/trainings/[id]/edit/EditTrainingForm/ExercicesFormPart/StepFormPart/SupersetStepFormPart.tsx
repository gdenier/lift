import { Fragment, ReactElement, useMemo } from "react"
import { StepFormPartProps } from "../StepFormPart"
import { useFieldArray, useWatch } from "react-hook-form"
import { ResponsiveDialog } from "~/components/ResponsiveDialog"
import { SupersetStepDialogContent } from "./SupersetStepFormpart/SupersetStepDialogContent"
import { ExerciceStepDialogContent } from "./ExerciceStepFormPart/ExerciceStepDialogContent"
import { EditTraining } from "~/lib/db/schema/training/trainings.schema"
import {
  DndListSortableContext,
  SortableItem,
  UseSortableReturn,
} from "~/lib/dnd"

export const SupersetStepFormPart = ({
  stepIndex,
  withSubElement = true,
  ...sortableProps
}: StepFormPartProps & Partial<UseSortableReturn>): ReactElement | null => {
  const superset = useWatch<EditTraining, `steps.${number}.superset`>({
    name: `steps.${stepIndex}.superset`,
  })

  const training = useWatch<EditTraining>()
  const title = useMemo(() => {
    return `Superset ${
      (training.steps
        ?.filter((step) => !!step.superset)
        .findIndex((step) => step.superset?.id === superset?.id) ?? 0) + 1
    }`
  }, [superset?.id, training.steps])

  const exercicesFieldArray = useFieldArray<
    EditTraining,
    `steps.${number}.superset.exercices`
  >({ name: `steps.${stepIndex}.superset.exercices` })

  if (!superset) return null

  return (
    <div className="flex h-fit w-full flex-col gap-4">
      <div className="flex w-full gap-2">
        <p
          className="row-span-2 flex aspect-square h-10 w-10 shrink-0 touch-none select-none items-center justify-center place-self-center rounded bg-primary text-primary-foreground"
          {...sortableProps.attributes}
          {...sortableProps.listeners}
        >
          {stepIndex + 1}
        </p>
        <ResponsiveDialog
          label={title}
          panel={
            <SupersetStepDialogContent stepIndex={stepIndex} title={title} />
          }
        />
      </div>
      {withSubElement ? (
        <ul className="flex flex-col gap-2 pl-12">
          <DndListSortableContext
            items={exercicesFieldArray.fields}
            move={exercicesFieldArray.move}
          >
            {exercicesFieldArray.fields.map((field, exerciceIndex) => (
              <Fragment key={field.id}>
                <SortableItem id={field.id}>
                  {({ style, ...sortableProps }, ref) => (
                    <li
                      className="flex w-full gap-2"
                      ref={ref as any}
                      style={style}
                    >
                      <p
                        className="row-span-2 flex aspect-square h-6 w-6 shrink-0 touch-none select-none items-center justify-center place-self-center rounded bg-secondary text-secondary-foreground"
                        {...sortableProps.attributes}
                        {...sortableProps.listeners}
                      >
                        {exerciceIndex + 1}
                      </p>
                      <ResponsiveDialog
                        label={field.exercice.name}
                        panel={
                          <ExerciceStepDialogContent
                            stepIndex={stepIndex}
                            name={`steps.${stepIndex}.superset.exercices.${exerciceIndex}`}
                            mode="superset"
                          />
                        }
                      />
                    </li>
                  )}
                </SortableItem>
              </Fragment>
            ))}
          </DndListSortableContext>
        </ul>
      ) : null}
    </div>
  )
}
