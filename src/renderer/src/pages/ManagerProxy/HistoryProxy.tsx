import {
  ButtonFlowbite,
  ModalConfirm,
  ModalFilterHistoryProxy,
  TableHistoryProxy
} from '@renderer/components'
import ButtonActionExportHistory from '@renderer/components/ButtonAction/History/ButtonActionExportHistory'
import { FieldsetWapper, WapperLabelForm } from '@renderer/components/CustomFormField'
import { configTableHistoryProxy } from '@renderer/config'
import useCustomFormik from '@renderer/hook/useCustomFormik'
import { Tooltip } from 'flowbite-react'
import { useMemo, useState } from 'react'
import { MdOutlineFilterList, MdOutlineFilterListOff } from 'react-icons/md'

const HistoryProxy = (): JSX.Element => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [isShowModalFilter, setIsShowModalFilter] = useState(false)

  const confirmDelete = (): void => setShowConfirmDelete(true)

  const { t, selectedRecords, setSelectedRecords, configSearch, setConfigSearch } = useCustomFormik(
    {
      ACTION_TYPE: 'scan_g_map_by_keyword',
      defaultValues: {}
    }
  )
  // const { mutate: removeHistoryProxy } = useRemoveHistoryProxy()

  // const { data: dataHistoryProxy } = useReadAllHistoryProxy(configSearch)

  const cancelDelete = (): void => setShowConfirmDelete(false)
  const openModalFilter = (): void => setIsShowModalFilter(true)
  const resetFilters = (): void => setConfigSearch({ page: 1, pageSize: 1000, filterType: 'all' })

  const newColumn = useMemo(
    () => configTableHistoryProxy(),
    // { t, dataJobDetail: [] }
    []
  )

  const isFiltered = useMemo(() => {
    return false
    // return configSearch.search || configSearch.event || configSearch.proxy || configSearch.status
  }, [configSearch])

  return (
    <FieldsetWapper title={t('history_word_proxy')}>
      <div className="flex items-center justify-end w-full gap-3">
        <ButtonFlowbite size="sm" className="bg-[#dc2626]" onClick={confirmDelete}>
          {t('clear_all')}
        </ButtonFlowbite>

        <ButtonActionExportHistory selectedRecords={selectedRecords} />

        <div
          className="p-2 bg-blue-500 rounded-md h-[30px]"
          role="button"
          onClick={isFiltered ? resetFilters : openModalFilter}
        >
          <Tooltip content={t(isFiltered ? 'reset_filter' : 'filter')} placement="bottom">
            {isFiltered ? (
              <MdOutlineFilterListOff size={16} className="text-white" />
            ) : (
              <MdOutlineFilterList size={16} className="text-white" />
            )}
          </Tooltip>
        </div>
      </div>

      <WapperLabelForm classWapper="mt-3">
        <TableHistoryProxy
          t={t}
          data={[]}
          total={0}
          selectedRows={selectedRecords}
          onSelectedRowsChange={setSelectedRecords}
          columns={newColumn}
          page={configSearch?.page}
          pageSize={configSearch?.pageSize}
          setConfigPagination={setConfigSearch}
        />
      </WapperLabelForm>

      {isShowModalFilter && (
        <ModalFilterHistoryProxy
          isShow={isShowModalFilter}
          setIsShow={setIsShowModalFilter}
          configSearch={configSearch}
          setConfigSearch={setConfigSearch}
        />
      )}

      <ModalConfirm
        isShow={showConfirmDelete}
        setIsShow={setShowConfirmDelete}
        title={t('delete_history')}
        onCancel={cancelDelete}
        // onChange={() => {
        //   removeHistoryProxy(undefined, {
        //     onSuccess: () => {
        //       setShowConfirmDelete(false)
        //     }
        //   })
        // }}
      />
    </FieldsetWapper>
  )
}

export default HistoryProxy
