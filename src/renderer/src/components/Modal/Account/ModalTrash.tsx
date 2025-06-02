import type { Account } from '@preload/types'
import ButtonActionDeleteAccount from '@renderer/components/ButtonAction/Account/ButtonActionDeleteAccount'
import ButtonActionRecoveryAccount from '@renderer/components/ButtonAction/Account/ButtonActionRecoveryAccount'
import ButtonActionRecoveryAccountByCategory from '@renderer/components/ButtonAction/Account/ButtonActionRecoveryAccountByCategory'
import InputFilter from '@renderer/components/CustomFormField/InputFilter'
import { useShowHideColumn } from '@renderer/components/ReactTableGridCustom/hooks'
import SelectScrollCategory from '@renderer/components/SelectScrollCategory'
import TableAccountTrash from '@renderer/components/Table/Account/TableAccountTrash'
import { configTableManagerAccount } from '@renderer/config/configTable/account'
import { useReadAccountByParams } from '@renderer/services'
import type { IObjectParams } from '@renderer/types'
import { Modal } from 'flowbite-react'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface ModalTrashProps {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  setIsCall?: Dispatch<SetStateAction<boolean>>
}

const ModalTrash: FC<ModalTrashProps> = ({ isOpen, setIsOpen }): JSX.Element => {
  const { t } = useTranslation()
  const [selectedRecords, setSelectedRecords] = useState((): ReadonlySet<string> => new Set())
  const [categoryIds, setCategoryIds] = useState<string[]>([])

  const [configSearch, setConfigSearch] = useState<IObjectParams>({
    page: 1,
    pageSize: 1000,
    is_show: false
  })

  const { data: dataAccountTrash, isFetching } = useReadAccountByParams(configSearch)

  const handleClose = (): void => setIsOpen(false)

  const { columnsTable } = useShowHideColumn<Account>({
    columns: configTableManagerAccount()
  })

  return (
    <Modal show={isOpen} size={'4xl'} onClose={handleClose} popup>
      <Modal.Header className="[&>h3]:font-semibold [&>h3]:text-lg !px-5 !py-3">
        {t(`trash_can`)}
      </Modal.Header>

      <Modal.Body>
        <div className="flex gap-2">
          <ButtonActionRecoveryAccount accounts={Array.from(selectedRecords)} />

          <ButtonActionRecoveryAccountByCategory categoryIds={categoryIds} />

          <ButtonActionDeleteAccount
            accountsIds={Array.from(selectedRecords)}
            categoryIds={categoryIds}
            setAccountIds={setSelectedRecords}
            setCategoryIds={setCategoryIds}
          />
        </div>

        <div className="relative border border-[#4361EE] p-2 border-dashed rounded-lg mt-[35px] flex-auto">
          <p className="bg-white relative text-[#4361EE] font-medium text-[18px] -top-[25px] w-max px-[10px]">
            {t('list_delete')}
          </p>

          <div className="flex justify-between mb-5 -mt-[10px]">
            <InputFilter
              isButton
              isGroup
              onChangeValue={(value) => {
                setConfigSearch((prev) => ({ ...prev, search: value }))
              }}
            />

            <SelectScrollCategory
              name="categoryIds"
              classWapper="!w-[275px]"
              value={categoryIds}
              isClearable
              changeSelected={(selected) => {
                if (selected && selected?.value === categoryIds?.[0]) return
                const newValue = selected?.value ? [selected?.value] : []
                setConfigSearch((prev) => ({
                  ...prev,
                  categoryId: newValue
                }))
                setCategoryIds(newValue)
              }}
            />
          </div>

          <TableAccountTrash
            t={t}
            data={dataAccountTrash?.data ?? []}
            selectedRows={selectedRecords}
            onSelectedRowsChange={setSelectedRecords}
            page={configSearch?.page}
            pageSize={configSearch?.pageSize}
            total={dataAccountTrash?.total}
            setConfigPagination={setConfigSearch}
            columns={columnsTable}
            fetching={isFetching}
          />
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default ModalTrash
