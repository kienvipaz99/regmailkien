/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IPayloadService } from '@renderer/types'
import { TFunction } from 'i18next'
import { Dispatch, FC, Fragment, ReactNode, SetStateAction, useState } from 'react'
import ContextMenuItem from './ContextMenuItem'
import DropdownContextChild from './DropdownContextChild'

interface IExpandValue extends IPayloadService {
  t?: TFunction<'translation', undefined>
  setSelectedRecords?: Dispatch<ReadonlySet<string>>
  setIsShowEdit?: Dispatch<SetStateAction<boolean>>
  setIsOpenEditContent?: Dispatch<SetStateAction<boolean>>
  setIsCopy?: Dispatch<SetStateAction<boolean>>
  setIsChangeCate?: Dispatch<SetStateAction<boolean>>
  setIsBackup?: Dispatch<SetStateAction<boolean>>
}

export type configContextMenuType = {
  Icon: (prop?: any) => ReactNode
  action: string
  onClick?: (value: string[], expandValue: IExpandValue) => void
  children?: configContextMenuType[]
}

export interface RenderContextMenuProps {
  renderData?: configContextMenuType[]
  valueClickItem?: any
  expandValue?: IExpandValue
  classWapper?: boolean
}

const RenderContextMenu: FC<RenderContextMenuProps> = ({
  renderData,
  valueClickItem,
  expandValue = {}
}): JSX.Element => {
  return (
    <div className="bg-white shadow-submenu p-1 min-w-[250px] border">
      {renderData?.map((menuAction, index) => {
        const [isShow, setIsShow] = useState(false)
        return (
          <Fragment key={index}>
            {!menuAction?.children && (
              <ContextMenuItem
                currentValue={menuAction}
                expandValue={expandValue}
                valueClickItem={valueClickItem}
              />
            )}

            {menuAction?.children && (
              <DropdownContextChild
                appendTo={'parent'}
                placement="right"
                offset={[0, 5]}
                onShow={(): void => setIsShow(true)}
                onHide={(): void => setIsShow(false)}
                button={
                  <ContextMenuItem
                    currentValue={menuAction}
                    expandValue={expandValue}
                    valueClickItem={valueClickItem}
                    show={isShow}
                    isArrow
                  />
                }
              >
                <div className="dropdown-context-child absolute -top-[20px] -left-1">
                  <RenderContextMenu
                    renderData={menuAction?.children}
                    expandValue={expandValue}
                    valueClickItem={valueClickItem}
                  />
                </div>
              </DropdownContextChild>
            )}
          </Fragment>
        )
      })}
    </div>
  )
}

export default RenderContextMenu
