import { TypeProxyHi } from '@main/types'
import { delay } from '@vitechgroup/mkt-key-client'
import axios from 'axios'

export const ProxyHi = async (key: string): Promise<ProxyAuth> => {
  const callAPI = await axios.get(
    `https://proxyxoay.org/api/get.php?key=${key}&&nhamang=random&&tinhthanh=0`
  )
  const data = callAPI.data as TypeProxyHi
  if (data.status === 101 && typeof data.message === 'string') {
    const match = data.message.match(/Con (\d+)s/i)
    const seconds = match ? parseInt(match[1]) : 60
    await delay((seconds + 1) * 1000)
    return await ProxyHi(key)
  }
  const dataproxy =
    data?.status === 100
      ? parseProxyString(data.proxyhttp)
      : {
          host: '',
          port: 0,
          username: '',
          password: '',
          key: '',
          ipV6: ''
        }

  return {
    status: data?.status === 100,
    data: dataproxy
  }
}
export type ProxyAuth = {
  status: boolean
  data: PareProxy
}
export type PareProxy = {
  host: string
  port: number
  username: string
  password: string
  ipV6?: string
  key?: string
}
export function parseProxyString(proxyStr: string): PareProxy {
  const [host, portStr, username, password] = proxyStr.split(':')
  if (!host || !portStr || !username || !password) {
    throw new Error('❌ Proxy string không đúng định dạng host:port:username:password')
  }

  return {
    host,
    port: parseInt(portStr, 10),
    username,
    password
  }
}
