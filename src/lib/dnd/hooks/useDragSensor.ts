import {
  KeyboardSensor,
  PointerSensor,
  SensorDescriptor,
  SensorOptions,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"

export const useSortableDragSensor = (): SensorDescriptor<SensorOptions>[] => {
  return useSensors(
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
}
