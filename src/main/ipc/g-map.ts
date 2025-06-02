import { ipcMainHandle } from '@main/core/custom-ipc'
import { GMapModel } from '@main/database/models'
import { exportCsvDialog } from '@main/helper'
import { IMainResponse } from '@main/types'

export const IpcMainGMap = (): void => {
  ipcMainHandle('gMap_readAllByParams', async (_, payload) => {
    return await GMapModel.readAllByParams(payload)
  })
  ipcMainHandle('gMap_exportFile', async (_, payload): Promise<IMainResponse<boolean>> => {
    try {
      const gMaps = await GMapModel.readAllByCondition(payload)
      await exportCsvDialog(gMaps, 'g_map_export')
      return { status: 'success', message: { key: '' }, payload: {} }
    } catch (error) {
      return { status: 'error', message: { key: '' }, payload: {} }
    }
  })
}
