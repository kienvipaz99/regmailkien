import {
  ButtonFlowbite,
  FieldsetWapper,
  LayoutWapper,
  ModalCreateConfigProxy
} from '@renderer/components'
import FormUpdateProxyDynamic from '@renderer/components/Form/FormUpdateProxyDynamic'
import ItemProxyDynamic from '@renderer/components/ItemProxyDynamic'
import useCustomFormik from '@renderer/hook/useCustomFormik'
import { useReadSettingProxy, useUpdateSettingBy } from '@renderer/services'
import { useReadProxyRotateByParams, useUpdateProxyRotateByField } from '@renderer/services/proxy'
import { Proxy } from '@vitechgroup/mkt-proxy-client'
import { useFormik } from 'formik'
import { isEmpty } from 'lodash'
import { CircleFadingPlus } from 'lucide-react'
import { useEffect, useId, useMemo, useState } from 'react'

const ProxyDynamic = (): JSX.Element => {
  const idForm = useId()
  const { t, configSearch } = useCustomFormik({
    ACTION_TYPE: 'base_action',
    defaultValues: {}
  })

  const { data: proxyData } = useReadProxyRotateByParams({
    ...configSearch,
    proxyType: ['v4_rotate', 'v6_rotate', 'key_proxy']
  })
  const { data: dataSetting } = useReadSettingProxy()
  const { mutate: updateSettings } = useUpdateSettingBy('setting_proxy')
  const { mutate: updateProxyRotateByField } = useUpdateProxyRotateByField()

  const [selectedProxy, setSelectedProxy] = useState<Proxy | null>(null)
  const [isShowModalAddProxy, setIsShowModalAddProxy] = useState(false)

  const formik = useFormik<Partial<Proxy>>({
    initialValues: selectedProxy ?? {},
    onSubmit: (values) => {
      if (values.id) {
        updateProxyRotateByField({
          key: 'id',
          value: {
            key: values.key,
            apiKey: values.apiKey,
            proxyType: values.proxyType
          },
          select: [values.id]
        })
      }
    }
  })

  const typeConfigProxyExits = useMemo(
    () => [
      ...new Set(proxyData?.data?.map((item) => item?.provider).filter((item) => item !== null))
    ],
    [proxyData?.data]
  )

  useEffect(() => {
    if (selectedProxy) {
      formik.setValues(selectedProxy)
    }
  }, [selectedProxy])

  useEffect(() => {
    if (dataSetting?.type_proxy) {
      const matchedProxy = proxyData?.data?.find((item) => item.provider === dataSetting.type_proxy)
      setSelectedProxy(matchedProxy ?? null)
    }
  }, [dataSetting?.type_proxy, proxyData?.data])

  const layoutValue = proxyData?.data && proxyData.data.length > 0 ? '6|4' : '10'

  return (
    <LayoutWapper layout={layoutValue}>
      <FieldsetWapper
        classWapper="custom-table rounded-[10px]"
        classNameChildren="!bg-transparent"
        title={t('list_proxy_dynamic')}
      >
        <div className="pt-5 px-2">
          <ButtonFlowbite
            className="addaccount"
            size="sm"
            color="blue"
            StartIcon={CircleFadingPlus}
            onClick={() => setIsShowModalAddProxy(true)}
          >
            {t('create_proxy_config')}
          </ButtonFlowbite>
        </div>

        <div className="flex-1 min-h-0 custom_scroll  gap-3 overflow-y-auto grid grid-cols-1 md:grid-cols-2">
          {proxyData?.data?.map((item) => (
            <ItemProxyDynamic
              key={item?.id}
              clsName="h-[150px]"
              checked={dataSetting?.type_proxy === item?.provider}
              id={item?.id}
              title={item?.provider ?? '-'}
              protocol={item?.proxyType ?? '-'}
              setIdChecked={(e) => {
                const isChecked = e.target.checked
                const newProxy = isChecked ? item : null
                setSelectedProxy(newProxy)
                updateSettings({
                  key: 'setting_proxy',
                  value: {
                    ...dataSetting,
                    type_proxy: newProxy?.provider ?? null
                  }
                })
              }}
              date={item.createdAt}
            />
          ))}
        </div>
      </FieldsetWapper>

      {proxyData?.data && proxyData?.data?.length > 0 && (
        <FieldsetWapper
          classWapper="custom-table rounded-[10px] p-5"
          classNameChildren="!bg-transparent"
          title={t('config_proxy_dynamic')}
        >
          <form id={idForm} onSubmit={formik.handleSubmit}>
            <FormUpdateProxyDynamic
              formik={formik}
              disabled={isEmpty(dataSetting?.type_proxy)}
              idForm={idForm}
            />
          </form>
        </FieldsetWapper>
      )}

      {isShowModalAddProxy && (
        <ModalCreateConfigProxy
          openModal={isShowModalAddProxy}
          setOpenModal={setIsShowModalAddProxy}
          typeProxyExits={typeConfigProxyExits}
        />
      )}
    </LayoutWapper>
  )
}

export default ProxyDynamic
