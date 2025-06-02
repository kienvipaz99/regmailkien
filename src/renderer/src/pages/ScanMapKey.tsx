import { ButtonActionExportFile, TableScanMap } from '@renderer/components'
import FieldsetWapper from '@renderer/components/CustomFormField/FieldsetWapper'
import FormScanMap from '@renderer/components/Form/FormScanMap'
import LayoutWapper from '@renderer/components/LayoutWapper'
import ModalFilterScanMap from '@renderer/components/Modal/Default/ModalFilterScanMap'
import { configTableScanMap } from '@renderer/config'
import { useRemovePostByField, useStartAction } from '@renderer/services'
import { useReadAllAccount } from '@renderer/services/accountgmail/useReadAllAccount'
import { useReadSettingHistory } from '@renderer/services/setting/useReadSettingHistory'
import { IObjectParams } from '@renderer/types'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const ScanMapKey = (): JSX.Element => {
  const { t } = useTranslation()

  const { data: settingHistory } = useReadSettingHistory()
  const [configSearch, setConfigSearch] = useState<IObjectParams>({
    page: 1,
    pageSize: 1000,
    job_id: settingHistory?.create_gmail.jobId
  })
  const [selectedRecords, setSelectedRecords] = useState((): ReadonlySet<string> => new Set())
  const { mutate: removePostByField } = useRemovePostByField()
  // const { mutate: exportGMap } = useExportGMap()
  const { data: accountGmail, isFetching } = useReadAllAccount(configSearch)

  const [isShowModalFilter, setIsShowModalFilter] = useState(false)
  const { mutate: startAction } = useStartAction()

  const handleFastExport = (): void => {
    startAction({
      actionName: 'export_excel',
      data: [],
      jobId: settingHistory?.create_gmail.jobId,
      typeExport: 'gmail_export'
    })
  }

  useEffect(() => {
    setConfigSearch({ ...configSearch, job_id: settingHistory?.create_gmail.jobId })
  }, [settingHistory])

  return (
    <>
      <LayoutWapper layout="6|4">
        <FieldsetWapper
          classWapper="custom-table table-account rounded-[10px] !w-[calc(100%_-_395px)]]"
          title={t('list_account_created')}
        >
          <div className="py-[20px] px-[20px] space-y-5 ">
            <div className="flex justify-between items-center flex-wrap">
              <div className="flex gap-2 items-center ">
                <ButtonActionExportFile isFastExport handleFastExport={handleFastExport} />
              </div>
            </div>
          </div>
          <TableScanMap
            t={t}
            data={accountGmail?.data}
            total={accountGmail?.total}
            page={configSearch?.page}
            pageSize={configSearch?.pageSize}
            columns={configTableScanMap()}
            fetching={isFetching}
            selectedRows={selectedRecords}
            onSelectedRowsChange={setSelectedRecords}
            setConfigPagination={setConfigSearch}
            removePostByField={removePostByField}
          />
        </FieldsetWapper>
        <FieldsetWapper title={t('config_create_account')}>
          <FormScanMap />
        </FieldsetWapper>
        {isShowModalFilter && (
          <ModalFilterScanMap
            isShow={isShowModalFilter}
            setIsShow={setIsShowModalFilter}
            configSearch={configSearch}
            setConfigSearch={setConfigSearch}
          />
        )}
      </LayoutWapper>
    </>
  )
}

export default ScanMapKey
