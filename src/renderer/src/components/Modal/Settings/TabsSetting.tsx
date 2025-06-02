import { cn } from '@renderer/helper'
import type { DefaultSettingProps } from '@renderer/types'
import { FC, Fragment, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ListTabSettings } from './Components/ConfigSetting'

interface TabsSettingProps extends DefaultSettingProps {}

const TabsSetting: FC<TabsSettingProps> = ({
  formId,
  isDisable,
  currentButton,
  ...spread
}): JSX.Element => {
  const [active, setActive] = useState(0)
  const { t } = useTranslation()

  const Component = useMemo(() => {
    const Content = ListTabSettings[active].Component
    return Content ? (
      <Content formId={formId} isDisable={isDisable} currentButton={currentButton} {...spread} />
    ) : (
      <Fragment />
    )
  }, [active, formId, spread, isDisable])

  return (
    <div>
      <div className="p-5 bg-white sticky top-0 z-10 border-b-[1px] border-dashed">
        <div className="flex justify-between w-full border border-[#D5D8DC] rounded overflow-hidden [&>:not(last-child)]:border-r-[1px]">
          {ListTabSettings?.map((item, index) => {
            const Icon = item?.Icon
            return (
              <div key={index} className={cn('flex-auto text-center !outline-none')}>
                <div
                  className={cn(
                    'flex items-center gap-2 before:inline-block py-2 px-[10px] whitespace-nowrap',
                    active === index && 'bg-[#DADADA] text-[#000] !outline-none',
                    isDisable ? 'cursor-not-allowed' : 'cursor-pointer'
                  )}
                  style={{ width: '100%' }}
                  onClick={() => !isDisable && setActive(index)}
                >
                  {Icon && <Icon />}
                  {t(item?.title)}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="h-[calc(100%_-_60px)] pt-5 px-5">
        <div className="custom_scroll overflow-y-auto">{Component}</div>
      </div>
    </div>
  )
}

export default TabsSetting
