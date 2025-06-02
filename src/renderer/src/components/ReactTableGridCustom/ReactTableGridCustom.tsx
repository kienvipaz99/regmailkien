import { Checkbox, Pagination } from '@mantine/core'
import StaticImage from '@renderer/assets/images'
import { cn } from '@renderer/helper'
import { calculatorTotalPage, STT } from '@renderer/helper/table'
import type { TColumnsTable } from '@renderer/types'
import { get, orderBy } from 'lodash'
import { Key, memo, useCallback, useEffect, useMemo, useState } from 'react'
import DataGrid, { SelectColumn, SortColumn } from 'react-data-grid'
import 'react-data-grid/lib/styles.css'
import { useTranslation } from 'react-i18next'
import ComboboxCustom from './component/ComboboxCustom'
import { LoadingIcon } from './component/Icons'
import RenderSortStatus from './component/RenderSortStatus'
import useTranslationTable from './hooks/useTranslationTable'
import './ReactTableGridCustom.css'
import { IPaginationText, IReactTableGridCustom } from './table-type'

const ReactTableGridCustom = <T, SR = unknown, K extends Key = Key>({
  classNamePaginationTable,
  classNameWapperTable,
  hiddenPagination,
  hiddenSTT,
  data = [],
  page,
  pageSize,
  total,
  onChange,
  setConfigPagination,
  columns,
  rowKeyGetter = 'uid',
  selectedRows,
  hiddenPaginationText,
  paginationText,
  listPageSize = ['10', '100', '200', '500', '1000', '5000'],
  fetching,
  ...spread
}: IReactTableGridCustom<T, SR, K>): JSX.Element => {
  const { t } = useTranslation()
  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([])
  const isSelectRow = selectedRows !== undefined

  const maxPage = useMemo(
    () =>
      !hiddenPagination
        ? calculatorTotalPage({
            total,
            pageSize
          })
        : 0,
    [pageSize, total, hiddenPagination]
  )

  const toInPagination = useMemo(() => {
    const initPage: IPaginationText = {
      from: 0,
      to: 0
    }
    if (!hiddenPaginationText && pageSize && page) {
      const from = STT(
        {
          page: page,
          pageSize: pageSize
        },
        0
      )
      return {
        from,
        to: maxPage === page ? total : page * pageSize
      }
    }
    return initPage
  }, [pageSize, page, hiddenPaginationText, maxPage, total])

  const columnTranslation = useTranslationTable<T, SR>(columns as TColumnsTable<T, SR>)

  const newColumns = useMemo(() => {
    const columnsCustom = [...columnTranslation]

    if (isSelectRow) {
      columnsCustom.unshift(SelectColumn)
    }

    if (!hiddenSTT || (!hiddenSTT && page && pageSize)) {
      columnsCustom.unshift({
        key: 'index',
        name: 'STT',
        width: 80,
        renderCell: ({ rowIdx }) => STT({ page, pageSize }, rowIdx)
      })
    }

    return columnsCustom
  }, [hiddenSTT, isSelectRow, page, pageSize, columnTranslation])

  const customRowKeyGetter = useMemo(() => {
    return (row: NoInfer<T>): K => {
      if (typeof rowKeyGetter === 'function') {
        return rowKeyGetter(row)
      }
      return get(row, rowKeyGetter as string) as K
    }
  }, [rowKeyGetter])

  const handlePageChange = useCallback(
    (page: number) => {
      if (onChange) {
        onChange(page)
        return
      }

      if (setConfigPagination) {
        setConfigPagination((prev) => ({ ...prev, page }))
      }
    },
    [setConfigPagination, onChange]
  )

  const sortedRows = useMemo((): readonly T[] => {
    if (sortColumns.length === 0) return data
    const direction = sortColumns[0]?.direction?.toLocaleLowerCase() as 'desc' | 'asc'
    const columnKey = sortColumns[0]?.columnKey
    return orderBy(data, columnKey, direction)
  }, [data, sortColumns])

  useEffect(() => {
    if (page && page > maxPage && maxPage > 0) {
      handlePageChange(1)
    }
  }, [page, maxPage, handlePageChange])

  return (
    <div className={cn('wapper_table rounded-md overflow-hidden relative', classNameWapperTable)}>
      <div className="relative wapper_table_empty">
        <DataGrid
          aria-rowcount={sortedRows?.length}
          selectedRows={selectedRows}
          rows={sortedRows}
          rowKeyGetter={rowKeyGetter && isSelectRow ? customRowKeyGetter : undefined}
          columns={newColumns}
          renderers={{
            renderSortStatus: RenderSortStatus,
            renderCheckbox({ onChange, checked, ...spread }) {
              const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
                onChange(e.target.checked, (e.nativeEvent as MouseEvent).shiftKey)
              }
              return (
                <Checkbox color="indigo" checked={!!checked} onChange={handleChange} {...spread} />
              )
            }
          }}
          className="fill-grid"
          defaultColumnOptions={{
            // minWidth: 200,
            // maxWidth: 200,
            renderCell: ({ column, row }) => {
              const value = get(row, column.key)
              return [null, undefined, ''].includes(value) ? '-' : value
            }
          }}
          sortColumns={sortColumns}
          onSortColumnsChange={setSortColumns}
          {...spread}
        />
        {total === 0 && (
          <div className="no_result absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 select-none">
            <div className="flex flex-col justify-center">
              <img src={StaticImage.TableLogo} alt="" className="size-32" />
            </div>
          </div>
        )}
      </div>

      {!hiddenPagination && (
        <div
          className={cn(
            'flex justify-between items-center flex-wrap wapper_pagination p-[10px] pl-2 mt-auto',
            classNamePaginationTable
          )}
        >
          {!hiddenPaginationText && page && pageSize && (
            <div className="text-sm">
              {paginationText
                ? paginationText({ ...toInPagination, total })
                : total
                  ? `${t('display')} ${toInPagination?.from} ${t('to')} ${toInPagination?.to} ${t('in')} ${total} ${t('data')}`
                  : '...'}
            </div>
          )}
          <ComboboxCustom
            options={listPageSize}
            value={pageSize?.toString()}
            onChange={(value) => {
              if (setConfigPagination) {
                setConfigPagination((prev) => ({ ...prev, pageSize: Number(value), page: 1 }))
              }
            }}
          />
          {!!maxPage && (
            <Pagination
              color="indigo"
              total={maxPage}
              size={'sm'}
              value={page}
              onChange={handlePageChange}
            />
          )}
        </div>
      )}

      {fetching && (
        <div className="absolute inset-0 bg-gray-50/45 flex justify-center items-center">
          <div className="border-[2px] rounded-full border-gray-200 shadow-sm">
            <LoadingIcon isSpin className="text-blue-500" />
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(ReactTableGridCustom) as typeof ReactTableGridCustom
