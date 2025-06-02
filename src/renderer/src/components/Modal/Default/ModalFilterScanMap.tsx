/* eslint-disable @typescript-eslint/no-explicit-any */
import { ButtonFlowbite, TextAreaField } from '@renderer/components'
import type { IDispatchState, IObjectParams } from '@renderer/types'
import { Modal } from 'flowbite-react'
import { Dispatch, FC, memo, SetStateAction, useState } from 'react'
import { useTranslation } from 'react-i18next'
export interface ModalFilterProps {
  isShow: boolean
  setIsShow?: Dispatch<SetStateAction<boolean>>
  configSearch: IObjectParams
  setConfigSearch: IDispatchState<IObjectParams>
}
export interface IFormModalFilter {
  uids?: string
  names?: string
  categoryIds?: string[]
  status?: IObjectParams['filterType']
  checkpointState?: string[]
}

const ModalFilterScanMap: FC<ModalFilterProps> = ({
  isShow,
  setIsShow,
  configSearch,
  setConfigSearch
}) => {
  const { t } = useTranslation()
  const [configFilterModal, setConfigFilterModal] = useState<IObjectParams>(configSearch)

  const handleChangeConfigStatus = (name: string, value: string | string[]): void => {
    setConfigFilterModal((prev) => {
      if (name === 'filterType' && ['live', 'die', 'all'].includes(value as string)) {
        return { ...prev, [name]: value as IObjectParams['filterType'] }
      } else if (name === 'checkpointState') {
        return { ...prev, [name]: value as string[] }
      } else if (name === 'uids' || name === 'names') {
        return { ...prev, [name]: (value as string).split('\n').filter(Boolean) }
      } else {
        return { ...prev, [name]: value }
      }
    })
  }

  const handleSubmitFilter = (): void => {
    setConfigSearch(configFilterModal)
    handleClose()
  }
  const handleClose = (): void => setIsShow && setIsShow(false)

  return (
    <Modal show={isShow} onClose={handleClose}>
      <Modal.Header>{t('config_menu.filter')}</Modal.Header>
      <Modal.Body>
        <TextAreaField
          onChange={(e) => handleChangeConfigStatus(e.target.name, e.target.value)}
          name="keyword"
          rows={4}
          classWapper="flex flex-col"
          placeholder={t('placeholder_keyword')}
          label={t('keywords')}
        />
        <TextAreaField
          onChange={(e) => handleChangeConfigStatus(e.target.name, e.target.value)}
          name="location"
          rows={2}
          classWapper="flex flex-col"
          placeholder={t('placeholder_location')}
          label={t('location')}
        />
        <TextAreaField
          onChange={(e) => handleChangeConfigStatus(e.target.name, e.target.value)}
          name="industry"
          rows={2}
          classWapper="flex flex-col"
          placeholder={t('placeholder_industry')}
          label={t('industry')}
        />
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-3 px-5 py-3">
        <ButtonFlowbite onClick={handleClose} color="failure">
          {t('cancel')}
        </ButtonFlowbite>
        <ButtonFlowbite color="blue" onClick={handleSubmitFilter}>
          {t('apply')}
        </ButtonFlowbite>
      </Modal.Footer>
    </Modal>
  )
}

export default memo(ModalFilterScanMap)
