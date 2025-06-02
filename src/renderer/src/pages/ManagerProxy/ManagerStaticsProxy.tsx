import {
  ButtonFlowbite,
  ModalAddProxy,
  ModalAssignProxy,
  ModalExport,
  ModalFilterProxy
} from '@renderer/components'
import ButtonActionHiddenRow from '@renderer/components/ButtonAction/Default/ButtonActionHiddenRow'
import FieldsetWapper from '@renderer/components/CustomFormField/FieldsetWapper'
import InputFilter from '@renderer/components/CustomFormField/InputFilter'
import { useShowHideColumn } from '@renderer/components/ReactTableGridCustom/hooks'
import TableManagerProxy from '@renderer/components/Table/Proxy/TableManagerProxy'
import { configTableProxy } from '@renderer/config/configTable/proxy'
import useCustomFormik from '@renderer/hook/useCustomFormik'
import type { Proxy } from '@vitechgroup/mkt-proxy-client'
import { Tooltip } from 'flowbite-react'
import { CircleFadingPlus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { IoIosCheckboxOutline } from 'react-icons/io'
import {
  MdOutlineAssignmentReturned,
  MdOutlineFilterList,
  MdOutlineFilterListOff
} from 'react-icons/md'
import { TfiExport } from 'react-icons/tfi'
import { toast } from 'react-toastify'

const ManagerStaticsProxy = (): JSX.Element => {
  const { t, selectedRecords, setSelectedRecords, configSearch, setConfigSearch } = useCustomFormik(
    {
      ACTION_TYPE: 'scan_g_map_by_keyword',
      defaultValues: {}
    }
  )

  // const { data: proxyData, isFetching: isFetchingData } = useReadProxyStaticByParams({
  //   ...configSearch,
  //   proxyType: ['static']
  // })
  // const { mutate: deleteProxy } = useDeleteProxyStatic()
  // const { mutate: copyProxyByField } = useCopyProxyByField()
  // const { mutate: checkLiveOrDieProxy, isPending: isPendingCheckLiveOrDie } =
  //   useCheckLiveOrDieProxy()
  // const { mutate: exportFileBy, isPending } = useExportFileBy()

  const [isShowModalFilter, setIsShowModalFilter] = useState(false)
  const [isShowModalAddProxy, setIsShowModalAddProxy] = useState(false)
  const [isShowModalAssignProxy, setIsShowModalAssignProxy] = useState(false)
  const [isShowModalExportProxy, setIsShowModalExportProxy] = useState(false)
  const openModalFilter = (): void => setIsShowModalFilter(true)

  const {
    columnsTable,
    newShowhideColumns,
    changeHiddenColumn,
    hiddenColumns,
    locationColumns,
    handleFindLocation,
    handleChangeLocation
  } = useShowHideColumn<Proxy>({
    columns: configTableProxy()
  })

  const handleExportFile = async (): Promise<void> => {
    if (!selectedRecords || (selectedRecords && selectedRecords.size === 0)) {
      toast.warn(t('notifications.no_proxy_selected'))
      return
    }
    // exportFileBy({ type: 'proxy_export', listUidSelect: Array.from(selectedRecords) })
  }

  const checkLiveOrDie = (): void => {
    if (!selectedRecords || (selectedRecords && selectedRecords.size === 0)) {
      toast.warn(t('notifications.no_proxy_selected'))
      return
    }

    // checkLiveOrDieProxy(Array.from(selectedRecords.values()))
  }

  const isFiltered = useMemo(() => {
    return (
      configSearch.search ||
      configSearch.categoryId ||
      configSearch.filterType !== 'all' ||
      configSearch.checkpointState ||
      configSearch.uids ||
      configSearch.names
    )
  }, [configSearch])

  const resetFilters = (): void => setConfigSearch({ page: 1, pageSize: 1000, filterType: 'all' })

  return (
    <>
      <FieldsetWapper classWapper="custom-table table-account rounded-[10px]">
        <div className="py-[16px] px-[20px] space-y-2">
          <div className="flex justify-between items-center flex-wrap gap-y-2">
            <div className="flex gap-2 items-center">
              <InputFilter
                className="h-[38px] input-search"
                onChangeValue={(value) => {
                  setConfigSearch((prev) => ({ ...prev, search: value }))
                }}
              />
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

              <ButtonFlowbite
                size="sm"
                color="blue"
                StartIcon={CircleFadingPlus}
                onClick={() => setIsShowModalAddProxy(true)}
              >
                {t('add_proxy')}
              </ButtonFlowbite>

              <ButtonFlowbite
                size="sm"
                color="blue"
                // isProcessing={isPending}
                onClick={handleExportFile}
                StartIcon={TfiExport}
              >
                {t('export_proxy')}
              </ButtonFlowbite>

              <ButtonFlowbite
                className="exportproxy"
                size="sm"
                color="blue"
                // disabled={isPendingCheckLiveOrDie}
                // isProcessing={isPendingCheckLiveOrDie}
                onClick={checkLiveOrDie}
                StartIcon={IoIosCheckboxOutline}
              >
                {t('check_proxy')}
              </ButtonFlowbite>

              <ButtonFlowbite
                size="sm"
                color="blue"
                StartIcon={MdOutlineAssignmentReturned}
                onClick={() => setIsShowModalAssignProxy(true)}
              >
                {t('assign_proxy')}
              </ButtonFlowbite>

              <ButtonActionHiddenRow<Proxy>
                locationColumns={locationColumns}
                columns={newShowhideColumns}
                onSubmit={changeHiddenColumn}
                hiddenColumns={hiddenColumns}
                handleFindLocation={handleFindLocation}
                handleChangeLocation={handleChangeLocation}
              />
            </div>
          </div>
        </div>

        <TableManagerProxy
          t={t}
          data={[]}
          total={0}
          page={configSearch?.page}
          pageSize={configSearch?.pageSize}
          columns={columnsTable}
          selectedRows={selectedRecords}
          rowKeyGetter="id"
          onSelectedRowsChange={setSelectedRecords}
          // fetching={isFetchingData}
          setConfigPagination={setConfigSearch}
          // deleteProxy={deleteProxy}
          // useCopyProxyByField={copyProxyByField}
        />
      </FieldsetWapper>

      {isShowModalFilter && (
        <ModalFilterProxy
          isShow={isShowModalFilter}
          setIsShow={setIsShowModalFilter}
          configSearch={configSearch}
          setConfigSearch={setConfigSearch}
        />
      )}

      {isShowModalAddProxy && (
        <ModalAddProxy isShow={isShowModalAddProxy} setIsShow={setIsShowModalAddProxy} />
      )}

      {isShowModalAssignProxy && (
        <ModalAssignProxy
          isShow={isShowModalAssignProxy}
          setIsShow={setIsShowModalAssignProxy}
          selectedProxy={Array.from(selectedRecords.values())}
        />
      )}
      {isShowModalExportProxy && (
        <ModalExport isShow={isShowModalExportProxy} setIsShow={setIsShowModalExportProxy} />
      )}
    </>
  )
}

export default ManagerStaticsProxy
