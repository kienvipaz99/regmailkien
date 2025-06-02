import { FC, memo, ReactNode, useId } from 'react'
import ContextMenu, { ContextMenuProps } from './ContextMenu/ContextMenu'
import RenderContextMenu, { RenderContextMenuProps } from './ContextMenu/RenderContextMenu'

interface TableStyleWapperProps {
  children?: ReactNode
  contextMenuProps?: Omit<ContextMenuProps, 'selector' | 'children'> & {
    selector?: string
  }
  renderContext?: RenderContextMenuProps
  clsTablecustom?: string
}

const TableStyleContextMenuWapper: FC<TableStyleWapperProps> = ({
  children,
  contextMenuProps,
  clsTablecustom,
  renderContext
}) => {
  const idWapper = useId()

  return (
    <div
      className={`border border-[#dedede] rounded-xl overflow-hidden bg-white xl:max-h-[72vh] max-h-[67vh] ${clsTablecustom}`}
      id={`wapper_menu_context-${idWapper}`}
    >
      {renderContext?.renderData && (
        <ContextMenu selector={`[id="wapper_menu_context-${idWapper}"] .rdg`} {...contextMenuProps}>
          <RenderContextMenu {...renderContext} />
        </ContextMenu>
      )}

      {children}
    </div>
  )
}

export default memo(TableStyleContextMenuWapper)
