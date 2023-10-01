// "use client"

// import { ReactElement, useCallback, useEffect, useState } from "react"
// import {
//   FieldArrayWithId,
//   useFieldArray,
//   useFormContext,
// } from "react-hook-form"
// import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
// import { EditTrainingSchema, Exercice } from "~/lib/db/schema"
// import { ExerciceFormPart } from "./exercice/ExerciceFormPart"
// import { AddExerciceDialog } from "./EditTrainingForm/ExercicesFormPart/AddExerciceDialog"
// import { SupersetFormPart } from "./superset/SupersetFormPart"
// import {
//   DragDropContext,
//   Droppable,
//   OnDragEndResponder,
// } from "react-beautiful-dnd"
// import { useDraggable } from "~/lib/dnd/hooks/useDraggable"
// import { AddSupersetDialog } from "./EditTrainingForm/ExercicesFormPart/AddSupersetDialog"

// export const ExercicesFormPart = ({
//   exercices,
// }: {
//   exercices: Exercice[]
// }): ReactElement => {
//   const {
//     fields: training_exercices,
//     append: appendExercice,
//     remove: removeExercice,
//   } = useFieldArray<EditTrainingSchema, "trainings_exercices">({
//     name: "trainings_exercices",
//   })
//   const supersetFieldArray = useFieldArray<
//     EditTrainingSchema,
//     "trainings_supersets"
//   >({
//     name: "trainings_supersets",
//   })

//   const {
//     fields: training_supersets,
//     append: appendSuperset,
//     remove: removeSuperset,
//   } = supersetFieldArray

//   const form = useFormContext<EditTrainingSchema>()

//   const reorderTrainingParts = useCallback(
//     (
//       exercices: FieldArrayWithId<EditTrainingSchema, "trainings_exercices">[],
//       supersets: FieldArrayWithId<EditTrainingSchema, "trainings_supersets">[]
//     ) => {
//       const parts: {
//         index: number
//         field:
//           | FieldArrayWithId<EditTrainingSchema, "trainings_exercices">
//           | FieldArrayWithId<EditTrainingSchema, "trainings_supersets">
//       }[] = []
//       parts.push(
//         ...(exercices?.map((tEx, index) => ({ index, field: tEx })) ?? [])
//       )
//       parts.push(
//         ...(supersets?.map((tEx, index) => ({ index, field: tEx })) ?? [])
//       )
//       parts.sort((a, b) => a.field.order - b.field.order)
//       parts.forEach((part, index) => {
//         if ("rounds" in part.field) {
//           form.setValue(`trainings_supersets.${part.index}.order`, index + 1)
//         } else {
//           form.setValue(`trainings_exercices.${part.index}.order`, index + 1)
//         }
//         parts[index].field.order = index + 1
//       })
//       return parts
//     },
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     []
//   )

//   const [training_parts, setTrainingParts] = useState<
//     {
//       index: number
//       field:
//         | FieldArrayWithId<EditTrainingSchema, "trainings_exercices">
//         | FieldArrayWithId<EditTrainingSchema, "trainings_supersets">
//     }[]
//   >()
//   useEffect(() => {
//     setTrainingParts(
//       reorderTrainingParts(training_exercices, training_supersets)
//     )
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [
//     training_exercices.length,
//     training_supersets.length,
//     reorderTrainingParts,
//   ])

//   const handleDrag: OnDragEndResponder = ({ source, destination }) => {
//     if (!destination || !training_parts || source.index == destination.index)
//       return

//     const sourcePart = structuredClone(training_parts[source.index])
//     const destinationPart = structuredClone(training_parts[destination.index])

//     const start =
//       source.index > destination.index ? destination.index : source.index + 1
//     const end =
//       source.index > destination.index ? source.index : destination.index + 1

//     training_parts?.slice(start, end).forEach((part) => {
//       const name =
//         "rounds" in part.field
//           ? `trainings_supersets.${part.index}.order`
//           : `trainings_exercices.${part.index}.order`
//       const updatedOrder =
//         form.getValues(name as any) +
//         (source.index > destination.index ? 1 : -1)
//       form.setValue(name as any, updatedOrder)
//     })

//     if ("rounds" in sourcePart.field) {
//       form.setValue(
//         `trainings_supersets.${sourcePart.index}.order`,
//         destinationPart.field.order
//       )
//     } else {
//       form.setValue(
//         `trainings_exercices.${sourcePart.index}.order`,
//         destinationPart.field.order
//       )
//     }

//     setTrainingParts(() =>
//       reorderTrainingParts(
//         (form.getValues("trainings_exercices") ?? []) as FieldArrayWithId<
//           EditTrainingSchema,
//           "trainings_exercices"
//         >[],
//         (form.getValues("trainings_supersets") ?? []) as FieldArrayWithId<
//           EditTrainingSchema,
//           "trainings_supersets"
//         >[]
//       )
//     )
//   }

//   const draggable = useDraggable({ onDragEnd: handleDrag })

//   return (
//     <Card>
//       <CardHeader className="flex-row items-center justify-between">
//         <CardTitle>Exercices</CardTitle>
//         <div className="flex gap-1">
//           <AddExerciceDialog exercices={exercices} onConfirm={appendExercice} />
//           <AddSupersetDialog exercices={exercices} onConfirm={appendSuperset} />
//         </div>
//       </CardHeader>
//       <CardContent>
//         <DragDropContext
//           onDragEnd={(result, provided) => {
//             draggable.handleDragEnd(result, provided)
//           }}
//           onDragStart={draggable.handleDragStart}
//           onDragUpdate={draggable.handleDragUpdate}
//         >
//           <Droppable droppableId="droppable-exercices">
//             {(provided, snapshot) => (
//               <ul
//                 {...provided.droppableProps}
//                 ref={provided.innerRef}
//                 className="flex w-full flex-col gap-2"
//               >
//                 {training_parts?.map(({ field, index: partIndex }, index) => {
//                   if ("rounds" in field) {
//                     return (
//                       <SupersetFormPart
//                         key={`exercices-item-${index}`}
//                         exercices={exercices}
//                         field={field}
//                         superSetIndex={partIndex}
//                         listIndex={index}
//                         supersetFieldArray={supersetFieldArray}
//                       />
//                     )
//                   }
//                   return (
//                     <ExerciceFormPart
//                       key={`exercices-item-${index}`}
//                       exercices={exercices}
//                       field={field}
//                       exerciceIndex={partIndex}
//                       listIndex={index}
//                       removeExercice={removeExercice}
//                     />
//                   )
//                 })}
//                 {provided.placeholder}
//                 {!draggable.placeholderProps === undefined &&
//                   snapshot.isDraggingOver && (
//                     <div
//                       className="placeholder"
//                       style={{
//                         top: draggable.placeholderProps?.clientY,
//                         left: draggable.placeholderProps?.clientX,
//                         height: draggable.placeholderProps?.clientHeight,
//                         width: draggable.placeholderProps?.clientWidth,
//                       }}
//                     />
//                   )}
//               </ul>
//             )}
//           </Droppable>
//         </DragDropContext>
//       </CardContent>
//     </Card>
//   )
// }
