import { createResponse, logger } from '@main/core/nodejs'
import { AccountModel } from '@main/database/models'
import {
  IFieldUpdateAndCheck,
  IMainResponse,
  IObjectParams,
  IPayloadRemoveProxy
} from '@preload/types'
import { checkInfoIp, EnumProxyStatus, MktProxyDb, Proxy } from '@vitechgroup/mkt-proxy-client'
import { forEach, map, random } from 'lodash'
import { In } from 'typeorm'

export const ProxyModel = {
  upsert: async (payload: Proxy[], mktProxyDb: MktProxyDb): Promise<IMainResponse<boolean>> => {
    try {
      await mktProxyDb.proxyRepo.save(payload, { chunk: random(500, 700) })

      await Promise.all(
        map(payload, async (ip) => {
          const infoIp = ip.host ? await checkInfoIp(ip.host) : null
          await mktProxyDb.proxyRepo
            .save({
              ...ip,
              country: infoIp?.geoip1?.country,
              lat: infoIp?.geoip1?.lat,
              lon: infoIp?.geoip1?.lon
            } as Proxy)
            .then(() => true)
            .catch(() => false)
        }).filter((item) => item !== undefined)
      )

      return createResponse('upsert_proxy_success', 'success')
    } catch (error) {
      logger.error(`Error upsert proxy ${error}`)
    }

    return createResponse('upsert_proxy_failed', 'error')
  },

  readAllByParams: async (
    payload: IObjectParams,
    mktProxyDb: MktProxyDb
  ): Promise<IMainResponse<Proxy[]>> => {
    try {
      const { page = 1, pageSize = 10, filterType, proxyType } = payload
      const skip = (page - 1) * pageSize

      const filterLive = {
        status: filterType === 'live' ? EnumProxyStatus.LIVE : EnumProxyStatus.DIE,
        ...(proxyType ? { proxyType: In(proxyType) } : {})
      }

      const whereCondition =
        filterType === 'all' ? { ...(proxyType ? { proxyType: In(proxyType) } : {}) } : filterLive

      const [data, total] = await Promise.all([
        mktProxyDb.proxyRepo.find({
          where: whereCondition,
          skip,
          take: pageSize
        }),
        mktProxyDb.proxyRepo.count({ where: whereCondition })
      ])

      return createResponse('read_all_proxy_success', 'success', { data, total, page })
    } catch (error) {
      logger.error(`Error read all proxy: ${error}`)
    }

    return createResponse('read_all_proxy_failed', 'error')
  },

  readAllByField: async (
    options: IFieldUpdateAndCheck<Proxy, undefined, string[] | boolean>[],
    mktProxyDb: MktProxyDb
  ): Promise<IMainResponse<Proxy[]>> => {
    const whereCondition = {}

    forEach(options, (option) => {
      if (Array.isArray(option.select)) {
        whereCondition[option.key] = In(option.select)
      } else {
        whereCondition[option.key] = option.select
      }
    })

    try {
      const data = await mktProxyDb.proxyRepo.find({
        where: whereCondition
      })

      return createResponse('read_many_proxy_by_success', 'success', { data })
    } catch (error) {
      logger.error(`Error read proxy by: ${error}`)
    }

    return createResponse('read_many_proxy_by_failed', 'error')
  },

  updateProxyByField: async (
    options: IFieldUpdateAndCheck<Proxy, Partial<Proxy>, string[]>,
    mktProxyDb: MktProxyDb
  ): Promise<IMainResponse<boolean>> => {
    try {
      const proxies = await mktProxyDb.proxyRepo.find({
        where: { [options.key]: In(options.select) }
      })

      if (proxies.length === 0) {
        return createResponse('proxies_not_found', 'error')
      }

      if (proxies.length !== options.select.length) {
        return createResponse('some_proxies_not_found', 'error')
      }

      await mktProxyDb.proxyRepo.update({ [options.key]: In(options.select) }, options.value)

      return createResponse('update_proxy_by_field_success', 'success')
    } catch (error) {
      logger.error(
        `Error updating proxies by field: ${error instanceof Error ? error.message : error}`
      )
    }

    return createResponse('update_proxy_by_field_failed', 'error')
  },

  remove: async (
    payload: IPayloadRemoveProxy,
    mktProxyDb: MktProxyDb
  ): Promise<IMainResponse<boolean>> => {
    try {
      const proxies = await mktProxyDb.proxyRepo.find({
        where: { id: In(payload.ids) }
      })

      if (!proxies.length) {
        return createResponse('proxy_not_found', 'error')
      }

      const dataProxy = proxies.map(
        (proxy) =>
          `${proxy.host}:${proxy.port}:${proxy.username}:${proxy.password}:${proxy.ipV6}:${proxy.id}`
      )

      await AccountModel.updateAccountByField({
        key: 'proxy',
        select: dataProxy,
        value: { proxy: null }
      })

      await mktProxyDb.proxyRepo.delete({
        id: In(payload.ids)
      })

      return createResponse('delete_proxy_success', 'success')
    } catch (error) {
      logger.error(`Error removing proxy: ${error}`)
    }

    return createResponse('delete_proxy_failed', 'error')
  }
}
