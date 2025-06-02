import ButtonActionControls from '@renderer/components/ButtonActionControl'
import ButtonFlowbite from '@renderer/components/Default/ButtonFlowbite'
import FormScanPost from '@renderer/components/Form/FormScanPost'
import ModalSelectAccount from '@renderer/components/Modal/Account/ModalSelectAccount'
import type { IModalDefault, IObjectParams } from '@renderer/types'
import { Modal } from 'flowbite-react'
import { FC, useCallback, useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import TableScanPost from './TableScanPost'

interface ModalSettingProps extends IModalDefault<unknown> {}

const ModalScanPost: FC<ModalSettingProps> = ({ isShow, setIsShow }) => {
  const idForm = useId()
  const [isDisable] = useState(false)
  const { t } = useTranslation()

  const handleClosed = useCallback((): void => {
    setIsShow && setIsShow(false)
  }, [])

  const [configSearch, setConfigSearch] = useState<IObjectParams>({
    page: 1,
    pageSize: 1000
  })
  const [isShowModalSelectAccount, setIsShowModalSelectAccount] = useState(false)

  const [selectedRecords, setSelectedRecords] = useState((): ReadonlySet<string> => new Set())

  return (
    <Modal show={isShow} onClose={handleClosed} size="4xl">
      <Modal.Header>{t('scan_post')}</Modal.Header>
      <Modal.Body className="mt-2 mb-4 pb-10 h-[50vh] !flex-auto overflow-hidden">
        <form action="">
          <div className="flex items-center gap-5 mb-5">
            <ButtonActionControls
              configSearch={configSearch}
              setConfigSearch={setConfigSearch}
              accountsList={[]}
              categoryIds={configSearch.categoryId}
              isPendingStart={false}
              isShowFilter={false}
              isShowStatus={false}
              isShowCategorySelect={false}
              setSelectedRecords={setSelectedRecords}
            />
            <ButtonFlowbite
              onClick={() => setIsShowModalSelectAccount(true)}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {t('select_accounts')}
            </ButtonFlowbite>
          </div>
          <div className="h-full overflow-y-auto custom-scroll">
            <FormScanPost />
            <TableScanPost t={t} />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-3 px-5 py-3">
        <ButtonFlowbite form={idForm} type="submit" color="blue" disabled={isDisable}>
          {t('save')}
        </ButtonFlowbite>
        <ButtonFlowbite type="button" onClick={handleClosed} color="failure" disabled={isDisable}>
          {t('cancel')}
        </ButtonFlowbite>
      </Modal.Footer>
      {isShowModalSelectAccount && (
        <ModalSelectAccount
          isShow={isShowModalSelectAccount}
          setIsShow={setIsShowModalSelectAccount}
          selectedRecord={selectedRecords}
          setSelectedRecord={setSelectedRecords}
        />
      )}
    </Modal>
  )
}

export default ModalScanPost
