import { EventArgs, EventKey, EventReturn } from '@preload/types'
import { ipcMain, IpcMainInvokeEvent, ipcRenderer } from 'electron'

export const ipcMainHandle = <K extends EventKey>(
  channel: K,
  listener: (
    event: IpcMainInvokeEvent,
    ...args: EventArgs<K>
  ) => Promise<EventReturn<K>> | EventReturn<K>
): void => {
  return ipcMain.handle(channel, async (event, ...args) => {
    try {
      return await listener(event, ...(args as EventArgs<K>))
    } catch (error) {
      console.error('Channel ipc main handle', channel)
      console.error('Error ipc main handle', error)
      return {
        message: { key: 'SOMETHING_WENT_WRONG', text: 'Đã có lỗi xảy ra' },
        status: 'error',
        payload: null
      }
    }
  })
}

export const ipcRendererInvoke = async <K extends EventKey>(
  channel: K,
  ...args: EventArgs<K>
): Promise<EventReturn<K>> => {
  try {
    return ipcRenderer.invoke(channel, ...args)
  } catch (error) {
    console.error('Channel ipc renderer invoke', channel)
    console.error(`Error ipc renderer invoke`, error)
    return {
      message: { key: 'SOMETHING_WENT_WRONG' },
      status: 'error',
      payload: null
    }
  }
}
