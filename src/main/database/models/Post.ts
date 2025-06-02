import { actionSyncData, createResponse, logger } from '@main/core/nodejs'
import type { Category, IFieldUpdateAndCheck, IMainResponse, IObjectParams } from '@preload/types'
import { ActionSyncData, EntitySyncData } from '@vitechgroup/mkt-key-client'
import { forEach, isEmpty, some } from 'lodash'
import { postQB } from '../AppDataSource'
import { Post } from '../entities'

export const PostModel = {
  create: async (payload: Post[]): Promise<IMainResponse<boolean>> => {
    try {
      await postQB()
        .insert()
        .into(Post)
        .values(payload)
        .orIgnore()
        .execute()
        .then(() => true)
        .catch(() => false)

      actionSyncData(EntitySyncData.post, ActionSyncData.create, payload)

      return createResponse('upsert_post_success', 'success')
    } catch (error) {
      logger.error(`Error upsert post ${error}`)
      return createResponse('upsert_post_failed', 'error')
    }
  },

  readAllByParams: async (payload: IObjectParams): Promise<IMainResponse<Post[]>> => {
    try {
      const { categoryId, page = 1, pageSize = 10 } = payload
      const skip = (page - 1) * pageSize

      const queryBuilder = postQB().leftJoinAndSelect('post.category', 'category')
      if (categoryId && categoryId.length > 0 && !some(categoryId, isEmpty)) {
        queryBuilder.andWhere('post.category IN (:...categoryIds)', { categoryIds: categoryId })
      }

      const totalPromise = queryBuilder.getCount()
      const postsPromise = queryBuilder.clone().offset(skip).limit(pageSize).getMany()

      const [total, data] = await Promise.all([totalPromise, postsPromise])
      return createResponse('read_all_post_by_params_success', 'success', {
        data,
        total,
        page,
        lives: 0,
        dies: 0
      })
    } catch (err) {
      logger.error(`[Read posts] ${err}`)
      return createResponse('read_all_post_by_params_failed', 'error')
    }
  },

  removeByField: async (
    options: IFieldUpdateAndCheck<Post, undefined, string[]>
  ): Promise<IMainResponse<boolean>> => {
    try {
      await postQB()
        .where(`${options.key} IN (:...select)`, { select: options.select })
        .delete()
        .execute()

      actionSyncData(EntitySyncData.post, ActionSyncData.remove_by_field, options)

      return createResponse('remove_by_field_success', 'success')
    } catch (error) {
      logger.error(`Error removing by fields: ${error}`)
      return createResponse('remove_by_field_failed', 'error')
    }
  },

  updatePostByField: async (
    options: IFieldUpdateAndCheck<Post, Partial<Post>, string[]>
  ): Promise<IMainResponse<boolean>> => {
    try {
      await postQB()
        .update()
        .set(options.value)
        .where(`${options.key} IN (:...select)`, { select: options.select })
        .execute()

      actionSyncData(EntitySyncData.post, ActionSyncData.update_by_field, options)

      return createResponse('update_post_by_uid_success', 'success')
    } catch (error) {
      logger.error(`Error update account by: ${error}`)
      return createResponse('update_post_by_uid_failed', 'error')
    }
  },

  readAllByField: async (
    options: IFieldUpdateAndCheck<Post, undefined, string[]>[]
  ): Promise<IMainResponse<Post[]>> => {
    try {
      const query = postQB().leftJoinAndSelect('post.category', 'category')
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
      logger.error(`Error read account by: ${error}`)
    }
    return createResponse('read_all_post_by_field_failed', 'error')
  },

  getOneByCategory: async (category: Category): Promise<Post | null> =>
    await postQB().where('categoryId = :categoryId', { categoryId: category.id }).getOne()
}
