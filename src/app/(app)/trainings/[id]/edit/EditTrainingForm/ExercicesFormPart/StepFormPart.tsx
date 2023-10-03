"use client"

import { ReactElement } from "react"
import { useWatch } from "react-hook-form"
import { EditTraining } from "~/lib/db/schema"
import { ExerciceStepFormPart } from "./StepFormPart/ExerciceStepFormPart"
import { SupersetStepFormPart } from "./StepFormPart/SupersetStepFormPart"

export interface StepFormPartProps {
  stepIndex: number
}

export const StepFormPart = ({
  stepIndex,
}: StepFormPartProps): ReactElement => {
  const step = useWatch<EditTraining, `steps.${number}`>({
    name: `steps.${stepIndex}`,
  })

  return (
    <li>
      {step.superset != null ? (
        <SupersetStepFormPart stepIndex={stepIndex} />
      ) : (
        <ExerciceStepFormPart stepIndex={stepIndex} />
      )}
    </li>
  )
}
