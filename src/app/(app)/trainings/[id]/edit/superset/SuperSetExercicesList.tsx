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
import { sortByOrder } from "~/lib/utils"

export const SuperSetExercicesList = ({
  exerciceFieldArray,
  exercices,
  superSetIndex,
  supersetFieldArray,
}: {
  exerciceFieldArray: UseFieldArrayReturn<
    EditTrainingSchema,
    `trainings_supersets.${number}.exercices`
  >
  supersetFieldArray: UseFieldArrayReturn<
    EditTrainingSchema,
    `trainings_supersets`
  >
  exercices: Exercice[]
  superSetIndex: number
}): ReactElement => {
  const form = useFormContext<EditTrainingSchema>()

  const handleDrag: OnDragEndResponder = ({ source, destination }) => {
    if (!destination || source.index == destination.index) return

    let superset = structuredClone(
      form.getValues(`trainings_supersets.${superSetIndex}`)
    )

    console.log("initial", superset)

    superset = {
      ...superset,
      exercices: sortByOrder(superset.exercices).map((supersetExercice) => ({
        ...supersetExercice,
      })),
      rounds: sortByOrder(superset.rounds).map((round) => ({
        ...round,
        series: sortByOrder(round.series),
      })),
    }

    const sourceElement = superset.exercices.splice(source.index, 1)[0]
    console.log("middle", superset)
    superset.exercices.splice(destination.index, 0, sourceElement)

    superset.rounds.forEach((_, roundIndex) => {
      const sourceSerie = superset.rounds[roundIndex].series.splice(
        source.index,
        1
      )[0]
      superset.rounds[roundIndex].series.splice(
        destination.index,
        0,
        sourceSerie
      )
    })

    superset = {
      ...superset,
      exercices: sortByOrder(superset.exercices).map(
        (supersetExercice, index) => ({
          ...supersetExercice,
          order: index + 1,
        })
      ),
      rounds: sortByOrder(superset.rounds).map((round) => ({
        ...round,
        series: sortByOrder(round.series).map((serie, index) => ({
          ...serie,
          order: index + 1,
        })),
      })),
    }

    console.log("finnaly", superset)

    // finally: trigger fieldArray rerender
    supersetFieldArray.update(superSetIndex, superset)
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
