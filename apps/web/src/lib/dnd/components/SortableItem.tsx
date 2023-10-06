import { useSortable } from "@dnd-kit/sortable"
import { CSSProperties, ForwardedRef, ReactElement } from "react"
import { CSS } from "@dnd-kit/utilities"

export type UseSortableReturn = Omit<
  ReturnType<typeof useSortable>,
  "setNodeRef" | "transform" | "transition"
> & {
  style: CSSProperties | undefined
}

export const SortableItem = (props: {
  id: string
  children: (
    args: UseSortableReturn,
    ref: ForwardedRef<HTMLElement | null>
  ) => React.ReactNode
}): ReactElement | null => {
  const { setNodeRef, transform, transition, ...rest } = useSortable({
    id: props.id,
  })
  const style = {
    opacity: rest.isDragging ? "0.8" : "1",
    transform: CSS.Translate.toString(transform),
    transition: transition,
  }

  return <>{props.children({ ...rest, style }, setNodeRef)}</>
}
