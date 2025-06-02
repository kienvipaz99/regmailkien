import {
  CheckBoxField,
  InputField,
  RadioField,
  Tooltips,
  ToolTipsCustom
} from '@renderer/components'
import { cn } from '@renderer/helper'
import { FormikProps } from 'formik'
import { get } from 'lodash'
import { HTMLProps, ReactNode, useId } from 'react'
import { CheckBoxFieldProps } from './CheckBoxField'
import { InputFieldProps } from './InputField'
import { RadioFieldProps } from './RadioField'

type sizeInputGroup = 'xs' | 'sm' | 'md' | 'lg' | 'auto'

interface InputGroupCheckboxNumberProps<T> {
  formik?: FormikProps<T>
  isShowPaddingCheckbox?: boolean
  config?: {
    nameRadio?: string
    nameCheckbox?: string
    nameInputOne?: string
    nameInputTwo?: string
    checkboxProps?: Omit<CheckBoxFieldProps<T>, 'name'>
    inputOneProps?: Omit<InputFieldProps<T>, 'name'>
    inputTwoProps?: Omit<InputFieldProps<T>, 'name'>
    radioProps?: Omit<RadioFieldProps<T>, 'name'>
  }
  configLabel?: {
    label: ReactNode
    props?: HTMLProps<HTMLLabelElement>
    className?: string
  }
  configLabelTwo?: {
    label: ReactNode
    props?: HTMLProps<HTMLLabelElement>
    className?: string
  }
  configTooltip?: {
    content: ReactNode
    props?: Omit<ToolTipsCustom, 'content'>
  }
  suffix?: ReactNode
  size?: sizeInputGroup
  numberSize?: number
  classWapper?: string
  disabled?: boolean
}

const InputGroupVariantClasses: Record<sizeInputGroup, string> = {
  xs: 'w-[200px]',
  sm: 'w-[230px]',
  md: 'w-[300px]',
  lg: 'w-[400px]',
  auto: ''
}

const InputGroupCheckboxNumber = <T,>({
  formik,
  config,
  configLabel,
  configLabelTwo,
  configTooltip,
  suffix,
  isShowPaddingCheckbox,
  size = 'sm',
  numberSize,
  classWapper,
  disabled = false
}: InputGroupCheckboxNumberProps<T>): JSX.Element => {
  const idLabel = useId()
  const isShowLabel = configLabel?.label || configTooltip?.content
  const handleChangeInputTwo = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (config?.nameInputOne && config?.nameInputTwo) {
      const valueFrom = Number(get(formik?.values, config?.nameInputOne) || 0)
      const valueTo = Number(event.target.value || 0)
      // console.log(valueFrom, valueTo)
      if (valueTo < valueFrom + 5) {
        console.warn(`Giá trị tối thiểu phải là ${valueFrom + 5}`)
      } else {
        formik?.setFieldValue(config?.nameInputTwo, valueTo)
      }
    }
  }

  const handleInputInputTwo = (event: React.FormEvent<HTMLInputElement>): void => {
    if (config?.nameInputOne && config?.nameInputTwo) {
      const valueFrom = Number(get(formik?.values, config?.nameInputOne) || 0)
      const valueTo = Number(event.currentTarget.value || 0)
      // console.log(valueFrom, valueTo)

      if (valueTo < valueFrom + 5) {
        console.warn(`Giá trị tối thiểu phải là ${valueFrom + 5}`)
      }
    }
  }

  const handleBlurInputTwo = (event: React.FocusEvent<HTMLInputElement>): void => {
    if (config?.nameInputOne && config?.nameInputTwo) {
      const valueFrom = Number(get(formik?.values, config?.nameInputOne) || 0)
      let valueTo = Number(event.target.value || 0)
      // console.log(valueFrom, valueTo)

      if (valueTo < valueFrom + 5) {
        valueTo = valueFrom + 5
        formik?.setFieldValue(config?.nameInputTwo, valueTo)
      }
    }
  }
  return (
    <div className={cn('flex items-center flex-wrap gap-3', classWapper)}>
      {(config?.nameCheckbox || isShowLabel || config?.nameRadio) && (
        <div className="flex items-center">
          {config?.nameCheckbox && (
            <CheckBoxField
              disabled={disabled}
              formik={formik}
              name={config?.nameCheckbox}
              id={idLabel}
              {...(config?.checkboxProps ?? {})}
            />
          )}

          {config?.nameRadio && (
            <RadioField
              disabled={disabled}
              formik={formik}
              name={config?.nameRadio}
              id={idLabel}
              {...(config?.radioProps ?? {})}
            />
          )}

          {isShowLabel && (
            <div
              className={cn(
                'flex items-center',
                configTooltip?.content && 'gap-2',
                !(config?.nameCheckbox || config?.nameRadio) &&
                  isShowPaddingCheckbox &&
                  'ml-[20px]',
                !numberSize && size ? InputGroupVariantClasses[size] : ''
              )}
              style={{
                width: numberSize
              }}
            >
              {configLabel?.label && (
                <label
                  htmlFor={idLabel}
                  {...(configLabel?.props ?? {})}
                  className={cn(
                    'text-sm font-medium text-gray-900',
                    (config?.nameCheckbox || config?.nameRadio) && 'px-2 cursor-pointer',
                    !(config?.nameCheckbox || config?.nameRadio) && isShowPaddingCheckbox && 'pl-2',
                    configLabel?.props?.className,
                    configLabel.className
                  )}
                >
                  {configLabel?.label}
                </label>
              )}
              {configTooltip?.content && (
                <Tooltips content={configTooltip?.content} {...(configTooltip?.props ?? {})} />
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-2">
        {config?.nameInputOne && (
          <InputField
            disabled={disabled}
            formik={formik}
            type="number"
            name={config?.nameInputOne}
            classWapper="w-[70px] [&>*>input]:px-2 [&>*>input]:py-1"
            min={0}
            {...(config?.inputOneProps ?? {})}
          />
        )}
        {configLabelTwo?.label && (
          <label
            htmlFor={idLabel}
            {...(configLabelTwo?.props ?? {})}
            className={cn(
              'text-sm font-medium text-gray-900',
              (config?.nameCheckbox || config?.nameRadio) && 'px-2 cursor-pointer',
              !(config?.nameCheckbox || config?.nameRadio) && isShowPaddingCheckbox && 'pl-2',
              configLabelTwo?.props?.className
            )}
          >
            {configLabelTwo?.label}
          </label>
        )}

        {config?.nameInputTwo && (
          <InputField
            disabled={disabled}
            formik={formik}
            type="number"
            name={config?.nameInputTwo}
            classWapper="w-[70px] [&>*>input]:px-2 [&>*>input]:py-1"
            onInput={handleInputInputTwo}
            onChange={handleChangeInputTwo}
            onBlur={handleBlurInputTwo}
            {...(config?.inputTwoProps ?? {})}
          />
        )}

        {suffix && <span className="text-sm font-medium text-gray-900">{suffix}</span>}
      </div>
    </div>
  )
}

export default InputGroupCheckboxNumber
