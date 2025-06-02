import BoxCategory from '@renderer/components/BoxCategory'
import ButtonActionExportContentManagement from '@renderer/components/ButtonAction/Content/ButtonActionExportContentManagement'
import FieldsetWapper from '@renderer/components/CustomFormField/FieldsetWapper'
import ButtonFlowbite from '@renderer/components/Default/ButtonFlowbite'
import LayoutWapper from '@renderer/components/LayoutWapper'
import ModalContentManagement from '@renderer/components/Modal/Content/ModalContentManagement'
import ModalScanPost from '@renderer/components/Table/Content/ModalScanPost'
import TableContentManagement from '@renderer/components/Table/Content/TableContentManagement'
import { configTableContentManagement } from '@renderer/config'
import { useReadPostByParams, useRemovePostByField } from '@renderer/services'
import { IObjectParams } from '@renderer/types'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const ContentManagement = (): JSX.Element => {
  const { t } = useTranslation()

  const [isOpen, setIsOpen] = useState(false)
  const [isOpenScan, setIsOpenScan] = useState(false)
  const [categoryIds, setCategoryIds] = useState<string[]>([])
  const [configSearch, setConfigSearch] = useState<IObjectParams>({ page: 1, pageSize: 1000 })
  const [selectedRecords, setSelectedRecords] = useState((): ReadonlySet<string> => new Set())

  const { data: dataPost, isFetching } = useReadPostByParams(configSearch)
  const { mutate: removePostByField } = useRemovePostByField()
  return (
    <LayoutWapper layout="3|7">
      <FieldsetWapper>
        <BoxCategory
          setSelectedRecords={setSelectedRecords}
          categoryIds={categoryIds}
          setCategoryIds={setCategoryIds}
          onChange={(arrCatgoryIds) => {
            setConfigSearch((prev) => ({ ...prev, categoryId: arrCatgoryIds }))
          }}
          categoryType="post"
        />
      </FieldsetWapper>

      <FieldsetWapper title={t('list_post')} classWapper="!w-[calc(100%_-_395px)]">
        <div className="flex justify-end gap-5 mb-5">
          <ButtonFlowbite color="blue" onClick={() => setIsOpen(true)}>
            {t('add_post')}
          </ButtonFlowbite>
          <ButtonFlowbite color="blue" onClick={() => setIsOpenScan(true)}>
            {t('scan_post')}
          </ButtonFlowbite>
          <ButtonActionExportContentManagement selectedRecords={selectedRecords} />
        </div>

        <TableContentManagement
          t={t}
          data={dataPost?.data}
          total={dataPost?.total}
          page={configSearch?.page}
          pageSize={configSearch?.pageSize}
          columns={configTableContentManagement({ t, dataHistory: [] })}
          fetching={isFetching}
          selectedRows={selectedRecords}
          onSelectedRowsChange={setSelectedRecords}
          setConfigPagination={setConfigSearch}
          removePostByField={removePostByField}
        />
      </FieldsetWapper>

      {isOpen && <ModalContentManagement isShow={isOpen} setIsShow={setIsOpen} />}
      {isOpenScan && <ModalScanPost isShow={isOpenScan} setIsShow={setIsOpenScan} />}
    </LayoutWapper>
  )
}

export default ContentManagement
