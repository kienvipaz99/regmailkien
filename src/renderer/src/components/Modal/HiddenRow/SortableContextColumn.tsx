import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Portal } from '@mantine/core'
import type { TColumnsTable } from '@renderer/types'
import { useMemo, useState } from 'react'
import { Column } from 'react-data-grid'
import ColumnItem from './ColumnItem'

interface SortableContextColumnProps<T> {
  arrColumns: TColumnsTable<T>
  onDragEnd?: (newCloumns: string[]) => void
  onClose?: (value: string) => void
}

const SortableContextColumn = <T,>({
  arrColumns,
  onDragEnd,
  onClose
}: SortableContextColumnProps<T>): JSX.Element => {
  const [activeId, setActiveId] = useState<Column<T> | null>(null)
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10 // Enable sort function when dragging 10px   💡 here!!!
      }
    }),
    useSensor(TouchSensor)
  )

  const listItems = useMemo(
    () =>
      (arrColumns ?? [])?.map((item) => {
        const newItem = item as Column<T>
        return newItem?.key
      }),
    [arrColumns]
  )

  const handleDragStart = (event: DragStartEvent): void => {
    setActiveId(event.active.data.current?.item as Column<T>)
  }

  const handleDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event
    if (over && listItems && active.id !== over.id) {
      const oldIndex = listItems.findIndex((item) => item === active.id)
      const newIndex = listItems.findIndex((item) => item === over.id)
      const newArrMoveItem = arrayMove(listItems, oldIndex, newIndex)
      onDragEnd && onDragEnd(newArrMoveItem)
    }
    setActiveId(null)
  }

  const handleDragCancel = (): void => {
    setActiveId(null)
  }

  return (
    <DndContext
      sensors={sensors}
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
      onDragCancel={handleDragCancel}
    >
      <SortableContext
        // disabled={!questions || (questions && questions?.length <= 1)}
        strategy={verticalListSortingStrategy}
        items={listItems}
      >
        {arrColumns?.map((column) => {
          const newColumn = column as Column<T>
          const key = newColumn?.key
          return (
            <ColumnItem
              currentColumn={newColumn}
              id={key}
              key={key}
              title={newColumn?.name}
              onClose={() => onClose && onClose(key)}
            />
          )
        })}
      </SortableContext>

      <Portal>
        <DragOverlay
          zIndex={9999}
          dropAnimation={{
            duration: 0
          }}
        >
          {activeId ? (
            <ColumnItem
              key={1}
              currentColumn={activeId}
              id={activeId?.key}
              isCursor
              title={activeId?.name}
            />
          ) : null}
        </DragOverlay>
      </Portal>
    </DndContext>
  )
}

export default SortableContextColumn
