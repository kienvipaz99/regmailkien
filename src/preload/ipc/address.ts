import { ipcRendererInvoke } from '@main/core/custom-ipc'
import { IIpcCustomRenderer } from '@main/types'
import { AddressRouters } from '@preload/types'

export const IpcRenderAddress: IIpcCustomRenderer<AddressRouters> = {
  readAllProvince: async () => await ipcRendererInvoke('address_readAllProvince'),
  readDistrictByProvinceId: async (payload) =>
    await ipcRendererInvoke('address_readDistrictByProvinceId', payload)
}
