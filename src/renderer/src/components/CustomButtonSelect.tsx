import { Select } from '@mantine/core'
import { optionsFormat } from '@renderer/config'
import type { IOptionSelectFormat } from '@renderer/types'
import { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface CustomButtonSelectProps {
  values?: string[]
  onChange?: (value: string | null) => void
  options?: IOptionSelectFormat<string>[]
  prefix?: string
}

const CustomButtonSelect: FC<CustomButtonSelectProps> = ({
  values,
  onChange,
  options = optionsFormat,
  prefix = 'account_key.'
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

export default CustomButtonSelect
