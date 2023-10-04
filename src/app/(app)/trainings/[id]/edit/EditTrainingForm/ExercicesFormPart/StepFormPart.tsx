"use client"

import { ReactElement, Ref, forwardRef } from "react"
import { useWatch } from "react-hook-form"
import { EditTraining, Exercice } from "~/lib/db/schema"
import { ExerciceStepFormPart } from "./StepFormPart/ExerciceStepFormPart"
import { SupersetStepFormPart } from "./StepFormPart/SupersetStepFormPart"
import { SortableItem, UseSortableReturn } from "~/lib/dnd"

export interface StepFormPartProps {
  stepIndex: number
  withSubElement?: boolean
  exercices: Exercice[]
}

// eslint-disable-next-line react/display-name
export const StepFormPart = forwardRef<
  HTMLLIElement,
  StepFormPartProps & Partial<UseSortableReturn>
>(({ stepIndex, style, exercices, ...sortableProps }, ref): ReactElement => {
  const step = useWatch<EditTraining, `steps.${number}`>({
    name: `steps.${stepIndex}`,
  })

  return (
    <li ref={ref} style={style}>
      {step.superset != null ? (
        <SupersetStepFormPart
          stepIndex={stepIndex}
          exercices={exercices}
          {...sortableProps}
        />
      ) : (
        <ExerciceStepFormPart stepIndex={stepIndex} {...sortableProps} />
      )}
    </li>
  )
})
