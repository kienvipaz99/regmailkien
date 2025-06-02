import { actionSyncData, createResponse, logger } from '@main/core/nodejs'
import { IFieldUpdateAndCheck, IMainResponse } from '@main/core/types'
import type { IObjectParams, IPayloadRemoveCategory, IPayloadUpdateCategory } from '@preload/types'
import { ActionSyncData, EntitySyncData } from '@vitechgroup/mkt-key-client'
import { forEach, isEmpty } from 'lodash'
import { categoryQB } from '../AppDataSource'
import { Category } from '../entities'
import { AccountModel } from './Account'
import { PostModel } from './Post'

export const CategoryModel = {
  upsert: async (payload: Category[]): Promise<IMainResponse<boolean>> => {
    try {
      await categoryQB()
        .insert()
        .into(Category)
        .values(payload)
        .orUpdate(['is_trash'], ['name', 'category_type'])
        .execute()

      actionSyncData(EntitySyncData.category, ActionSyncData.create, payload)

      return createResponse('upsert_category_success', 'success')
    } catch (error) {
      logger.error(`Error upsert category: ${error}`)
      return createResponse('upsert_category_failed', 'error')
    }
  },

  readAllByParams: async (payload: IObjectParams): Promise<IMainResponse<Category[]>> => {
    try {
      const { is_show = true, searchCate, category_type } = payload
      const queryBuilder = categoryQB()

      queryBuilder.where('category.is_trash = :is_show', { is_show: is_show })
      if (!isEmpty(searchCate)) {
        queryBuilder.andWhere('category.name LIKE :searchCate', {
          searchCate: `%${searchCate}%`
        })
      }
      if (!isEmpty(category_type)) {
        queryBuilder.andWhere('category_type = :category_type', {
          category_type: category_type
        })
      }

      const total = await queryBuilder.getCount()
      const data = await queryBuilder.getMany()

      return createResponse('read_all_category_success', 'success', { data, total })
    } catch (error) {
      logger.error(`Error read all category: ${error}`)
      return createResponse('read_all_category_failed', 'error')
    }
  },

  readAllByField: async (
    options: IFieldUpdateAndCheck<Category, undefined, string>[]
  ): Promise<IMainResponse<Category[]>> => {
    const query = categoryQB()
    forEach(options, (option) =>
      query.andWhere(`${option.key} = :${option.key}`, { [option.key]: option.select })
    )

    try {
      const data = await query.getMany()

      return createResponse('read_many_category_by_success', 'success', { data })
    } catch (error) {
      logger.error(`Error read category by: ${error}`)
      return createResponse('read_many_category_by_failed', 'error')
    }
  },

  update: async (payload: IPayloadUpdateCategory): Promise<IMainResponse<boolean>> => {
    try {
      await categoryQB()
        .update()
        .set({ name: payload.resetName })
        .where('category.name = :name', { name: payload.name })
        .andWhere('category.id = :id', { id: payload.id })
        .execute()

      actionSyncData(EntitySyncData.category, ActionSyncData.update, payload)

      return createResponse('update_category_success', 'success')
    } catch (error) {
      logger.error(`Error update category: ${error}`)
      return createResponse('update_category_failed', 'error')
    }
  },

  remove: async (payload: IPayloadRemoveCategory): Promise<IMainResponse<boolean>> => {
    try {
      const category = await categoryQB()
        .where('category.id = :id', { id: payload.id })
        .andWhere('category.name = :name', { name: payload.name })
        .getOne()

      if (!category) {
        return createResponse('category_not_found', 'error')
      }

      const account = await AccountModel.getOneByCategory(category)
      const post = await PostModel.getOneByCategory(category)

      if (account || post) {
        return createResponse('category_has_data', 'error')
      }

      await categoryQB()
        .where('category.id IN(:...ids)', { ids: [category.id] })
        .delete()
        .execute()

      actionSyncData(EntitySyncData.category, ActionSyncData.delete, payload)

      return createResponse('delete_category_success', 'success')
    } catch (error) {
      logger.error(`Error remove category: ${error}`)
      return createResponse('delete_category_failed', 'error')
    }
  }
}
