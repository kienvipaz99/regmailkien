import { Row } from '@fast-csv/format'
import { GMapModel } from '@main/database/models'
import { ITypeExport } from '@main/types'
import ExcelJS, { Column, Workbook } from 'exceljs'
import {
  optionColumnExportAccount,
  optionColumnExportGMap,
  optionColumnExportPost
} from '../helper'

export default class XlsxFile {
  private static wb: Workbook
  private path: string
  private columns: Array<Partial<Column>>

  constructor(path: string) {
    this.columns = []
    this.path = path
    XlsxFile.wb = new ExcelJS.Workbook()
  }

  async readFile(): Promise<void> {
    await XlsxFile.wb.xlsx.readFile(this.path)
  }

  setColumns(cols: Array<Partial<Column>>): void {
    this.columns = cols
  }

  append(rows: Row[]): void {
    const ws = XlsxFile.wb.getWorksheet(1)
    if (!ws) return
    ws.columns = this.columns
    const lastRow = ws.lastRow
    if (!lastRow) return
    ws.insertRows(lastRow.number + 1, rows)

    XlsxFile.wb.xlsx.writeFile(this.path)
  }
}

export const createXlsxFile = async (
  payload: string,
  exportFilePath: string
): Promise<XlsxFile> => {
  const wb = new ExcelJS.Workbook()
  const ws = wb.addWorksheet(payload)
  let columns: Array<Partial<Column>> = []

  switch (payload) {
    case 'accounts_export':
      columns = optionColumnExportAccount
      break
    case 'post_export':
      columns = optionColumnExportPost
      break
    case 'g_map_export':
      columns = optionColumnExportGMap
      break
  }
  ws.columns = columns
  await wb.xlsx.writeFile(exportFilePath)
  const xlsxFile = new XlsxFile(exportFilePath)
  xlsxFile.setColumns(columns)
  return xlsxFile
}

export const createXlsxFileTypeStream = async (
  payload: string,
  exportFilePath: string
): Promise<{ workbook: ExcelJS.stream.xlsx.WorkbookWriter; worksheet: ExcelJS.Worksheet }> => {
  const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
    filename: exportFilePath,
    useStyles: true,
    useSharedStrings: true
  })
  const worksheet = workbook.addWorksheet(payload)
  let columns: Array<Partial<Column>> = []
  switch (payload) {
    case 'accounts_export':
      columns = optionColumnExportAccount
      break
    case 'post_export':
      columns = optionColumnExportPost
      break
    case 'g_map_export':
      columns = optionColumnExportGMap
      break
  }
  worksheet.columns = columns
  return { workbook, worksheet }
}

export const handleExportDialogTypeStream = async (
  type: ITypeExport,
  filePath: string,
  jobId?: string
): Promise<void> => {
  if (filePath.split('.').pop() === 'xlsx') {
    const { workbook, worksheet } = await createXlsxFileTypeStream(type, filePath)

    switch (type) {
      case 'g_map_export':
        await handleDataExport(type, worksheet, jobId)
        break

      default:
        break
    }

    await workbook.commit()
  }
}

const handleDataExport = async (
  type: ITypeExport,
  worksheet: ExcelJS.Worksheet,
  jobId?: string
): Promise<void> => {
  let isProcess = true
  let page = 1
  const largePageSize = 50000
  const smallPageSize = 10000
  let dataModel

  while (isProcess) {
    switch (type) {
      case 'g_map_export':
        dataModel = await GMapModel.readAllByParamsNotCount({
          job_id: jobId ?? '',
          page,
          pageSize: largePageSize
        })
        break
      default:
        break
    }

    if (!dataModel.payload.data?.length) {
      isProcess = false
      break
    }
    page++

    const rows = dataModel.payload.data
    for (let i = 0; i < rows.length; i += smallPageSize) {
      const chunk = rows.slice(i, i + smallPageSize)
      for (const element of chunk) {
        worksheet.addRow(element).commit()
      }
    }
  }
}
