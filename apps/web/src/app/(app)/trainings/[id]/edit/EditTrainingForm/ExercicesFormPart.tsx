"use client"

import { Fragment, ReactElement, useState } from "react"
import { useFieldArray } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { EditTraining, Exercice } from "~/lib/db/schema"
import { AddExerciceDialog } from "./ExercicesFormPart/AddExerciceDialog"
import { AddSupersetDialog } from "./ExercicesFormPart/AddSupersetDialog"
import { FieldArrayContextProvider } from "~/components/FieldArrayContext"
import { StepFormPart } from "./ExercicesFormPart/StepFormPart"
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  UniqueIdentifier,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { DndListSortableContext, SortableItem } from "~/lib/dnd"
import { useSortableDragSensor } from "~/lib/dnd/hooks/useDragSensor"

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
            <DndListSortableContext
              items={stepFieldArray.fields}
              move={stepFieldArray.move}
            >
              {stepFieldArray.fields.map((step, index) => (
                <Fragment key={step.id}>
                  <SortableItem id={step.id}>
                    {(props, ref) => (
                      <StepFormPart
                        stepIndex={index}
                        exercices={exercices}
                        ref={ref as any}
                        {...props}
                      />
                    )}
                  </SortableItem>
                </Fragment>
              ))}
            </DndListSortableContext>
          </ul>
        </CardContent>
      </Card>
    </FieldArrayContextProvider>
  )
}
