import { Button } from 'flowbite-react'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'

interface ListFollowerScanProps<T> {
  openModal: (key: T) => void
  value: string
  modalKey: T
  buttonText?: string
  selectedText?: string
}

const ButtonForm = <T,>({
  openModal,
  value,
  modalKey,
  buttonText,
  selectedText
}: ListFollowerScanProps<T>): JSX.Element => {
  const { t } = useTranslation()
  return (
    <div className="flex items-center">
      <Button color="blue" onClick={() => openModal(modalKey)}>
        {(buttonText && t(buttonText)) || t('input_list')}
      </Button>
      <p className="ml-2 font-normal">
        {(selectedText && t(selectedText)) || t('selected_keyword_count')}
        {': '}
        <span className="text-green-500">{_.compact(value?.split('\n'))?.length}</span>
      </p>
    </div>
  )
}

export default ButtonForm
