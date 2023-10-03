import { ReactElement } from "react"
import { StepFormPartProps } from "../StepFormPart"
import { useWatch } from "react-hook-form"
import { ResponsiveDialog } from "~/components/ResponsiveDialog"
import { ExerciceStepDialogContent } from "./ExerciceStepFormPart/ExerciceStepDialogContent"
import { EditTraining } from "~/lib/db/schema/training/trainings.schema"

export const ExerciceStepFormPart = ({
  stepIndex,
}: StepFormPartProps): ReactElement | null => {
  const exercice = useWatch<EditTraining, `steps.${number}.exercice`>({
    name: `steps.${stepIndex}.exercice`,
  })

  if (!exercice) return null

  return (
    <div className="flex w-full gap-2">
      <p className=" row-span-2 flex aspect-square h-10 w-10 shrink-0 items-center justify-center place-self-center rounded bg-primary text-primary-foreground">
        {stepIndex + 1}
      </p>
      <ResponsiveDialog
        label={
          <>
            <p className="first-letter:uppercase">{exercice.exercice.name}</p>
            <p>({exercice.series?.length ?? 0} séries)</p>
          </>
        }
        panel={
          <ExerciceStepDialogContent
            stepIndex={stepIndex}
            name={`steps.${stepIndex}.exercice`}
          />
        }
      />
    </div>
  )
}
