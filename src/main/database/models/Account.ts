import { actionSyncData, createResponse, logger } from '@main/core/nodejs'
import { IFieldUpdateAndCheck, IMainResponse } from '@main/core/types'
import { accountQB } from '@main/database/AppDataSource'
import type { Category, IObjectParams } from '@preload/types'
import { ActionSyncData, EntitySyncData } from '@vitechgroup/mkt-key-client'
import { chunk, forEach, isEmpty, map, random } from 'lodash'
import { Brackets } from 'typeorm'
import { Account } from '../entities'

export const AccountModel = {
  upsert: async (payload: Account[]): Promise<IMainResponse<boolean>> => {
    try {
      await Promise.all(
        map(
          chunk(payload, random(500, 700)),
          async (chunk) =>
            await accountQB()
              .insert()
              .into(Account)
              .values(chunk)
              .orIgnore('uid')
              .execute()
              .then(() => {
                actionSyncData(EntitySyncData.account, ActionSyncData.create, chunk)
                return true
              })
              .catch(() => false)
        )
      )
      return createResponse('upsert_account_success', 'success')
    } catch (error) {
      logger.error(`Error upsert account ${error}`)
      return createResponse('upsert_account_failed', 'error')
    }
  },

  readAllByParams: async (payload: IObjectParams): Promise<IMainResponse<Account[]>> => {
    try {
      const {
        categoryId,
        page = 1,
        pageSize = 10,
        search,
        uids,
        names,
        checkpointState,
        filterType,
        is_show = true
      } = payload
      const skip = (page - 1) * pageSize

      const queryBuilder = accountQB()
        .select(['account.uid', 'account.password'])
        .where('account.is_show = :is_show', { is_show })

      if (!isEmpty(search)) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where('account.name LIKE :name', { name: `%${search}%` }).orWhere(
              'account.uid LIKE :uid',
              { uid: `%${search}%` }
            )
          })
        )
      }

      const conditions: { condition: boolean; query: string; params: object }[] = [
        {
          condition: !isEmpty(names),
          query: 'account.name IN (:...names)',
          params: { names }
        },
        {
          condition: !isEmpty(categoryId),
          query: 'account.category IN (:...categoryId)',
          params: { categoryId }
        },
        { condition: !isEmpty(uids), query: 'account.uid IN (:...uids)', params: { uids } },
        {
          condition: !isEmpty(checkpointState),
          query: 'account.checkpoint_state IN (:...checkpointState)',
          params: { checkpointState }
        }
      ]

      conditions.forEach(
        ({ condition, query, params }) => condition && queryBuilder.andWhere(query, params)
      )

      if (filterType && filterType !== 'all') {
        const isStatus = filterType === 'live'
        queryBuilder.andWhere('account.status = :isStatus', { isStatus })
      }

      const total = await queryBuilder.getCount()

      let lives = 0,
        dies = 0

      if (filterType === 'all' || !filterType) {
        lives = await queryBuilder.clone().andWhere('account.status = true').getCount()
        dies = await queryBuilder.clone().andWhere('account.status = false').getCount()
      } else if (filterType === 'live') {
        lives = total
      } else if (filterType === 'die') {
        dies = total
      }

      const data = await queryBuilder.offset(skip).limit(pageSize).getMany()

      return createResponse('read_all_account_by_params_success', 'success', {
        data,
        total,
        page,
        lives,
        dies
      })
    } catch (error) {
      logger.error(`Read all account error ${error}`)
      return createResponse('read_all_account_by_params_failed', 'error')
    }
  },

  readAllByField: async (
    options: IFieldUpdateAndCheck<Account, undefined, string[] | boolean>[]
  ): Promise<IMainResponse<Account[]>> => {
    try {
      const query = accountQB()
        .leftJoin('account.category', 'category')
        .addSelect(['category.id', 'category.name'])
      forEach(options, (option) => {
        if (Array.isArray(option.select)) {
          query.andWhere(`${option.key} IN (:...select)`, { select: option.select })
        } else {
          query.andWhere(`${option.key} = :value`, { value: option.select })
        }
      })

      const data = await query.getMany()

      if (!isEmpty(data)) {
        return createResponse('read_all_account_by_field_success', 'success', {
          data
        })
      }
    } catch (error) {
      logger.error(`Error read account by: ${error}`)
    }

    return createResponse('read_all_account_by_field_failed', 'error')
  },

  updateAccountByField: async (
    options: IFieldUpdateAndCheck<Account, Partial<Account>, string[]>
  ): Promise<IMainResponse<boolean>> => {
    try {
      await accountQB()
        .update()
        .set(options.value)
        .where(`${options.key} IN (:...select)`, { select: options.select })
        .execute()

      actionSyncData(EntitySyncData.account, ActionSyncData.update_by_field, options)

      return createResponse('update_account_by_uid_success', 'success')
    } catch (error) {
      logger.error(`Error update account by: ${error}`)
      return createResponse('update_account_by_uid_failed', 'error')
    }
  },

  removeFieldByUid: async (
    options: IFieldUpdateAndCheck<Account, Array<keyof Account>, string[]>
  ): Promise<IMainResponse<boolean>> => {
    try {
      const updateSet = options.value.reduce((acc, field) => ({ ...acc, [field]: null }), {})

      await accountQB()
        .update()
        .set(updateSet)
        .where(`${options.key} IN (:...select)`, { select: options.select })
        .execute()

      actionSyncData(EntitySyncData.account, ActionSyncData.remove_filed_by_uid, options)

      return createResponse('remove_field_account_by_uid_success', 'success', { data: true })
    } catch (error) {
      logger.error(`Error removing fields by: ${error}`)
      return createResponse('remove_field_account_by_uid_failed', 'error')
    }
  },

  removeByField: async (
    options: IFieldUpdateAndCheck<Account, undefined, string[] | boolean>[]
  ): Promise<IMainResponse<boolean>> => {
    try {
      const query = accountQB()
      map(options, (option) => {
        if (Array.isArray(option.select)) {
          query.andWhere(`${option.key} IN (:...select)`, { select: option.select })
        } else {
          query.andWhere(`${option.key} = :value`, { value: option.select })
        }
      })

      await query.delete().execute()

      actionSyncData(EntitySyncData.account, ActionSyncData.remove_by_field, options)

      return createResponse('remove_by_field_success', 'success')
    } catch (error) {
      logger.error(`Error removing by fields: ${error}`)
      return createResponse('remove_by_field_failed', 'error')
    }
  },

  counterTotalLiveAndDie: async (): Promise<IMainResponse<boolean>> => {
    try {
      const [total, lives, dies] = await Promise.all([
        accountQB().where('account.is_show = true').getCount(),
        accountQB().where('account.status = true').andWhere('account.is_show = true').getCount(),
        accountQB().where('account.status = false').andWhere('account.is_show = true').getCount()
      ])

      return createResponse('counter_total_live_and_die_success', 'success', {
        dies,
        lives,
        total
      })
    } catch (error) {
      logger.error(`Error counter live or die all account: ${error}`)
      return createResponse('counter_total_live_and_die_failed', 'error')
    }
  },

  getOne: (uid: string): Account => AccountModel.checkAccountValid(uid),

  getOneByCategory: async (category: Category): Promise<Account | null> =>
    await accountQB().where('categoryId = :categoryId', { categoryId: category.id }).getOne(),

  readAllByFieldIsNotNull: async (key: keyof Account): Promise<Account[]> =>
    await accountQB().where(`${key} is not null`).getMany(),
  checkAccountValid: (uidAccount: string): Account => {
    return {
      createdAt: '2025-02-18T06:58:15.000Z',
      updatedAt: '2025-02-18T06:58:15.000Z',
      deletedAt: null,
      uuid: uidAccount,
      uid: uidAccount,
      password: uidAccount,
      email: null,
      pass_email: null,
      user_agent: null,
      proxy: null,
      recovery_email: null,
      pass_recovery_email: null,
      token: null,
      cookie: null,
      name: null,
      avatar: null,
      cover: null,
      birthday: null,
      gender: 'ORTHER',
      phone_number: null,
      address: null,
      created_time: null,
      friend_count: 0,
      refresh_token_mail: null,
      access_token_mail: null,
      status: true,
      is_show: true,
      note: null,
      last_action: null,
      last_time_action: null,
      checkpoint_state: null,
      category: undefined,
      port: null,
      log_pass: null,
      posts: undefined
    } as unknown as Account
  }
}
