import { Account, ActionAssignProxy, IOptionSelectFormat } from '@preload/types'
import {
  ButtonActionControl,
  ButtonFlowbite,
  InputField,
  InputFilter,
  ModalFilter,
  SelectField,
  TableManagerAccountProxy
} from '@renderer/components'
import { useShowHideColumn } from '@renderer/components/ReactTableGridCustom/hooks'
import { configTableManagerAccountAssignProxy, optionTypeProxy } from '@renderer/config'
import { useButtonStateProvider } from '@renderer/context'
import useCustomFormik from '@renderer/hook/useCustomFormik'
import { useUpdateAccountByField } from '@renderer/services'
import { Modal, Tooltip } from 'flowbite-react'
import { isEmpty } from 'lodash'
import { Dispatch, SetStateAction, useId, useMemo, useState } from 'react'
import { MdOutlineFilterList, MdOutlineFilterListOff } from 'react-icons/md'
import { toast } from 'react-toastify'

type TermsPopupProps = {
  isShow: boolean
  selectedProxy: string[]
  setIsShow?: Dispatch<SetStateAction<boolean>>
}

const ModalAssignProxy = ({ isShow, setIsShow, selectedProxy }: TermsPopupProps): JSX.Element => {
  const idForm = useId()
  const [actionAssign, setActionAssign] = useState<ActionAssignProxy>('one_proxy_one_account')
  // const [quantity, setQuantity] = useState<number>(1)

  const payloadPending = useButtonStateProvider()
  const [isShowModalFilter, setIsShowModalFilter] = useState(false)
  const openModalFilter = (): void => setIsShowModalFilter(true)

  // const { mutate: updateProxyStaticByField } = useUpdateProxyStaticByField()
  const { mutate: updateAccountByField } = useUpdateAccountByField()

  const {
    t,
    selectedRecords,
    setSelectedRecords,
    configSearch,
    dataAccount,
    isFetchingData,
    setConfigSearch
  } = useCustomFormik({
    ACTION_TYPE: 'scan_g_map_by_keyword',
    defaultValues: {}
  })

  const handleSubmit = (): void => {
    if (isEmpty(selectedProxy)) {
      toast.error(t('please_select_proxy'))
      return
    }

    if (isEmpty(Array.from(selectedRecords.values()))) {
      toast.error(t('please_select_account'))
      return
    }

    // updateProxyStaticByField({
    //   action: actionAssign,
    //   listProxyId: selectedProxy,
    //   listAccountId: Array.from(selectedRecords.values()),
    //   quantity: quantity
    // })
  }

  const handleRemoveProxy = (): void => {
    if (isEmpty(Array.from(selectedRecords.values()))) {
      toast.error(t('please_select_account'))
      return
    }

    updateAccountByField({
      key: 'uid',
      select: Array.from(selectedRecords.values()),
      value: { proxy: null }
    })
  }

  const handleClose = (): void => {
    setIsShow && setIsShow(false)
  }

  const { columnsTable } = useShowHideColumn<Account>({
    columns: configTableManagerAccountAssignProxy()
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
    <Modal show={isShow} onClose={handleClose} size={'6xl'} className="modal-assign-proxy">
      <Modal.Header>{t('assign_proxy')}</Modal.Header>
      <Modal.Body className="">
        <form id={idForm} className="space-y-3 mb-3">
          <div className="py-[16px] px-[20px] space-y-2">
            <div className="flex justify-between items-center flex-wrap gap-y-2">
              <div className="flex gap-2 items-center">
                <InputFilter
                  className="h-[38px] input-search"
                  onChangeValue={(value) => {
                    setConfigSearch((prev) => ({ ...prev, search: value }))
                  }}
                />
                <ButtonActionControl
                  // selectedRecords={selectedRecords}
                  configSearch={configSearch}
                  setConfigSearch={setConfigSearch}
                  accountsList={dataAccount?.data}
                  categoryIds={configSearch.categoryId}
                  setSelectedRecords={setSelectedRecords}
                  isShowButton={false}
                  isShowStatus={false}
                  isShowFilter={false}
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
                <p className="pl-2">
                  {t('selected')}:{' '}
                  <span className="text-blue-600 text-font-semibold">
                    {selectedRecords?.size ?? 0}
                  </span>
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <Tooltip
                  content={optionTypeProxy.find((item) => item.value === actionAssign)?.label}
                  placement="bottom"
                >
                  <SelectField<IOptionSelectFormat<ActionAssignProxy>>
                    name="type"
                    placeholder={t('proxy')}
                    classWapper="w-[280px]"
                    defaultValue={actionAssign}
                    height="38px"
                    onChange={(option) =>
                      setActionAssign((option as IOptionSelectFormat<ActionAssignProxy>).value)
                    }
                    options={optionTypeProxy}
                  />
                </Tooltip>
                <ButtonFlowbite color="failure" onClick={handleRemoveProxy}>
                  {t('reload_proxy')}
                </ButtonFlowbite>
                {actionAssign === 'one_proxy_many_account' && (
                  <div className="flex items-center gap-2">
                    <InputField
                      name="quantity"
                      type="number"
                      // onChange={(e) => setQuantity(Number(e.target.value))}
                      classWapper="[&>div>input]:shadow-none [&>div>input]:px-0 [&>div>input]:h-full flex-1"
                      className="text-center shadow-none w-[60px]"
                    />
                    <p className="pr-2">{t('account')}</p>
                  </div>
                )}
                <ButtonFlowbite color="blue" onClick={handleSubmit}>
                  {t('assign_proxy')}
                </ButtonFlowbite>
              </div>
            </div>
          </div>

          <TableManagerAccountProxy
            t={t}
            data={dataAccount?.data}
            total={dataAccount?.total}
            page={configSearch?.page}
            pageSize={configSearch?.pageSize}
            columns={columnsTable}
            fetching={isFetchingData}
            payloadPending={payloadPending}
            selectedRows={selectedRecords}
            onSelectedRowsChange={setSelectedRecords}
            setConfigPagination={setConfigSearch}
          />
        </form>

        {isShowModalFilter && (
          <ModalFilter
            isShow={isShowModalFilter}
            setIsShow={setIsShowModalFilter}
            configSearch={configSearch}
            setConfigSearch={setConfigSearch}
          />
        )}
      </Modal.Body>

      <Modal.Footer className="flex justify-center items-center gap-3 px-5 py-3">
        <ButtonFlowbite onClick={handleClose} color="failure">
          {t('close')}
        </ButtonFlowbite>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalAssignProxy
