const QUERY_ATTRIBUTE = "data-rbd-drag-handle-draggable-id"

export const getDraggedDom = (draggableId: string) => {
  const domQuery = `[${QUERY_ATTRIBUTE}='${draggableId}']`
  const draggedDOM = document.querySelector(domQuery)

  return draggedDOM
}
