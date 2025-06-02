import { Select } from '@mantine/core'
import { optionsFormatProxy } from '@renderer/config'
import { IOptionSelectFormat } from '@renderer/types'
import { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface CustomButtonSelectProxyProps {
  values?: string[]
  onChange?: (value: string | null) => void
  options?: IOptionSelectFormat<string>[]
  prefix?: string
}

const CustomButtonSelectProxy: FC<CustomButtonSelectProxyProps> = ({
  values,
  onChange,
  options = optionsFormatProxy,
  prefix = 'proxy_key'
}) => {
  const { t } = useTranslation()
  const handleTranslateLabel = useMemo(
    () =>
      options?.map((i) => ({
        value: i.value,
        label: t(`${prefix}${i.label}`?.trim()),
        disabled: values?.includes(i.value)
      })),
    [values, t, options, prefix]
  )

  return (
    <Select
      styles={{
        input: {
          paddingRight: 12,
          textAlign: 'center',
          outline: 'none',
          minHeight: 30,
          height: 30
        }
      }}
      value={null}
      width={170}
      data={handleTranslateLabel}
      variant="default"
      placeholder={'+'}
      onChange={(value) => {
        onChange && onChange(value)
      }}
    />
  )
}

export default CustomButtonSelectProxy
