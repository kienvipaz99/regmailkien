import type { TColumnsTable } from '@renderer/types'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

// hàm này chỉ hỗ trợ dịch cấp một
const useTranslationTable = <T, SR>(column: TColumnsTable<T, SR>): TColumnsTable<T, SR> => {
  const { i18n, t } = useTranslation()

  const columnTranslation = useMemo(() => {
    return column.map((item) => ({ ...item, name: t(`${item?.name}`) }))
  }, [i18n?.language, column])

  return columnTranslation
}

export default useTranslationTable
