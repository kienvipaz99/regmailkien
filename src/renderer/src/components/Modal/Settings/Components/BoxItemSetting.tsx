import { cn } from '@renderer/helper'
import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { IconType } from 'react-icons'

interface IBoxItemSettingProps {
  Icon?: IconType
  title?: ReactNode
  desc?: ReactNode
  classWapper?: string
}

const BoxItemSetting: FC<IBoxItemSettingProps> = ({
  Icon,
  title,
  desc,
  classWapper = 'w-[300px]'
}) => {
  const { t } = useTranslation()

  return (
    <div className={cn('flex items-center gap-3 col-span-2', classWapper)}>
      {Icon && (
        <div className="bg-blue-200 p-2 rounded-xl text-[#1E83F7]">
          <Icon size={28} />{' '}
        </div>
      )}
      <div>
        {title && (
          <div className="text-left">
            <span className="text-sm font-semibold">
              {typeof title === 'string' ? t(title) : title}
            </span>
          </div>
        )}

        {desc && (
          <div className="text-sm text-blue-500 pl-0 whitespace-nowrap">
            {typeof desc === 'string' ? t(desc) : desc}
          </div>
        )}
      </div>
    </div>
  )
}

export default BoxItemSetting
