import { DndContext, UniqueIdentifier, closestCenter } from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { ReactElement, ReactNode } from "react"
import { useSortableDragSensor } from "../hooks/useDragSensor"

export const DndListSortableContext = ({
  children,
  items,
  move,
}: {
  children: ReactNode
  items: (UniqueIdentifier | { id: UniqueIdentifier })[]
  move: (before: number, after: number) => void
}): ReactElement | null => {
  const sensors = useSortableDragSensor()

  return (
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
            move(activeIndex, overIndex)
          }
        }
      }}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  )
}
