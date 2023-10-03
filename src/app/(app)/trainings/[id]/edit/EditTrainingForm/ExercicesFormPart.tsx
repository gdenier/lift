"use client"

import { ReactElement } from "react"
import { useFieldArray } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { EditTraining, Exercice } from "~/lib/db/schema"
import { AddExerciceDialog } from "./ExercicesFormPart/AddExerciceDialog"
import { AddSupersetDialog } from "./ExercicesFormPart/AddSupersetDialog"
import { FieldArrayContextProvider } from "~/components/FieldArrayContext"
import { StepFormPart } from "./ExercicesFormPart/StepFormPart"

export const ExercicesFormPart = ({
  exercices,
}: {
  exercices: Exercice[]
}): ReactElement => {
  const stepFieldArray = useFieldArray<EditTraining, "steps">({ name: "steps" })

  return (
    <FieldArrayContextProvider fields={{ steps: stepFieldArray }}>
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Exercices</CardTitle>
          <div className="flex gap-1">
            <AddExerciceDialog exercices={exercices} />
            <AddSupersetDialog exercices={exercices} />
          </div>
        </CardHeader>
        <CardContent>
          <ul className="flex w-full flex-col gap-8">
            {stepFieldArray.fields.map((step, index) => (
              <StepFormPart key={step.id} stepIndex={index} />
            ))}
          </ul>
        </CardContent>
      </Card>
    </FieldArrayContextProvider>
  )
}
