import {
  ButtonFlowbite,
  CheckBoxField,
  InputFilter,
  useShowHideColumnReturn
} from '@renderer/components'
import { convertViToEn, toggleValues } from '@renderer/helper'
import type { TColumnsTable } from '@renderer/types'
import { Modal } from 'flowbite-react'
import { useFormik } from 'formik'
import { Dispatch, SetStateAction, useId, useLayoutEffect, useMemo } from 'react'
import { Column, ColumnOrColumnGroup } from 'react-data-grid'
import { useTranslation } from 'react-i18next'
import SortableContextColumn from './SortableContextColumn'

export interface ModalHiddenRowProps<T>
  extends Partial<
    Pick<
      useShowHideColumnReturn<T, unknown>,
      'handleFindLocation' | 'hiddenColumns' | 'handleChangeLocation' | 'locationColumns'
    >
  > {
  isShow?: boolean
  setIsShow?: Dispatch<SetStateAction<boolean>>
  columns?: TColumnsTable<T>
  onSubmit?: (name: string[]) => void
  locationColumns?: string[]
}

interface IFormHiddenColum {
  arrColumn: string[]
  locationColumn: string[]
  search?: string
}

const ModalHiddenRow = <T,>({
  isShow,
  setIsShow,
  columns,
  hiddenColumns,
  onSubmit,
  handleFindLocation,
  handleChangeLocation,
  locationColumns
}: ModalHiddenRowProps<T>): JSX.Element => {
  const { t } = useTranslation()
  const idForm = useId()
  const formik = useFormik<IFormHiddenColum>({
    initialValues: {
      arrColumn: [],
      locationColumn: []
    },
    onSubmit: (values) => {
      onSubmit && onSubmit(values?.arrColumn ?? [])
      handleChangeLocation && handleChangeLocation(values?.locationColumn ?? [])
      handleClose && handleClose()
    }
  })

  useLayoutEffect(() => {
    if (hiddenColumns && locationColumns) {
      formik.setValues({
        arrColumn: hiddenColumns,
        locationColumn: locationColumns
      })
    }
  }, [hiddenColumns, locationColumns])

  const handleClose = (): void => {
    formik.resetForm()
    setIsShow && setIsShow(false)
  }

  const arrKeys = useMemo(
    () =>
      columns?.map((item) => {
        const newItem = item as Column<T>
        return newItem?.key
      }),
    [columns]
  )

  const columnSearch = useMemo(() => {
    return columns?.filter((column) => {
      const value = t(`${column?.name}`)
      const valueVi = convertViToEn(value)
      const newSearch = convertViToEn(formik?.values?.search ?? '')?.replace(/^\s+|\s+$/gm, '')
      const serching = valueVi.includes(newSearch)
      return serching
    })
  }, [t, columns, formik?.values?.search])

  const arrFieldActive = useMemo(() => {
    let arrActive = columns?.filter((item) => {
      const newItem = item as Column<T>
      return !formik?.values?.arrColumn?.includes(newItem?.key)
    })
    const locationColumn = formik?.values?.locationColumn
    if (handleFindLocation) {
      arrActive = handleFindLocation(
        arrActive as TColumnsTable<T, unknown>,
        locationColumn
      ) as ColumnOrColumnGroup<NoInfer<T>, unknown>[]
    }
    return arrActive
  }, [formik?.values?.arrColumn, handleFindLocation, formik?.values?.locationColumn])

  return (
    <Modal show={isShow} onClose={handleClose} size={'4xl'}>
      <Modal.Header>{t('hidden_row')}</Modal.Header>
      <Modal.Body className="overflow-hidden">
        <form id={idForm} onSubmit={formik.handleSubmit}>
          <div className="flex gap-5 w-full">
            <div className="w-[50%]">
              <h3 className="text-sm">{t('choose_item')}</h3>
              <InputFilter
                classNameFilter="my-3 !w-full [&>button]:!h-9"
                className="h-9"
                onChangeValue={(value) => {
                  formik?.setFieldValue('search', value)
                  formik.setSubmitting(false)
                }}
                isButton
              />
              <div className="h-[54dvh] overflow-y-auto overflow-x-hidden custom_scroll">
                <div className="space-y-3 pr-1">
                  {columnSearch?.map((field, index) => {
                    const currentField = field as Column<T>

                    return (
                      <CheckBoxField
                        key={index}
                        label={t(`${currentField?.name}`) ?? ''}
                        name={(field as Column<T>).key}
                        checked={!formik?.values?.arrColumn?.includes(currentField?.key)}
                        onChange={(): void => {
                          formik.setValues({
                            ...formik?.values,
                            arrColumn: toggleValues({
                              array: formik?.values?.arrColumn ?? [],
                              value: currentField?.key
                            })
                          })
                        }}
                      />
                    )
                  })}
                </div>
              </div>
            </div>
            <div className="w-[50%]">
              <div className="flex justify-between gap-2 items-center">
                <h3 className="text-sm">
                  {t('selected')} ({arrFieldActive?.length})
                </h3>
                {(arrFieldActive ?? [])?.length > 1 && (
                  <span
                    className="text-sm text-red-500 cursor-pointer"
                    onClick={() => {
                      formik?.setFieldValue('arrColumn', arrKeys)
                    }}
                  >
                    {t('clear_all')}
                  </span>
                )}
              </div>
              <div className="h-[61dvh] mt-3 overflow-y-auto overflow-x-hidden custom_scroll">
                <div className="space-y-3 pr-1">
                  <SortableContextColumn
                    arrColumns={arrFieldActive as TColumnsTable<T>}
                    onDragEnd={(newColums) => {
                      formik?.setFieldValue('locationColumn', newColums)
                    }}
                    onClose={(key) => {
                      const newArr = [...(formik?.values?.arrColumn ?? []), key]
                      formik?.setFieldValue('arrColumn', newArr)
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-3 px-5 py-3">
        <ButtonFlowbite onClick={handleClose} color="failure" type="submit">
          {t('cancel')}
        </ButtonFlowbite>
        <ButtonFlowbite form={idForm} type="submit" color="blue">
          {t('update')}
        </ButtonFlowbite>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalHiddenRow
