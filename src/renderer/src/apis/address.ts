import { AddressRouters, IIpcCustomRenderer } from '@preload/types'

export const AddressApi: IIpcCustomRenderer<AddressRouters> = {
  readAllProvince: async () => await window.api.address.readAllProvince(),
  readDistrictByProvinceId: async (payload) =>
    await window.api.address.readDistrictByProvinceId(payload)
}
