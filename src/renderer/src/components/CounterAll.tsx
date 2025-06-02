import { numberConvert } from '@renderer/helper'
import { get } from 'lodash'
import { useTranslation } from 'react-i18next'

interface IArrValues {
  title?: string
  value?: number
  key?: string
  color?: string
  bgColor?: string
}

interface CounterAllProps<T extends object> {
  obj?: T
  arrValue?: IArrValues[]
}

const initArrValuesCounter: IArrValues[] = [
  {
    title: 'total',
    key: 'total',
    value: 0,
    color: '#3b82f6',
    bgColor: '#e2f2ff'
  },

  {
    title: 'live',
    key: 'lives',
    value: 0,
    color: '#00ab55',
    bgColor: '#d9ffd2'
  },

  {
    title: 'die',
    key: 'dies',
    value: 0,
    color: '#ef4444',
    bgColor: '#ffe2e2'
  }
]

const CounterAll = <T extends object>({
  obj,
  arrValue = initArrValuesCounter
}: CounterAllProps<T>): JSX.Element => {
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-14 flex-wrap mb-3">
      {arrValue?.map((item, index) => {
        const newValue = get(obj ?? {}, item?.key ?? '') || item?.value
        return (
          <div
            className="flex flex-col items-center gap-2"
            key={index}
            style={{ color: item?.color }}
          >
            <span
              className="text-[12px] font-bold rounded px-1"
              style={{
                backgroundColor: item?.bgColor
              }}
            >
              {t(`${item?.title}`)}
            </span>
            <span className="font-semibold text-[22px]">{numberConvert(newValue || 0)}</span>
          </div>
        )
      })}
    </div>
  )
}

export default CounterAll
