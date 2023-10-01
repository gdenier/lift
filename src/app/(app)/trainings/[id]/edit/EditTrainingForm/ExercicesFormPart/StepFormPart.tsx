"use client"

import { ReactElement } from "react"
import { useWatch } from "react-hook-form"
import { EditTraining } from "~/lib/db/schema"
import { ExerciceStepFormPart } from "./StepFormPart/ExerciceStepFormPart"

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
        <></>
      ) : (
        <ExerciceStepFormPart stepIndex={stepIndex} />
      )}
    </li>
  )
}
