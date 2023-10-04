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
import { SortableItem } from "~/lib/dnd"

export const ExercicesFormPart = ({
  exercices,
}: {
  exercices: Exercice[]
}): ReactElement => {
  const stepFieldArray = useFieldArray<EditTraining, "steps">({ name: "steps" })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

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
            <DndContext
              sensors={sensors}
              modifiers={[restrictToVerticalAxis]}
              collisionDetection={closestCenter}
              onDragEnd={(event) => {
                const { active, over } = event
                if (over && active.id !== over?.id) {
                  const activeIndex = active.data.current?.sortable?.index
                  const overIndex = over.data.current?.sortable?.index
                  if (activeIndex !== undefined && overIndex !== undefined) {
                    stepFieldArray.move(activeIndex, overIndex)
                  }
                }
              }}
            >
              <SortableContext
                items={stepFieldArray.fields}
                strategy={verticalListSortingStrategy}
              >
                {stepFieldArray.fields.map((step, index) => (
                  <Fragment key={step.id}>
                    <SortableItem id={step.id}>
                      {(props, ref) => (
                        <StepFormPart
                          stepIndex={index}
                          ref={ref as any}
                          {...props}
                        />
                      )}
                    </SortableItem>
                  </Fragment>
                ))}
              </SortableContext>
            </DndContext>
          </ul>
        </CardContent>
      </Card>
    </FieldArrayContextProvider>
  )
}
