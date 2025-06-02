import { Account } from '@preload/types'
import { useButtonStateProvider } from '@renderer/context'
import { useStartAction } from '@renderer/services'
import { IObjectParams, IOptionSelectFormat } from '@renderer/types'
import { Tooltip } from 'flowbite-react'
import { CirclePlay, CircleX } from 'lucide-react'
import { Dispatch, memo, SetStateAction, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MdOutlineFilterList, MdOutlineFilterListOff } from 'react-icons/md'
import ButtonFlowbite from './Default/ButtonFlowbite'
import ModalFilter from './Modal/Account/ModalFilter'
import SelectScrollCategory from './SelectScrollCategory'
import StatusDisplay from './StatusDisplay'

type ButtonActionControlsProps = {
  setSelectedRecords?: Dispatch<SetStateAction<ReadonlySet<string>>>
  isShowButton?: boolean
  isShowStatus?: boolean
  isShowCategorySelect?: boolean
  isShowFilter?: boolean
  setConfigSearch: Dispatch<SetStateAction<IObjectParams>>
  configSearch: IObjectParams
  accountsList?: Account[]
  categoryIds?: string[] | null
  isPendingStart?: boolean
  idForm?: string
}

const ButtonActionControls = ({
  isShowButton = true,
  isShowStatus = true,
  isShowCategorySelect = true,
  isShowFilter = true,
  accountsList = [],
  categoryIds,
  setConfigSearch,
  configSearch,
  isPendingStart,
  setSelectedRecords,
  idForm
}: ButtonActionControlsProps): JSX.Element => {
  const { t } = useTranslation()
  const [isShowModalFilter, setIsShowModalFilter] = useState(false)
  const { mutate: startAction } = useStartAction()

  const { isPendingCheck, isPendingStop, isWork } = useButtonStateProvider()
  const isProcessing = isPendingStop || isPendingStart

  const openModalFilter = (): void => setIsShowModalFilter(true)
  const resetFilters = (): void => setConfigSearch({ page: 1, pageSize: 1000, filterType: 'all' })

  const isFiltered = useMemo(() => {
    return (
      configSearch.search ||
      configSearch.categoryId ||
      configSearch.filterType !== 'all' ||
      configSearch.checkpointState ||
      configSearch.uids ||
      configSearch.names
    )
  }, [configSearch])

  return (
    <div className="flex gap-2 items-center justify-center">
      {isShowCategorySelect && (
        <SelectScrollCategory
          classWapper="w-[250px]"
          placeholder={t('select_category')}
          value={categoryIds}
          changeSelected={(newValue) => {
            setSelectedRecords && setSelectedRecords(new Set())
            const data = newValue as IOptionSelectFormat<string>
            setConfigSearch && setConfigSearch((prev) => ({ ...prev, categoryId: [data.value] }))
          }}
        />
      )}

      {isShowFilter && (
        <div
          className="p-2 bg-blue-500 rounded-md h-[30px]"
          role="button"
          onClick={isFiltered ? resetFilters : openModalFilter}
        >
          <Tooltip content={t(isFiltered ? 'reset_filter' : 'filter')} placement="bottom">
            {isFiltered ? (
              <MdOutlineFilterListOff size={16} className="text-white" />
            ) : (
              <MdOutlineFilterList size={16} className="text-white" />
            )}
          </Tooltip>
        </div>
      )}

      {isShowButton && (
        <ButtonFlowbite
          form={idForm}
          type={isWork ? 'button' : 'submit'}
          StartIcon={isWork ? CircleX : CirclePlay}
          color={isWork ? 'failure' : 'success'}
          className={isWork ? 'my-auto' : 'btn-start h-fit flex'}
          size="sm"
          onClick={() => isWork && startAction({ actionName: 'stop_job', data: [] })}
          disabled={isProcessing || isPendingCheck}
          isProcessing={isProcessing}
        >
          {t(isWork ? 'stop' : 'start')}
        </ButtonFlowbite>
      )}

      {isShowStatus && <StatusDisplay accountsList={accountsList} />}

      {isShowModalFilter && (
        <ModalFilter
          isShow={isShowModalFilter}
          setIsShow={setIsShowModalFilter}
          configSearch={configSearch}
          setConfigSearch={setConfigSearch}
        />
      )}
    </div>
  )
}

export default memo(ButtonActionControls)
