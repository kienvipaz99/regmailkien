import { Row } from '@fast-csv/format'
import { logger } from '@main/core/nodejs'
import { createXlsxFile, CsvFile, makeCsvFile } from '@main/nodejs/file'
import XlsxFile from '@main/nodejs/file/XlsxFile'
import type { ITypeExport } from '@preload/types'
import { app, dialog } from 'electron'
import { format } from 'node:path'

export const exportCsvDialog = async <T extends Row>(
  data: T[],
  type: ITypeExport
): Promise<boolean> => {
  const date = new Date()
    .toLocaleString()
    .replace(/\s|\/|:/g, '_')
    .replace(',', '')

  return dialog
    .showSaveDialog({
      title: 'Lưu file',
      defaultPath: format({
        dir: app.getPath('downloads'),
        base: `${type}_${date}`,
        ext: 'txt'
      }),
      filters: [
        { name: 'Excel', extensions: ['xlsx'] },
        { name: 'Csv', extensions: ['csv'] },
        { name: 'Text', extensions: ['txt'] }
      ]
    })
    .then(async (result) => {
      if (result.canceled) {
        return false
      } else {
        const filePath = result.filePath
        if (!filePath) {
          return false
        }
        await handleExportDialog(data, type, filePath)
        return true
      }
    })
    .catch((error) => {
      logger.error('Error export csv dialog account', error)
      return false
    })
}

const handleExportDialog = async <T extends Row>(
  data: T[],
  type: ITypeExport,
  filePath: string
): Promise<void> => {
  if (filePath.split('.').pop() === 'xlsx') {
    let xlsxFile: XlsxFile
    switch (type) {
      case 'g_map_export':
        xlsxFile = await createXlsxFile('g_map_export', filePath)
        break

      default:
        xlsxFile = await createXlsxFile('accounts_export', filePath)
        break
    }
    await xlsxFile.readFile().then(() => xlsxFile.append(data))
  } else {
    const csvFile = await createCsvFile('accounts_export', filePath)
    await csvFile.append(data)
  }
}

export const createCsvFile = async (payload: ITypeExport, filePath: string): Promise<CsvFile> => {
  const { csvFile, headerRow } = await makeCsvFile(payload, filePath)
  await csvFile.append(headerRow)
  return csvFile
}

export const exportCsvDialogWithStream = async (type: ITypeExport): Promise<string> => {
  const date = new Date()
    .toLocaleString()
    .replace(/\s|\/|:/g, '_')
    .replace(',', '')

  return dialog
    .showSaveDialog({
      title: 'Lưu file',
      defaultPath: format({
        dir: app.getPath('downloads'),
        base: `${type}_${date}`,
        ext: 'txt'
      }),
      filters: [
        { name: 'Excel', extensions: ['xlsx'] },
        { name: 'Csv', extensions: ['csv'] },
        { name: 'Text', extensions: ['txt'] }
      ]
    })
    .then(async (result) => {
      if (result.canceled) {
        return ''
      } else {
        const filePath = result.filePath
        if (!filePath) {
          return ''
        }
        return filePath
      }
    })
    .catch((error) => {
      logger.error('Error export csv dialog account', error)
      return ''
    })
}
