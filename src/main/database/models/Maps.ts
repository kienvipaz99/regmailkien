import { createResponse, logger } from '@main/core/nodejs'
import { IResGMapByKeyword } from '@main/nodejs/google_map/types'
import type { IFieldUpdateAndCheck, IMainResponse, IObjectParams } from '@preload/types'
import { forEach, isEmpty } from 'lodash'
import { gMapQB } from '../AppDataSource'
import { Maps } from '../entities/MapsEntity'

export const GMapModel = {
  create: async (payload: IResGMapByKeyword[]): Promise<IMainResponse<boolean>> => {
    try {
      await gMapQB()
        .insert()
        .into(Maps)
        .values(payload)
        .orIgnore()
        .execute()
        .then(() => true)
        .catch(() => false)

      return createResponse('upsert_map_success', 'success')
    } catch (error) {
      logger.error(`Error upsert map ${error}`)
      return createResponse('upsert_map_failed', 'error')
    }
  },

  readAllByParams: async (payload: IObjectParams): Promise<IMainResponse<Maps[]>> => {
    try {
      const { job_id } = payload
      let { page, pageSize } = payload
      page = page ?? 1
      pageSize = pageSize ?? 50
      const skip = (page - 1) * pageSize

      const queryBuilder = gMapQB()

      if (job_id) {
        queryBuilder.andWhere('map.job_id = :job_id', { job_id })
      }

      const totalPromise = queryBuilder.getCount()
      const gMapsPromise = queryBuilder
        .clone()
        .offset(skip)
        .limit(pageSize)
        .orderBy('map.keyword')
        .getMany()

      const [total, data] = await Promise.all([totalPromise, gMapsPromise])
      return createResponse('read_all_map_by_params_success', 'success', {
        data,
        total,
        page
      })
    } catch (err) {
      logger.error(`[Read maps] ${err}`)
      return createResponse('read_all_map_by_params_failed', 'error')
    }
  },

  removeByField: async (
    options: IFieldUpdateAndCheck<Maps, undefined, string[]>
  ): Promise<IMainResponse<boolean>> => {
    try {
      await gMapQB()
        .where(`${options.key} IN (:...select)`, { select: options.select })
        .delete()
        .execute()

      return createResponse('remove_by_field_success', 'success')
    } catch (error) {
      logger.error(`Error removing by fields: ${error}`)
      return createResponse('remove_by_field_failed', 'error')
    }
  },

  updateGMapByField: async (
    options: IFieldUpdateAndCheck<Maps, Partial<Maps>, string[]>
  ): Promise<IMainResponse<boolean>> => {
    try {
      await gMapQB()
        .update()
        .set(options.value)
        .where(`${options.key} IN (:...select)`, { select: options.select })
        .execute()

      return createResponse('update_map_by_uid_success', 'success')
    } catch (error) {
      logger.error(`Error update account by: ${error}`)
      return createResponse('update_map_by_uid_failed', 'error')
    }
  },

  readAllByField: async (
    options: IFieldUpdateAndCheck<Maps, undefined, string[]>[]
  ): Promise<IMainResponse<Maps[]>> => {
    try {
      const query = gMapQB()
      forEach(options, (option) => {
        if (Array.isArray(option.select)) {
          query.andWhere(`${option.key} IN (:...select)`, { select: option.select })
        } else {
          query.andWhere(`${option.key} = :value`, { value: option.select })
        }
      })

      const data = await query.getMany()
      if (!isEmpty(data)) {
        return createResponse('read_all_post_by_field_success', 'success', {
          data
        })
      }
    } catch (error) {
      logger.error(`Error by: ${error}`)
    }
    return createResponse('read_all_map_by_field_failed', 'error')
  },
  clearData: async (): Promise<boolean> =>
    await gMapQB()
      .delete()
      .execute()
      .then(() => true)
      .catch(() => false),
  readAllByCondition: async (payload: IObjectParams): Promise<Maps[]> => {
    try {
      const { job_id, job_detail_id } = payload
      const queryBuilder = gMapQB()
      if (job_id) {
        queryBuilder.andWhere('map.job_id = :job_id', { job_id })
      }

      if (job_detail_id) {
        queryBuilder.andWhere('map.job_detail_id = :job_detail_id', { job_detail_id })
      }

      return await queryBuilder.clone().orderBy('map.keyword').getMany()
    } catch (err) {
      return []
    }
  },
  countDataByParams: async (payload: IObjectParams): Promise<number> => {
    try {
      const { job_detail_id } = payload
      const queryBuilder = gMapQB()

      if (job_detail_id) {
        queryBuilder.andWhere('map.job_detail_id = :job_detail_id', { job_detail_id })
      }

      return await queryBuilder.getCount()
    } catch (err) {
      logger.error(`[count maps] ${err}`)
      return 0
    }
  },
  readAllByParamsNotCount: async (payload: IObjectParams): Promise<IMainResponse<Maps[]>> => {
    try {
      const { job_id } = payload
      let { page, pageSize } = payload
      page = page ?? 1
      pageSize = pageSize ?? 50
      const skip = (page - 1) * pageSize
      const queryBuilder = gMapQB()

      if (job_id) {
        queryBuilder.andWhere('map.job_id = :job_id', { job_id })
      }

      const data = await queryBuilder
        .clone()
        .offset(skip)
        .limit(pageSize)
        .orderBy('map.keyword')
        .getMany()

      return createResponse('read_all_map_by_params_success', 'success', {
        data,
        total: 0,
        page
      })
    } catch (err) {
      logger.error(`[Read maps] ${err}`)
      return createResponse('read_all_map_by_params_failed', 'error')
    }
  }
}
