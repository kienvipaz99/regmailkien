import { Button } from 'flowbite-react'
import { ChangeEventHandler, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useReadSettingProxy, useUpdateSettingBy } from '../services'
import { useDeleteProxyRotate } from '../services/proxy'
import { convertTimestampToDate } from '../utils'
import { ModalConfirm } from './Modal'

interface ItemProxyDynamicProps {
  id?: string
  title?: string
  desc?: string
  protocol?: string
  date?: number | string | null | Date
  checked?: boolean
  setIdChecked?: ChangeEventHandler<HTMLInputElement> | undefined
  clsName?: string
}

const ItemProxyDynamic = ({
  id,
  date,
  protocol,
  title,
  checked,
  clsName,
  setIdChecked
}: ItemProxyDynamicProps): JSX.Element => {
  const { t } = useTranslation()
  const [isShowConfirm, setIsShowConfirm] = useState(false)
  const { data: dataSetting } = useReadSettingProxy()
  const { mutate: updateSettings } = useUpdateSettingBy('setting_proxy')

  return (
    <div className={`${clsName} border border-gray-300 rounded-lg  mt-2 ml-2`}>
      <div className="flex items-start justify-between p-2">
        <div>
          <div className="flex items-end gap-2">
            <h3 className="text-xl font-semibold">{t('supplier')}:</h3>
            <h4 className="text-base font-semibold">{t(title ?? '')}</h4>
          </div>

          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold">{t('proxy_type')}:</p>
            <p className="text-xs">{t(protocol ?? '')}</p>
          </div>
        </div>
        <input
          type="radio"
          name={id}
          checked={checked}
          onChange={setIdChecked}
          className="w-5 h-5 m-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
      </div>
      <hr className="w-[95%] text-center relative top-[5px] m-auto" />
      <div className="p-2 flex items-center justify-between mt-2">
        <div>
          <p className="text-base font-semibold">{t('create_at')}</p>
          <span>{date ? convertTimestampToDate(date) : '-'}</span>
        </div>
        <Button color="failure" size="sm" onClick={() => setIsShowConfirm(true)}>
          {t('delete')}
        </Button>
      </div>

      <ModalConfirm
        isShow={isShowConfirm}
        setIsShow={setIsShowConfirm}
        CallAPi={useDeleteProxyRotate}
        onChange={(mutate) =>
          id &&
          mutate?.(
            { ids: [id] },
            {
              onSettled: (res) => {
                if (res?.status === 'success') {
                  if (
                    dataSetting?.selected_proxy === 'proxy_rotating' &&
                    title === dataSetting.type_proxy
                  ) {
                    updateSettings({
                      key: 'setting_proxy',
                      value: {
                        ...dataSetting
                      }
                    })
                  }
                }
              }
            }
          )
        }
      />
    </div>
  )
}

export default ItemProxyDynamic
