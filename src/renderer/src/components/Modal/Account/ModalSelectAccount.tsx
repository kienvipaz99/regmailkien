/* eslint-disable @typescript-eslint/no-explicit-any */
import { SelectField } from '@renderer/components/CustomFormField'
import { ButtonFlowbite } from '@renderer/components/Default'
import TableModalSelectAccount from '@renderer/components/Table/Account/TableModalSelectAccount'
import { configTableModalSelectAccount } from '@renderer/config'
import { useReadAccountByParams, useReadCategoryByParamsFrom } from '@renderer/services'
import type { IDispatchState, IObjectParams } from '@renderer/types'
import { Modal } from 'flowbite-react'
import type { FormikProps } from 'formik'
import { t } from 'i18next'
import { Dispatch, SetStateAction, useMemo, useState } from 'react'
interface ModalSelectAccountProps<T> {
  isShow: boolean
  isNotificationVisible?: boolean
  setIsShow?: Dispatch<SetStateAction<boolean>>
  formik?: FormikProps<T>
  selectedRecord?: ReadonlySet<string>
  setSelectedRecord?: IDispatchState<ReadonlySet<string>>
  setSelectedOrtherRecord?: IDispatchState<ReadonlySet<string>>
  setConfigSearch?: Dispatch<SetStateAction<IObjectParams>>
  toggleNotification?: () => void
}

const ModalSelectAccount = <T,>({
  isShow,
  isNotificationVisible,
  setIsShow,
  selectedRecord,
  setSelectedRecord,
  setSelectedOrtherRecord,
  setConfigSearch,
  toggleNotification
}: ModalSelectAccountProps<T>): JSX.Element => {
  const [configSearchChooseAccount, setConfigSearchChooseAccount] = useState<IObjectParams>({
    page: 1,
    pageSize: 1000
  })
  const { data: dataAccount, isFetching } = useReadAccountByParams(configSearchChooseAccount)
  const { data: categories } = useReadCategoryByParamsFrom('account', {
    page: 1,
    pageSize: 1000
  })
  const columnsChooseAccount = useMemo(() => configTableModalSelectAccount(), [t])
  const handleSave = (): void => {
    setIsShow && setIsShow(false)
    selectedRecord &&
      setConfigSearch &&
      setConfigSearch((prev) => ({ ...prev, uids: Array.from(selectedRecord), page: 1 }))
    setSelectedOrtherRecord && setSelectedOrtherRecord((): ReadonlySet<string> => new Set())
  }
  const handleClose = (): void => {
    selectedRecord &&
      setConfigSearch &&
      setConfigSearch((prev) => ({ ...prev, uids: Array.from([]), page: 1 }))
    setSelectedRecord && setSelectedRecord((): ReadonlySet<string> => new Set())
    setSelectedOrtherRecord && setSelectedOrtherRecord((): ReadonlySet<string> => new Set())
    toggleNotification && isNotificationVisible && toggleNotification()
    setIsShow && setIsShow(false)
  }

  return (
    <Modal show={isShow} onClose={handleClose} size={'6xl'}>
      <Modal.Header>{t('select_accounts')}</Modal.Header>
      <Modal.Body className="!h-[45vh]">
        <div className="flex h-[45vh] flex-col gap-4">
          <SelectField
            placeholder={t('select_category')}
            className="!w-[200px]"
            name="category"
            options={categories?.data?.map((item) => ({
              label: item.name,
              value: item.id
            }))}
            onChange={(newValue: any) => {
              setConfigSearchChooseAccount((prev) => ({
                ...prev,
                categoryId: [newValue.value],
                page: 1
              }))
            }}
          />
          <TableModalSelectAccount
            clsHeight="!h-[calc(45vh-53px)]"
            columns={columnsChooseAccount}
            fetching={isFetching}
            data={dataAccount?.data}
            total={dataAccount?.total}
            page={configSearchChooseAccount?.page}
            pageSize={configSearchChooseAccount?.pageSize}
            setConfigPagination={setConfigSearchChooseAccount}
            selectedRows={selectedRecord}
            onSelectedRowsChange={setSelectedRecord}
            classNameWapperTable="!h-[200px]"
          />
        </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-3 px-5 py-3">
        <ButtonFlowbite color="blue" onClick={handleSave}>
          {t('save')}
        </ButtonFlowbite>
        <ButtonFlowbite color="failure" onClick={handleClose}>
          {t('cancel')}
        </ButtonFlowbite>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalSelectAccount
