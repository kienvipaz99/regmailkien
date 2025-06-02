/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ButtonFlowbite,
  SelectField,
  SelectScrollCategory,
  TextAreaField
} from '@renderer/components'
import { configStatus, configTag } from '@renderer/config'
import type { IDispatchState, IObjectParams } from '@renderer/types'
import { Modal } from 'flowbite-react'
import { Dispatch, FC, memo, SetStateAction, useMemo, useState } from 'react'
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

const ModalFilter: FC<ModalFilterProps> = ({
  isShow,
  setIsShow,
  configSearch,
  setConfigSearch
}) => {
  const { i18n, t } = useTranslation()
  const [configFilterModal, setConfigFilterModal] = useState<IObjectParams>(configSearch)
  const handleChangeConfigCategory = (name: string, value: string): void => {
    setConfigFilterModal((prev) => {
      if (name === 'categoryId') {
        return { ...prev, [name]: [value] }
      } else {
        return { ...prev, [name]: value }
      }
    })
  }

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

  const optionsTags = useMemo(
    () => configTag?.map((tag) => ({ ...tag, label: t(tag?.label) })),
    [i18n?.language]
  )

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
          name="uids"
          rows={4}
          classWapper="flex flex-col"
          placeholder={t('enter_uid_one_uid_per_line')}
          label={t('account_key.uid')}
        />
        <TextAreaField
          onChange={(e) => handleChangeConfigStatus(e.target.name, e.target.value)}
          name="names"
          rows={4}
          classWapper="flex flex-col"
          placeholder={t('enter_names_line_by_line')}
          label={t('account_key.name')}
        />
        <p className="text-sm mb-2 font-medium block w-[12rem] flex-shrink-0">
          {t('account_key.category')}
        </p>
        <SelectScrollCategory
          name="categoryId"
          classWapper="w-full my-3"
          value={configFilterModal?.categoryId?.[0]}
          onChange={(e: any) => e && handleChangeConfigCategory('categoryId', e.value)}
        />
        <div className="flex gap-3">
          <SelectField
            name="filterType"
            options={configStatus}
            isClearable
            classWapper="flex flex-1 flex-col w-1/2"
            placeholder={t('status')}
            onChange={(e: any) => e && handleChangeConfigStatus('filterType', e.value)}
          />
          <SelectField
            name="checkpointState"
            options={optionsTags}
            isMulti
            isClearable
            classWapper="flex flex-1 flex-col w-1/2 type-select"
            placeholder={t('account_key.state_key')}
            onChange={(selectedOptions: any) => {
              const values = selectedOptions
                ? selectedOptions.map((option: any) => option.value)
                : []
              handleChangeConfigStatus('checkpointState', values)
            }}
          />
        </div>
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

export default memo(ModalFilter)
