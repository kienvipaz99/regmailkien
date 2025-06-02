/* eslint-disable @typescript-eslint/no-explicit-any */
import { ButtonFlowbite, SelectField, TextAreaField } from '@renderer/components'
import { IDispatchState, IObjectParams } from '@renderer/types'
import { Modal, Radio } from 'flowbite-react'
import { Dispatch, FC, memo, SetStateAction, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
export interface ModalFilterHistoryProxyProps {
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

const ModalFilterHistoryProxy: FC<ModalFilterHistoryProxyProps> = ({
  isShow,
  setIsShow,
  configSearch,
  setConfigSearch
}) => {
  const { i18n, t } = useTranslation()
  const [configFilterModal, setConfigFilterModal] = useState<IObjectParams>(configSearch)

  const handleChangeConfigStatus = (name: string, value: string | string[]): void => {
    setConfigFilterModal((prev) => {
      return { ...prev, [name]: value }
    })
  }

  const optionsEvent = useMemo(
    () => [
      { value: 'all', label: t('all') },
      { value: 'assigned', label: t('Assigned') },
      { value: 'request', label: t('Request') },
      { value: 'error', label: t('Error') }
    ],
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
        <div className="space-y-5">
          <div>
            <p className="text-xs">{t('by_event')}</p>
            <SelectField
              name="event"
              options={optionsEvent}
              isClearable
              classWapper="w-full"
              placeholder={t('by_event')}
              onChange={(e: any) => e && handleChangeConfigStatus('event', e.value)}
            />
          </div>
          <TextAreaField
            onChange={(e) => handleChangeConfigStatus(e.target.name, e.target.value)}
            name="proxy"
            rows={4}
            classWapper="flex flex-col"
            placeholder={t('enter_search_proxy')}
            label={t('by_proxy')}
          />
          <div className="space-y-2">
            <p className="text-xs">{t('by_status')}</p>
            <div className="flex items-start flex-col gap-2">
              <div className="flex items-center gap-1">
                <Radio
                  id="status-success"
                  name="status"
                  value={'success'}
                  onChange={(e) => {
                    handleChangeConfigStatus('status', e.target?.checked ? 'success' : '')
                  }}
                />
                <label htmlFor="status-success">{t('success')}</label>
              </div>
              <div className="flex items-center gap-1">
                <Radio
                  id="status-failed"
                  name="status"
                  value={'failed'}
                  onChange={(e) => {
                    handleChangeConfigStatus('status', e.target?.checked ? 'failed' : '')
                  }}
                />
                <label htmlFor="status-failed">{t('error')}</label>
              </div>
            </div>
          </div>
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

export default memo(ModalFilterHistoryProxy)
