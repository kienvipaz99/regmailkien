import {
  dataOptionProxy,
  defaultSettingProxy,
  getDraftValueModalSetting,
  handleSyncDataModalSettings,
  ISettingProxy
} from '@preload/types'
import { getValueSelected } from '@renderer/helper'
import { useDraftLocalModalSetting } from '@renderer/hook'
import { useReadSettingProxy, useUpdateSettingBy } from '@renderer/services'
import { DefaultSettingProps } from '@renderer/types'
import { useFormik } from 'formik'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { IoRemoveCircleOutline } from 'react-icons/io5'
import { NavLink } from 'react-router-dom'
import {
  InputField,
  RadioField,
  SelectField,
  SwitchField,
  TextAreaField
} from '../../../CustomFormField'
import BoxItemSetting from '../Components/BoxItemSetting'
import { arrProxymart, IListViewProxyItem, ListViewProxy } from '../Components/ConfigSetting'

const SettingProxy = ({ formId, handleClosed }: DefaultSettingProps): JSX.Element => {
  const { data: dataSetting, isFetched } = useReadSettingProxy()
  const { mutate: updateSettings } = useUpdateSettingBy('setting_proxy')
  const { t } = useTranslation()

  const formik = useFormik({
    initialValues: (getDraftValueModalSetting('setting_proxy') ??
      defaultSettingProxy) as ISettingProxy,
    onSubmit(values) {
      console.log('values', values)

      updateSettings(
        { key: 'setting_proxy', value: values },
        {
          onSettled: (result) => {
            result?.status === 'success' && handleClosed && handleClosed()
          }
        }
      )
    }
  })

  useDraftLocalModalSetting({ key: 'setting_proxy', formik: formik })
  const typeChangeIp = formik?.values?.type_proxy

  const valueCurrentOption = useMemo(() => {
    const newTypeChangeIpOption = arrProxymart.includes(typeChangeIp)
      ? 'proxy_mart_reseller'
      : typeChangeIp
    return getValueSelected(newTypeChangeIpOption, dataOptionProxy)
  }, [typeChangeIp])

  const currentListViewProxy = useMemo((): Partial<IListViewProxyItem> => {
    return typeChangeIp ? ListViewProxy[typeChangeIp] : {}
  }, [typeChangeIp])

  const DescCurrentListProxy = useMemo((): IListViewProxyItem['desc'] => {
    return currentListViewProxy?.desc
  }, [currentListViewProxy])

  const handleResetTextArea = (name: string): void => {
    formik?.setFieldValue(`${name}.list_key`, dataSetting?.[name].list_key)
    if (name === 'proxy_mart_reseller')
      formik?.setFieldValue(`${name}.api_key`, dataSetting?.[name].api_key)
  }

  useEffect(() => {
    handleSyncDataModalSettings({
      isFetched,
      nameTab: 'setting_proxy',
      dataSetting: dataSetting as ISettingProxy,
      formik
    })
  }, [dataSetting, isFetched])
  return (
    <form id={formId} onSubmit={formik.handleSubmit} className="modal-seting-proxy">
      <div className="flex flex-col gap-2 no-change-proxy">
        <div id="nochange" className="flex justify-between items-center my-3">
          <BoxItemSetting
            Icon={IoRemoveCircleOutline}
            title="setting.no_change_ip"
            desc="setting.use_lan_or_wifi_network"
          />

          <div className="flex items-center space-x-2 w-[150px]">
            <SwitchField
              formik={formik}
              name="type_proxy"
              size="md"
              classWapper="cursor-pointer"
              value={'no_change_ip'}
              label={t('setting.local_ip')}
            />
          </div>
          <div className="col-span-2 flex space-x-2 items-center !w-[250px]">
            <InputField
              name="ip_local"
              formik={formik}
              disabled
              className="w-full"
              classWapper="w-full"
            />
          </div>
        </div>
      </div>
      <hr className="my-5" />
      <div className="flex flex-col gap-2 change-proxy">
        <div id="changeIp" className="flex justify-between items-center my-3">
          <BoxItemSetting
            Icon={IoRemoveCircleOutline}
            title="setting.change_ip"
            desc={
              <div className="flex gap-[5px] nowrap">
                <p className="text-sm text-blue-500 pl-0 whitespace-nowrap">
                  {t('setting.url_buy_proxy')}
                </p>
                {!!currentListViewProxy && (
                  <NavLink
                    to={currentListViewProxy?.href ?? ''}
                    className="text-sm text-blue-500 font-semibold pl-0 whitespace-nowrap"
                    target={currentListViewProxy?.isNotBlank ? undefined : '_blank'}
                    onClick={(e) => !currentListViewProxy?.href && e.preventDefault()}
                  >
                    {currentListViewProxy?.title}
                  </NavLink>
                )}
              </div>
            }
          />
          <div className="flex items-center space-x-2 w-[150px]">
            <SwitchField
              formik={formik}
              name="type_proxy"
              size="md"
              classWapper="cursor-pointer"
              label={t('setting.local_ip')}
              checked={typeChangeIp !== 'no_change_ip'}
              onChange={() => {
                const value = dataOptionProxy?.[0]?.value
                formik?.setFieldValue('type_proxy', value)
                handleResetTextArea(value)
              }}
            />
          </div>
          <div className="col-span-2 flex space-x-2 items-center">
            <SelectField
              name="type_proxy"
              isDisabled={typeChangeIp === 'no_change_ip'}
              className="!w-[250px]"
              value={valueCurrentOption}
              options={dataOptionProxy}
              changeSelected={(selected) => {
                if (selected?.value === typeChangeIp) return
                if (selected?.value) {
                  formik.setFieldValue('type_proxy', selected?.value)
                  handleResetTextArea(selected?.value)
                }
              }}
            />
          </div>
        </div>
        {!['no_change_ip'].includes(typeChangeIp) && (
          <div className="flex gap-4 content mb-3">
            <div className="w-1/2 font-medium text-slate-500 text-sm ml-3 col-span-4 self-start text-left mr-4 leading-6">
              {DescCurrentListProxy && <DescCurrentListProxy t={t} />}
            </div>
            <div className="col-span-4 w-1/2">
              <div>
                {arrProxymart.includes(typeChangeIp) && (
                  <div className="flex gap-10 mb-2">
                    <RadioField
                      formik={formik}
                      name="type_proxy"
                      label="Key Proxy Xoay"
                      value="proxy_mart_key"
                    />
                    <RadioField
                      formik={formik}
                      name="type_proxy"
                      label="IPV6 Xoay"
                      value="proxy_mart_reseller"
                    />
                  </div>
                )}

                <TextAreaField
                  formik={formik}
                  name={`${typeChangeIp}.list_key`}
                  placeholder={t('each_key_has1_line')}
                  clsTextArea="h-[250px] bg-[#ffff] !px-2"
                />

                {typeChangeIp === 'proxy_mart_reseller' && (
                  <InputField
                    formik={formik}
                    name={`${typeChangeIp}.api_key`}
                    placeholder={t('please_enter_proxy_mart_api_key')}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  )
}

export default SettingProxy
