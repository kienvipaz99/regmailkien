import { ipcMainHandle } from '@main/core/custom-ipc'
import { createResponse } from '@main/core/nodejs'
import { IMainResponse } from '@main/types'
import { IObjectParams } from '@preload/types'
import { District, MktMapDb, Province } from '@vitechgroup/mkt-maps'

export const IpcAddress = (): void => {
  ipcMainHandle('address_readAllProvince', async (): Promise<IMainResponse<Province[]>> => {
    const provinces = await MktMapDb.get().provinceModel?.getAll()

    return createResponse('read_all_map_by_params_success', 'success', {
      data: provinces?.length ? provinces : [],
      total: 0,
      page: 0
    })
  })
  ipcMainHandle(
    'address_readDistrictByProvinceId',
    async (_, payload: IObjectParams): Promise<IMainResponse<District[]>> => {
      const districts = await MktMapDb.get().districtModel?.getListAndCountByParams(payload)

      return createResponse('read_all_map_by_params_success', 'success', {
        data: districts?.data,
        total: districts?.total,
        page: payload.page
      })
    }
  )
}
