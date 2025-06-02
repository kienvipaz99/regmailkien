import { Text } from '@mantine/core'
import { Account, ITaskName } from '@preload/types'
import BoxCategory from '@renderer/components/BoxCategory'
import ButtonActionCloseChrome from '@renderer/components/ButtonAction/Account/ButtonActionCloseChrome'
import ButtonActionExportAccount from '@renderer/components/ButtonAction/Account/ButtonActionExportAccount'
import ButtonActionTrashAccount from '@renderer/components/ButtonAction/Account/ButtonActionTrashAccount'
import ButtonActionHiddenRow from '@renderer/components/ButtonAction/Default/ButtonActionHiddenRow'
import CounterAll from '@renderer/components/CounterAll'
import FieldsetWapper from '@renderer/components/CustomFormField/FieldsetWapper'
import InputFilter from '@renderer/components/CustomFormField/InputFilter'
import ButtonFlowbite from '@renderer/components/Default/ButtonFlowbite'
import LayoutWapper from '@renderer/components/LayoutWapper'
import ModalAddAccount from '@renderer/components/Modal/Account/ModalAddAccount'
import ModalFilter from '@renderer/components/Modal/Account/ModalFilter'
import { useShowHideColumn } from '@renderer/components/ReactTableGridCustom/hooks'
import StatusDisplay from '@renderer/components/StatusDisplay'
import TableManagerAccount from '@renderer/components/Table/Account/TableManagerAccount'
import { configTableManagerAccount } from '@renderer/config/configTable/account'
import { useButtonStateProvider } from '@renderer/context'
import useCustomFormik from '@renderer/hook/useCustomFormik'
import {
  useActionBy,
  useCopy2faCode,
  useCopyAccountByField,
  useCounterTotalLiveAndDie,
  useReadSettingSystem,
  useRemoveAccountFieldByUid,
  useStartAction,
  useUpdateAccountByField,
  useUpdateByClipboard,
  useUpdateSettingBy
} from '@renderer/services'
import { Tooltip } from 'flowbite-react'
import { CircleFadingPlus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { MdOutlineFilterList, MdOutlineFilterListOff } from 'react-icons/md'

const ManagerAccount = (): JSX.Element => {
  const [action, setAction] = useState<ITaskName>('open_chrome')
  const [categoryIds, setCategoryIds] = useState<string[]>([])
  const [isShowModalFilter, setIsShowModalFilter] = useState(false)
  const [isShowModalAccount, setIsShowModalAccount] = useState(false)
  const openModalFilter = (): void => setIsShowModalFilter(true)
  const openModalAccount = (): void => setIsShowModalAccount(true)

  const { mutate: copy2faCode } = useCopy2faCode()
  const { mutate: copyByField } = useCopyAccountByField()
  const { mutate: updateByClipboard } = useUpdateByClipboard()
  const { mutate: removeFieldBy } = useRemoveAccountFieldByUid()
  const { mutate: actionBy } = useActionBy()
  const { mutate: updateAccountByField } = useUpdateAccountByField()
  const { mutate: startAction } = useStartAction()
  const { mutate: updateSettings } = useUpdateSettingBy('setting_system')
  const { data: counterAccount } = useCounterTotalLiveAndDie()
  const { data: settingSystem } = useReadSettingSystem()
  const payloadPending = useButtonStateProvider()

  const {
    t,
    selectedRecords,
    setSelectedRecords,
    configSearch,
    dataAccount,
    dataHistory,
    isFetchingData,
    setConfigSearch
  } = useCustomFormik({
    ACTION_TYPE: action,
    defaultValues: {}
  })

  const {
    columnsTable,
    newShowhideColumns,
    changeHiddenColumn,
    hiddenColumns,
    locationColumns,
    handleFindLocation,
    handleChangeLocation
  } = useShowHideColumn<Account>({
    columns: configTableManagerAccount({ t, dataHistory, settingSystem })
  })

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
      <div className="flex mb-[20px] justify-between">
        <div className="">
          <Text size={'23px'} style={{ fontFamily: 'Google Sans' }} color={'#474747'}>
            {t('list_account')}
          </Text>
        </div>

        <div className="flex gap-2 ">
          <ButtonFlowbite
            className=""
            size="sm"
            color="blue"
            onClick={openModalAccount}
            StartIcon={CircleFadingPlus}
          >
            {t('add_account')}
          </ButtonFlowbite>
          <ButtonActionExportAccount selectedRecords={selectedRecords} />
        </div>
      </div>

      <LayoutWapper layout="3|7">
        <div className="flex flex-col gap-4">
          <FieldsetWapper classWapper="bg-white !h-auto px-[10px] py-[5px]">
            <CounterAll obj={counterAccount} />
          </FieldsetWapper>

          <FieldsetWapper classWapper="bg-white h-full ctsp flex-1 manager-category" hiddenScroll>
            <BoxCategory
              setSelectedRecords={setSelectedRecords}
              categoryIds={categoryIds}
              setCategoryIds={setCategoryIds}
              onChange={(arrCatgoryIds) => {
                setConfigSearch((prev) => ({ ...prev, categoryId: arrCatgoryIds }))
              }}
            />
          </FieldsetWapper>
        </div>
        <FieldsetWapper classWapper="custom-table table-account rounded-[10px] !w-[calc(100%_-_395px)]">
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

                <StatusDisplay accountsList={dataAccount?.data} />
                <p className="pl-2">
                  {t('selected')}:{' '}
                  <span className="text-blue-600 text-font-semibold">
                    {selectedRecords?.size ?? 0}
                  </span>
                </p>
              </div>

              <div className="gap-2 flex h-fit flex-wrap">
                <ButtonActionCloseChrome startAction={startAction} />

                <ButtonActionTrashAccount />

                <ButtonActionHiddenRow<Account>
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

          <TableManagerAccount
            t={t}
            data={dataAccount?.data}
            total={dataAccount?.total}
            page={configSearch?.page}
            pageSize={configSearch?.pageSize}
            columns={columnsTable}
            fetching={isFetchingData}
            payloadPending={payloadPending}
            selectedRows={selectedRecords}
            settingSystem={settingSystem}
            onSelectedRowsChange={setSelectedRecords}
            setConfigPagination={setConfigSearch}
            updateByClipboard={updateByClipboard}
            removeFieldBy={removeFieldBy}
            copyByField={copyByField}
            copy2faCode={copy2faCode}
            actionBy={actionBy}
            updateAccountByField={updateAccountByField}
            startAction={startAction}
            updateSettings={updateSettings}
            setAction={setAction}
          />
        </FieldsetWapper>
        {isShowModalFilter && (
          <ModalFilter
            isShow={isShowModalFilter}
            setIsShow={setIsShowModalFilter}
            configSearch={configSearch}
            setConfigSearch={setConfigSearch}
          />
        )}
        {isShowModalAccount && (
          <ModalAddAccount isShow={isShowModalAccount} setIsShow={setIsShowModalAccount} />
        )}
      </LayoutWapper>
    </>
  )
}

export default ManagerAccount
