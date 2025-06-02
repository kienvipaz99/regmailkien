/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn, convertViToEn } from '@renderer/helper'
import type { CustomSelectProps } from '@renderer/types'
import { get } from 'lodash'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Select, { ControlProps, CSSObjectWithLabel, StylesConfig } from 'react-select'
import ErrorHelperText from './ErrorHelperText'
import WapperLabelForm from './WapperLabelForm'

export const SelectField = <T,>({
  className,
  placeholder,
  options,
  isMulti = false,
  label,
  classWapper,
  isRequired,
  name,
  formik,
  height = '42px',
  isVertical,
  msgError,
  changeSelected,
  value,
  setValueSearch,
  clsLabelWrapper,
  ...spread
}: CustomSelectProps<T>): JSX.Element => {
  const { i18n, t } = useTranslation()
  const newOption = useMemo(() => {
    return options?.map((item: any) => ({ ...item, label: t(`${item?.label}`) }))
  }, [options, t, i18n?.language])

  const onChange = (option: any | any[]): void => {
    if (formik) {
      if (!option) {
        formik?.setFieldValue(name, isMulti ? [] : '')
      } else {
        formik?.setFieldValue(
          name,
          isMulti ? (option as any[]).map((item: any) => item.value) : (option as any).value
        )
      }
    }
    changeSelected && changeSelected(option as any)
  }

  const getValue = useCallback((): any => {
    if (options && formik) {
      const value = get(formik?.values, name)
      if (isMulti) {
        return (value ?? []).reduce((total: any[], current: any) => {
          const currentOption = (options as any[])?.find((opt) => opt?.value === current)
          if (currentOption) {
            total.push(currentOption)
          }
          return total
        }, [] as any[])
      } else {
        return options.filter((option: any) => option.value === value)
      }
    } else {
      return isMulti ? [] : ('' as any)
    }
  }, [options, formik, name, isMulti])

  const newValue = useMemo(() => (formik ? getValue() : value), [value, formik])
  const transformedNewValue = Array.isArray(newValue)
    ? newValue?.map((item) => ({
        ...item,
        label: t(`${item.label}`)
      }))
    : newValue

  const customStyles: StylesConfig = {
    control: (base: CSSObjectWithLabel, state: ControlProps) => ({
      ...base,
      backgroundColor: '#FFFFFF',
      // Overwrittes the different states of border
      borderColor: 'rgb(226 232 240 / 1)',
      textAlign: 'left',

      // Removes weird border around container
      boxShadow: state.isFocused ? undefined : undefined,
      height: height ?? '38px',
      '&:hover': {
        // Overwrittes the different states of border
        borderColor: 'rgb(226 232 240 / 1)',

        backgroundColor: 'rgb(248 250 252 / 1)'
      },
      '&:focus': {
        // Overwrittes the different states of border
        color: '#495057',
        backgroundColor: '#fff',
        borderColor: '#80bdff',
        outline: 0,
        boxShadow: '0 0 0 0.2rem rgb(0 123 255 / 25%)'
      }
    }),
    container: (base: CSSObjectWithLabel) => ({
      ...base,
      width: '100%'
    }),
    indicatorsContainer: (base: CSSObjectWithLabel) => ({
      ...base,
      borderColor: 'transparent'
    }),
    indicatorSeparator: (base: CSSObjectWithLabel) => ({
      ...base,
      width: 0
    }),
    menuPortal: (provided: CSSObjectWithLabel) => ({ ...provided, zIndex: 9999 }),
    menu: (provided: CSSObjectWithLabel) => ({ ...provided, zIndex: 9999 }),
    placeholder: (base: CSSObjectWithLabel) => ({
      ...base,
      fontSize: '0.875rem'
    })
  }

  const customFilter = (option: any, inputValue: any): boolean => {
    const labelValue = convertViToEn(option.label ?? '')
    const valueString = convertViToEn(inputValue ?? '').replace(/^\s+|\s+$/gm, '')
    const serching = labelValue.includes(valueString)
    setValueSearch && setValueSearch(inputValue)
    return serching
  }

  return (
    <WapperLabelForm
      isRequired={isRequired}
      label={label}
      classWapper={classWapper}
      isVertical={isVertical}
      clsLabelWrapper={clsLabelWrapper}
    >
      <Select
        className={cn('shadow-sm whitespace-nowrap', className)}
        name={name}
        value={transformedNewValue}
        onChange={onChange}
        placeholder={placeholder}
        options={newOption}
        isMulti={isMulti}
        styles={customStyles}
        filterOption={customFilter}
        menuPortalTarget={window.document.body}
        onBlur={formik ? formik?.handleBlur : spread?.onBlur}
        {...spread}
      />

      <ErrorHelperText
        isShow={(formik && get(formik?.touched, name) && get(formik?.errors, name)) || msgError}
        msgError={msgError ? msgError : get(formik?.errors, name)}
      />
    </WapperLabelForm>
  )
}

export default SelectField
