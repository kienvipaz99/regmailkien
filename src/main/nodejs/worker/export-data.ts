import { sendMessageToMain } from '@main/core/nodejs'
import { ITypeExport } from '@main/types'
import { MessagePort } from 'node:worker_threads'
import { handleExportDialogTypeStream } from '../file'

export class ExportExcelManager {
  private jobId: string
  private parentPort: MessagePort
  private typeExport: ITypeExport
  private filePath: string

  constructor(typeExport: ITypeExport, filePath: string, jobId: string, parentPort: MessagePort) {
    this.typeExport = typeExport
    this.jobId = jobId
    this.parentPort = parentPort
    this.filePath = filePath
  }

  public async exportData(): Promise<void> {
    try {
      console.time('ExportDataTime')
      console.log('bắt đầu')
      await handleExportDialogTypeStream(this.typeExport, this.filePath, this.jobId)

      console.log('kết thúc')
      console.timeEnd('ExportDataTime')
      sendMessageToMain(this.parentPort, { key: 'export_excel_success' })
    } catch (error) {
      console.error('Export Data Error: ', error)
    }
  }
}
