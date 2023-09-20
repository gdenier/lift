import { ReactElement } from "react"
import { UseFieldArrayReturn, useFormContext, useWatch } from "react-hook-form"
import { EditTrainingSchema, Exercice } from "~/lib/db/schema"
import { SupersetExerciceDialog } from "./SupersetExerciceDialog"
import { buttonVariants } from "~/components/ui/button"
import { EqualIcon, MenuIcon } from "lucide-react"
import { useDraggable } from "~/lib/dnd/hooks/useDraggable"
import {
  DragDropContext,
  Draggable,
  Droppable,
  OnDragEndResponder,
} from "react-beautiful-dnd"

export const SuperSetExercicesList = ({
  exerciceFieldArray,
  exercices,
  superSetIndex,
}: {
  exerciceFieldArray: UseFieldArrayReturn<
    EditTrainingSchema,
    `trainings_supersets.${number}.exercices`
  >
  exercices: Exercice[]
  superSetIndex: number
}): ReactElement => {
  const form = useFormContext<EditTrainingSchema>()

  const handleDrag: OnDragEndResponder = ({ source, destination }) => {
    if (!destination || source.index == destination.index) return

    console.log(
      "INITIAL STATE",
      form.getValues(`trainings_supersets.${superSetIndex}`)
    )

    const direction = source.index - destination.index > 0 ? "top" : "bottom"

    const exerciceIndexes = form
      .getValues(`trainings_supersets.${superSetIndex}.exercices`)
      .sort((a, b) => a.order - b.order)
      .map((ex, index) => ({ index, field: ex }))

    const destinationOrder = exerciceIndexes[destination.index].field.order

    for (
      let index = destination.index;
      index !== source.index;
      index = index + (direction === "bottom" ? -1 : 1)
    ) {
      form.setValue(
        `trainings_supersets.${superSetIndex}.exercices.${exerciceIndexes[index].index}.order`,
        form.getValues(
          `trainings_supersets.${superSetIndex}.exercices.${exerciceIndexes[index].index}.order`
        ) + (direction === "bottom" ? -1 : 1)
      )

      form
        .getValues(`trainings_supersets.${superSetIndex}.rounds`)
        .forEach((round, roundIndex) => {
          console.log("ROUND ---- ", roundIndex)
          const serieIndexes = form
            .getValues(
              `trainings_supersets.${superSetIndex}.rounds.${roundIndex}.series`
            )
            .sort((a, b) => a.order - b.order)
            .map((ex, index) => ({ index, field: ex }))

          console.log("serieIndexes", serieIndexes)

          console.log(
            "serie with previous order",
            form.getValues(
              `trainings_supersets.${superSetIndex}.rounds.${roundIndex}.series.${serieIndexes[index]?.index}.order`
            ),
            "set",
            form.getValues(
              `trainings_supersets.${superSetIndex}.rounds.${roundIndex}.series.${serieIndexes[index]?.index}.order`
            ) + (direction === "bottom" ? -1 : 1)
          )

          form.setValue(
            `trainings_supersets.${superSetIndex}.rounds.${roundIndex}.series.${serieIndexes[index]?.index}.order`,
            form.getValues(
              `trainings_supersets.${superSetIndex}.rounds.${roundIndex}.series.${serieIndexes[index]?.index}.order`
            ) + (direction === "bottom" ? -1 : 1)
          )
          form.setValue(
            `trainings_supersets.${superSetIndex}.rounds.${roundIndex}.series.${serieIndexes[
              source.index
            ]?.index}.order`,
            destinationOrder
          )
        })
    }

    form.setValue(
      `trainings_supersets.${superSetIndex}.exercices.${
        exerciceIndexes[source.index].index
      }.order`,
      destinationOrder
    )

    // finally: trigger fieldArray rerender
    exerciceFieldArray.replace(
      form.getValues(`trainings_supersets.${superSetIndex}.exercices`)
    )
  }

  const draggable = useDraggable({ onDragEnd: handleDrag })

  return (
    <DragDropContext
      onDragEnd={(result, provided) => {
        draggable.handleDragEnd(result, provided)
      }}
      onDragStart={draggable.handleDragStart}
      onDragUpdate={draggable.handleDragUpdate}
    >
      <Droppable droppableId="droppable-superset-exercices">
        {(provided, snapshot) => (
          <ul
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex flex-col gap-2"
          >
            {exerciceFieldArray.fields
              .sort((a, b) => a.order - b.order)
              .map((exercice, listIndex) => (
                <Draggable
                  key={`superset-item-${listIndex}`}
                  draggableId={`superset-item-${listIndex}`}
                  index={listIndex}
                >
                  {(provided, snapshot) => (
                    <li
                      className="flex gap-2"
                      {...provided.draggableProps}
                      ref={provided.innerRef}
                    >
                      <div
                        className={buttonVariants({
                          variant: "secondary",
                          size: "icon",
                        })}
                        {...provided.dragHandleProps}
                      >
                        <MenuIcon />
                      </div>
                      <SupersetExerciceDialog
                        exercice={
                          exercices.find((ex) => ex.id === exercice.exerciceId)!
                        }
                        supersetIndex={superSetIndex}
                        removeExercice={() => {
                          exerciceFieldArray.remove(
                            exerciceFieldArray.fields.findIndex(
                              (f) => f.order === exercice.order
                            )
                          )
                        }}
                      />
                    </li>
                  )}
                </Draggable>
              ))}
            {provided.placeholder}
            {!draggable.placeholderProps === undefined &&
              snapshot.isDraggingOver && (
                <div
                  className="placeholder"
                  style={{
                    top: draggable.placeholderProps?.clientY,
                    left: draggable.placeholderProps?.clientX,
                    height: draggable.placeholderProps?.clientHeight,
                    width: draggable.placeholderProps?.clientWidth,
                  }}
                />
              )}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  )
}
