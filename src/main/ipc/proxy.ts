import { ipcMainHandle } from '@main/core/custom-ipc'
import { createResponse, logger } from '@main/core/nodejs'
import { AccountModel, ProxyModel } from '@main/database/models'
import { connectMktProxyDb } from '@main/helper/utils'
import { unZipProxySync } from '@main/nodejs/helper'
import {
  checkLiveOrDieProxy,
  EnumProxyProvider,
  EnumProxyStatus,
  IPayloadCheckProxy,
  Proxy
} from '@vitechgroup/mkt-proxy-client'
import { chunk, map, random, shuffle } from 'lodash'
import { In } from 'typeorm'

export const IpcMainProxy = (): void => {
  ipcMainHandle('proxy_create', async (_, payload) => {
    let proxies: Proxy[] = []

    const mktProxyDb = await connectMktProxyDb()
    switch (payload.proxyType) {
      case 'v6_rotate':
      case 'key_proxy':
      case 'v4_rotate': {
        proxies = [
          {
            provider: payload.provider as EnumProxyProvider,
            key: payload?.list_key,
            apiKey: payload?.apiKey,
            proxyType: payload.proxyType,
            status: EnumProxyStatus.LIVE
          } as unknown as Proxy
        ]

        break
      }

      case 'static': {
        proxies = await unZipProxySync(payload.template, ':', payload.values, payload.proxyType)
      }
    }

    return await ProxyModel.upsert(proxies, mktProxyDb)
  })

  ipcMainHandle('proxy_readProxyByParams', async (_, payload) => {
    const mktProxyDb = await connectMktProxyDb()
    return await ProxyModel.readAllByParams(payload, mktProxyDb)
  })

  ipcMainHandle('proxy_readProxyByField', async (_, payload) => {
    const mktProxyDb = await connectMktProxyDb()
    return await ProxyModel.readAllByField(payload, mktProxyDb)
  })

  ipcMainHandle('proxy_delete', async (_, payload) => {
    const mktProxyDb = await connectMktProxyDb()
    return await ProxyModel.remove(payload, mktProxyDb)
  })

  ipcMainHandle('proxy_updateProxyRotateByField', async (_, payload) => {
    try {
      const mktProxyDb = await connectMktProxyDb()
      return await ProxyModel.updateProxyByField(payload, mktProxyDb)
    } catch (error) {
      logger.error(`Update proxy rotate by field error: ${error}`)
    }
    return createResponse('update_proxy_rotate_by_field_failed', 'error')
  })

  ipcMainHandle('proxy_updateProxyStaticByField', async (_, payload) => {
    try {
      const mktProxyDb = await connectMktProxyDb()

      if (!payload.listAccountId?.length || !payload.listProxyId?.length) {
        return createResponse('invalid_input_payload', 'error')
      }

      const [responseAccount, responseProxy] = await Promise.all([
        AccountModel.readAllByField([{ key: 'uid', select: payload.listAccountId }]),
        ProxyModel.readAllByField([{ key: 'id', select: payload.listProxyId }], mktProxyDb)
      ])

      const accounts = responseAccount?.payload?.data ?? []
      if (!accounts.length) {
        return createResponse('account_not_found', 'error')
      }

      const proxies = responseProxy?.payload?.data ?? []
      if (!proxies.length) {
        return createResponse('proxy_not_found', 'error')
      }

      const newAssignment: Record<string, string> = {}

      switch (payload.action) {
        case 'one_proxy_one_account': {
          for (let index = 0; index < proxies.length; index++) {
            const proxy = proxies[index]
            const account = accounts[index]
            if (proxy && account) {
              newAssignment[account.uid] =
                `${proxy.host}:${proxy.port}:${proxy.username}:${proxy.password}:${proxy.ipV6}:${proxy.id}`
            }
          }
          break
        }

        case 'one_proxy_many_account': {
          const quantity = Math.max(1, payload.quantity)
          const maxAccountsToAssign = proxies.length * quantity

          accounts.slice(0, maxAccountsToAssign).forEach((account, index) => {
            const proxyIndex = Math.floor(index / quantity) % proxies.length
            const proxy = proxies[proxyIndex]
            if (proxy) {
              newAssignment[account.uid] =
                `${proxy.host}:${proxy.port}:${proxy.username}:${proxy.password}:${proxy.ipV6}:${proxy.id}`
            }
          })

          break
        }

        case 'proxy_in_turn_account': {
          accounts.forEach((account, index) => {
            const proxyIndex = index % proxies.length
            const proxy = proxies[proxyIndex]
            if (proxy) {
              newAssignment[account.uid] =
                `${proxy.host}:${proxy.port}:${proxy.username}:${proxy.password}:${proxy.ipV6}:${proxy.id}`
            }
          })
          break
        }

        case 'random_one_proxy_one_account': {
          const shuffledProxies = shuffle([...proxies])
          const usedProxies = new Set<string>()
          for (const account of accounts) {
            const availableProxy = shuffledProxies.find((p) => !usedProxies.has(p.id))
            if (availableProxy) {
              newAssignment[account.uid] =
                `${availableProxy.host}:${availableProxy.port}:${availableProxy.username}:${availableProxy.password}:${availableProxy.ipV6}:${availableProxy.id}`
              usedProxies.add(availableProxy.id)
            }
          }
          break
        }

        default:
          return createResponse('invalid_action', 'error')
      }
      const updatePromises = Object.entries(newAssignment).map(([uid, proxyString]) =>
        AccountModel.updateAccountByField({
          key: 'uid',
          select: [uid],
          value: { proxy: proxyString }
        })
      )

      await Promise.all(updatePromises)

      return createResponse('update_proxy_by_field_success', 'success')
    } catch (error) {
      logger.error(`Update proxy by field error: ${error}`)
    }
    return createResponse('update_proxy_by_field_failed', 'error')
  })

  ipcMainHandle('proxy_checkLiveOrDieProxy', async (_, payload) => {
    try {
      const mktProxyDb = await connectMktProxyDb()

      const proxies = await mktProxyDb.proxyRepo.find({
        where: { id: In(payload) }
      })

      const dataCheck = proxies
        .map((proxy): IPayloadCheckProxy | undefined => {
          if (!proxy.host || !proxy.port) {
            return
          }

          return {
            id: proxy.id,
            host: proxy.host,
            port: proxy.port,
            username: proxy.username ?? '',
            password: proxy.password ?? '',
            ipV6: proxy.ipV6 ?? '',
            key: proxy.key ?? ''
          }
        })
        .filter((item) => item !== undefined)

      const data = await checkLiveOrDieProxy(dataCheck)
      const chunkSize = random(500, 700)

      await Promise.all(
        map(chunk(data, chunkSize), (chunk) =>
          Promise.all(
            chunk.map((item) =>
              ProxyModel.updateProxyByField(
                {
                  key: 'id',
                  select: [item.proxy.id],
                  value: { status: item.status ? EnumProxyStatus.LIVE : EnumProxyStatus.DIE }
                },
                mktProxyDb
              )
            )
          )
        )
      )

      return createResponse('check_live_or_die_proxies_success', 'success', {
        data
      })
    } catch (error) {
      logger.error(`Check live or die proxy error: ${error}`)
    }

    return createResponse('check_live_or_die_proxy_failed', 'error')
  })

  ipcMainHandle('proxy_readAllHistoryProxy', async (_, payload) => {
    const { page = 1, pageSize = 1 } = payload
    const mktProxyDb = await connectMktProxyDb()

    const skip = (page - 1) * pageSize

    const [data, total] = await mktProxyDb.sessionRepo.findAndCount({
      relations: ['proxy', 'proxy.logs'],
      order: {
        endTime: 'DESC'
      },
      skip,
      take: pageSize
    })

    return createResponse('read_all_history_proxy_success', 'success', {
      data,
      total
    })
  })
}
