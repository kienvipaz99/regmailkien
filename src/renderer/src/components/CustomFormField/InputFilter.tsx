import { cn } from '@renderer/helper'
import { FC, InputHTMLAttributes, KeyboardEvent, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IoClose, IoSearch } from 'react-icons/io5'
import ButtonFlowbite from '../Default/ButtonFlowbite'
import InputField from './InputField'

interface InputFilterProps extends InputHTMLAttributes<HTMLElement> {
  onChangeValue?: (value: string) => void
  isButton?: boolean
  isGroup?: boolean
  classNameFilter?: string
}

const InputFilter: FC<InputFilterProps> = ({
  onChangeValue,
  isButton,
  isGroup,
  classNameFilter,
  ...spread
}) => {
  const [value, setValue] = useState('')
  const { t } = useTranslation()

  const submitedForm = useCallback(
    (e: KeyboardEvent<HTMLInputElement>): void => {
      if (e.key === 'Enter') {
        onChangeValue && onChangeValue((value ?? '').trim())
      } else if (e.key === 'Escape') {
        setValue('')
        onChangeValue && onChangeValue('')
      }
    },
    [value]
  )
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(e.target.value)
  }

  return (
    <div className={cn('flex items-center lg:w-[17.7rem]', !isGroup && 'gap-1', classNameFilter)}>
      <div className="flex-1 relative">
        <InputField
          value={value}
          name="filter"
          onChange={handleChange}
          placeholder={t('search')}
          onKeyDown={submitedForm}
          className={cn(isGroup && isButton && 'rounded-tr-none rounded-br-none', value && 'pl-5')}
          {...spread}
        />
        {value && (
          <IoClose
            className="absolute top-1/2 -translate-y-1/2 right-1 cursor-pointer text-[#cccccc] select-none"
            onClick={(): void => {
              setValue('')
              onChangeValue && onChangeValue('')
            }}
            size={20}
          />
        )}
      </div>

      {isButton && (
        <ButtonFlowbite
          color="blue"
          className={cn(
            'p-1 [&>*]:p-0 h-full w-[38px] items-center flex justify-center',
            isGroup && 'rounded-tl-none rounded-bl-none'
          )}
          onClick={(): void => onChangeValue && onChangeValue((value ?? '').trim())}
        >
          <IoSearch size={20} />
        </ButtonFlowbite>
      )}
    </div>
  )
}

export default InputFilter
