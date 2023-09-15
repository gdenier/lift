import {
  OnDragEndResponder,
  OnDragStartResponder,
  OnDragUpdateResponder,
} from "react-beautiful-dnd"
import { getDraggedDom } from ".."
import { useState } from "react"

interface PlaceholderProps {
  clientY: number
  clientX: number
  clientHeight: number
  clientWidth: number
}

interface useDraggableReturnValue {
  handleDragStart: OnDragStartResponder
  handleDragEnd: OnDragEndResponder
  handleDragUpdate: OnDragUpdateResponder
  placeholderProps: PlaceholderProps | undefined
}

export const useDraggable = ({
  onDragEnd,
}: {
  onDragEnd: OnDragEndResponder
}): useDraggableReturnValue => {
  const [placeholderProps, setPlaceholderProps] = useState<
    PlaceholderProps | undefined
  >()

  const handleDragStart: OnDragStartResponder = (event) => {
    const draggedDOM = getDraggedDom(event.draggableId)

    if (!draggedDOM) {
      return
    }

    const { clientHeight, clientWidth } = draggedDOM
    const sourceIndex = event.source.index
    var clientY =
      parseFloat(
        window.getComputedStyle(draggedDOM.parentNode as Element).paddingTop
      ) +
      [...(draggedDOM.parentNode as Element).children]
        .slice(0, sourceIndex)
        .reduce((total, curr) => {
          const style: CSSStyleDeclaration =
            (curr as any).currentStyle || window.getComputedStyle(curr)
          const marginBottom = parseFloat(style.marginBottom)
          return total + curr.clientHeight + marginBottom
        }, 0)

    setPlaceholderProps({
      clientHeight,
      clientWidth,
      clientY,
      clientX: parseFloat(
        window.getComputedStyle(draggedDOM.parentNode as Element).paddingLeft
      ),
    })
  }

  const handleDragEnd: OnDragEndResponder = (result, provided) => {
    setPlaceholderProps(undefined)
    onDragEnd(result, provided)
  }

  const handleDragUpdate: OnDragUpdateResponder = (event) => {
    if (!event.destination) {
      return
    }

    const draggedDOM = getDraggedDom(event.draggableId)

    if (!draggedDOM) {
      return
    }

    const { clientHeight, clientWidth } = draggedDOM
    const destinationIndex = event.destination.index
    const sourceIndex = event.source.index

    const childrenArray = [...(draggedDOM.parentNode as Element).children]
    const movedItem = childrenArray[sourceIndex]
    childrenArray.splice(sourceIndex, 1)

    const updatedArray = [
      ...childrenArray.slice(0, destinationIndex),
      movedItem,
      ...childrenArray.slice(destinationIndex + 1),
    ]

    var clientY =
      parseFloat(
        window.getComputedStyle(draggedDOM.parentNode as Element).paddingTop
      ) +
      updatedArray.slice(0, destinationIndex).reduce((total, curr) => {
        const style: CSSStyleDeclaration =
          (curr as any).currentStyle || window.getComputedStyle(curr)
        const marginBottom = parseFloat(style.marginBottom)
        return total + curr.clientHeight + marginBottom
      }, 0)

    setPlaceholderProps({
      clientHeight,
      clientWidth,
      clientY,
      clientX: parseFloat(
        window.getComputedStyle(draggedDOM.parentNode as Element).paddingLeft
      ),
    })
  }

  return {
    handleDragStart,
    handleDragEnd,
    handleDragUpdate,
    placeholderProps,
  }
}
