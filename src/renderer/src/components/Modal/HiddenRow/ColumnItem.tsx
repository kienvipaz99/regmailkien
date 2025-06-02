import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Column } from 'react-data-grid'
import { useTranslation } from 'react-i18next'
import { IoClose } from 'react-icons/io5'
import { PiDotsSixVerticalBold } from 'react-icons/pi'

interface ColumnItemProps<T> {
  title?: Column<T>['name']
  onClose?: () => void
  currentColumn?: Column<T>
  id: string
  isCursor?: boolean
}

const ColumnItem = <T,>({
  title,
  onClose,
  currentColumn,
  id,
  isCursor
}: ColumnItemProps<T>): JSX.Element => {
  const { t } = useTranslation()
  const { isDragging, attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: id ?? '',
    data: { item: currentColumn }
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition: transition || undefined,
    opacity: isDragging ? '0.5' : '1'
  }

  return (
    <div
      className="bg-gray-100 p-2 pl-0 flex items-center justify-between rounded-md"
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <PiDotsSixVerticalBold
        size={25}
        className="mx-2 text-gray-400"
        {...listeners}
        style={{ cursor: isCursor ? 'grabbing' : 'grab' }}
      />
      <span className="block flex-1">{t(`${title}`)}</span>
      <IoClose
        size={25}
        className="cursor-pointer text-red-500"
        onClick={() => onClose && onClose()}
      />
    </div>
  )
}

export default ColumnItem
