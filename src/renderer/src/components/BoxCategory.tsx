import { Menu } from '@mantine/core'
import {
  ButtonFlowbite,
  CheckBoxField,
  InputFilter,
  ModalCategory,
  Tooltips
} from '@renderer/components'
import { pickBySearch } from '@renderer/helper'
import { useDeleteCategoryBy, useReadCategoryByParamsFrom } from '@renderer/services'
import type { ICategoryType, IObjectParams } from '@renderer/types'
import { CircleFadingPlus } from 'lucide-react'
import { Dispatch, memo, SetStateAction, useId, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BsThreeDotsVertical } from 'react-icons/bs'

interface BoxCategoryProps {
  categoryType?: ICategoryType
  categoryIds?: string[]
  setCategoryIds?: Dispatch<SetStateAction<string[]>>
  setSelectedRecords?: Dispatch<SetStateAction<ReadonlySet<string>>>
  onChange?: (newActive: string[]) => void
}

const BoxCategory = ({
  categoryType = 'account',
  categoryIds,
  setCategoryIds,
  onChange,
  setSelectedRecords
}: BoxCategoryProps): JSX.Element => {
  const idForm = useId()
  const [isShowModal, setIsShowModal] = useState(false)
  const [idCategory, setIdCategory] = useState<string>('')
  const [nameCategory, setNameCategory] = useState<string>('')
  const { mutate: removeCategory } = useDeleteCategoryBy(categoryType)
  const [configSearch, setConfigSearch] = useState<IObjectParams>({
    category_type: categoryType
  })
  const { data: dataCategory } = useReadCategoryByParamsFrom(
    categoryType,
    pickBySearch(configSearch)
  )
  const { t } = useTranslation()

  const listIds = useMemo(() => {
    if (dataCategory) {
      return dataCategory?.data?.map((item) => item?.id) ?? ['']
    }
    return []
  }, [dataCategory])

  const handleCheckBoxAll = (): void => {
    setSelectedRecords && setSelectedRecords(new Set())
    if (!dataCategory) return
    const isAll = categoryIds?.length === dataCategory?.data?.length
    const newCategoryIds = !isAll ? listIds : []
    setCategoryIds && setCategoryIds(newCategoryIds)
    onChange && onChange(newCategoryIds)
  }

  const handleFormCategory = (value: string, id: string): void => {
    setIsShowModal(true)
    setNameCategory(value)
    setIdCategory(id)
  }

  const handleCheckBox = (value: string): void => {
    setSelectedRecords && setSelectedRecords(new Set())
    if (categoryIds && setCategoryIds) {
      let newActive = [...categoryIds]
      if (newActive?.includes(value)) {
        newActive = newActive.filter((item) => item !== value)
      } else {
        newActive = [...newActive, value]
      }
      setCategoryIds(newActive)
      onChange && onChange(newActive)
    }
  }
  return (
    <div>
      <div className="flex items-center justify-between gap-5 p-[10px]">
        <h3 className="text-base font-semibold">{t('manager_category')}</h3>
      </div>
      <div className="flex gap-3 items-center p-[10px]">
        <InputFilter
          className="h-[30px]"
          onChangeValue={(value) => setConfigSearch((prev) => ({ ...prev, searchCate: value }))}
        />
        <Tooltips content={t('add_category')}>
          <ButtonFlowbite
            color="blue"
            size="xs"
            className="add-category"
            StartIcon={CircleFadingPlus}
            onClick={() => handleFormCategory('', '')}
          >
            {t('add')}
          </ButtonFlowbite>
        </Tooltips>
      </div>
      <div className="mt-5 flex flex-col overflow-y-auto custom_scroll cate-list h-[56vh]">
        <CheckBoxField
          name={`checkbox-${idForm}`}
          label={t('all')}
          checked={
            categoryIds &&
            categoryIds.length > 0 &&
            listIds?.length > 0 &&
            categoryIds.length === listIds?.length
          }
          indeterminate={
            categoryIds && categoryIds.length >= 1 && categoryIds.length < listIds?.length
          }
          classCheckBox="[&>label]:break-all [&>label]:line-clamp-3"
          onChange={handleCheckBoxAll}
          disabled={listIds?.length === 0}
        />

        {dataCategory?.data?.map((item, index) => {
          const isChecked = (categoryIds ?? []).includes(item?.id)
          return (
            <div className="flex items-center justify-between gap-4" key={index}>
              <CheckBoxField
                key={index}
                name={`checkbox-${idForm}`}
                label={item?.name}
                classCheckBox="[&>label]:break-all [&>label]:line-clamp-3"
                checked={isChecked}
                onChange={(): void => handleCheckBox(item?.id)}
              />

              <Menu
                withArrow
                classNames={{
                  dropdown: 'min-w-[150px]'
                }}
              >
                <Menu.Target>
                  <div className="cursor-pointer transition-all duration-200 w-[25px] h-[25px] rounded-full hover:bg-gray-200 text-gray-900 flex items-center justify-center flex-shrink-0">
                    <BsThreeDotsVertical size={15} />
                  </div>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item onClick={() => handleFormCategory(item?.name, item?.id)}>
                    {t('edit')}
                  </Menu.Item>
                  <Menu.Item onClick={() => removeCategory({ id: item?.id, name: item?.name })}>
                    {t('delete')}
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </div>
          )
        })}
      </div>

      {isShowModal && (
        <ModalCategory
          isShow={isShowModal}
          setIsShow={setIsShowModal}
          categoryType={categoryType}
          nameOldCategory={nameCategory}
          idCategory={idCategory}
        />
      )}
    </div>
  )
}

export default memo(BoxCategory)
