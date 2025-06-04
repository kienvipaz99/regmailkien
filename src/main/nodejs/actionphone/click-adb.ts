import { CommanAdb } from './commandadb'

export const clickBack = async (deviceId: string): Promise<void> => {
  await CommanAdb(deviceId, 'shell input keyevent 4')
}
export const enableInterNet = async (deviceId: string): Promise<void> => {
  await CommanAdb(deviceId, 'shell svc data enable')
}
export const disableInterNet = async (deviceId: string): Promise<void> => {
  await CommanAdb(deviceId, 'shell svc data disable')
}
