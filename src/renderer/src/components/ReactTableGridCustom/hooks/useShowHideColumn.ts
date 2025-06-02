import { arrayLocal, getLocalStore, setLocalStore, toggleValues } from '@renderer/helper'
import type { TColumnsTable } from '@renderer/types'
import { uniq } from 'lodash'
import { useCallback, useMemo, useState } from 'react'
import { Column } from 'react-data-grid'
import { useShowHideColumnParameter, useShowHideColumnReturn } from '../table-type'

const useShowHideColumn = <T, SR = unknown>({
  nameLocal = 'table',
  columns,
  ignoreColumns
}: useShowHideColumnParameter<T, SR>): useShowHideColumnReturn<T, SR> => {
  const nameLocalLocation = `${nameLocal}_location`
  const [locationColumns, setLocationColumns] = useState<string[]>(() => {
    const dataLocal = getLocalStore(nameLocalLocation)
    if (dataLocal) {
      return arrayLocal(dataLocal)
    }
    return []
  })
  const [hiddenColumns, setHiddenColumns] = useState<string[]>(() => {
    const dataLocal = getLocalStore(nameLocal)
    if (dataLocal) {
      return arrayLocal(dataLocal)
    }
    return []
  })

  const handleFindLocation = useCallback(
    (filterColumns: TColumnsTable<T, SR>, arrLoctions = locationColumns) => {
      return arrLoctions?.length > 0
        ? arrLoctions?.reduce(
            (total, current) => {
              const currentColumns = filterColumns?.find((item) => {
                const newItem = item as Column<T>
                return newItem?.key === current
              })

              if (currentColumns) {
                total = [...total, currentColumns]
              }
              return total
            },
            [] as TColumnsTable<T, SR>
          )
        : filterColumns
    },
    [locationColumns]
  )

  const newCloumnKeys = useMemo(
    () => columns?.map((item) => (item as Column<T, SR>)?.key),
    [columns]
  )

  const newColumns = useMemo(() => {
    const filterColumns: TColumnsTable<T, SR> = columns?.filter((item) => {
      const key = (item as Column<T, SR>)?.key
      if (ignoreColumns && ignoreColumns?.includes(key)) return item
      // check key hide local
      if (key) {
        return !hiddenColumns?.includes(key)
      }
      return item
    })
    return handleFindLocation(filterColumns)
  }, [columns, hiddenColumns, locationColumns])

  const newShowhideColumns = useMemo(() => {
    if (!ignoreColumns) return columns
    const newConversion = columns?.filter((column) => {
      const key = (column as Column<T, SR>)?.key
      return !ignoreColumns?.includes(key)
    })
    return newConversion
  }, [columns, ignoreColumns])

  const changeHiddenColumn = useCallback(
    (key: string | string[]) => {
      let newData = [...hiddenColumns]
      if (typeof key === 'string') {
        newData = toggleValues({
          array: newData,
          value: key
        })
      } else {
        newData = key
      }
      setLocalStore(nameLocal, JSON.stringify(newData))
      setHiddenColumns(newData)
    },
    [hiddenColumns, nameLocalLocation]
  )

  const handleChangeLocation = useCallback(
    (key: string[]) => {
      let newKey = key
      newKey = uniq([...key, ...newCloumnKeys])
      setLocationColumns(newKey)
      setLocalStore(nameLocalLocation, JSON.stringify(newKey))
    },
    [newCloumnKeys]
  )

  return {
    hiddenColumns,
    setHiddenColumns,
    columnsTable: newColumns,
    changeHiddenColumn,
    newShowhideColumns,
    locationColumns,
    handleFindLocation,
    handleChangeLocation
  }
}

export { useShowHideColumn }
