import { IPrefixIpcEnum } from '@preload/types'

export type IMainResponseStatus = 'success' | 'error'

export interface IResponsePayload<T> {
  data: T | undefined
  total: number
  lives: number
  dies: number
  page: number
  pageSize: number
}

export type IFieldUpdateAndCheck<T, R, M> = R extends undefined
  ? M extends undefined
    ? never
    : {
        key: keyof T
        value?: undefined
        select: M
      }
  : M extends undefined
    ? {
        key: keyof T
        value: R
        select?: undefined
      }
    : {
        key: keyof T
        value: R
        select: M
      }

export interface IMainResponse<T> {
  status: IMainResponseStatus
  message: { key: string }
  payload: Partial<IResponsePayload<T>> | null
}

export type IIpcCustomRenderer<T extends Record<string, RouteDefinition>> = {
  [K in keyof T]: T[K]['args'] extends undefined
    ? () => Promise<IMainResponse<T[K]['ret']>>
    : (payload: T[K]['args']) => Promise<IMainResponse<T[K]['ret']>>
}

type Join<Parts extends string[]> = Parts extends []
  ? never
  : Parts extends [string]
    ? Parts[0]
    : Parts extends [string, ...infer Rest]
      ? `${Parts[0]}_${Join<Rest & string[]>}`
      : never

type RouteDefinition = { args?: unknown; ret: unknown }

type Endpoint<Arg, Return> = [Arg] extends [undefined]
  ? [[], IMainResponse<Return>]
  : [[Arg], IMainResponse<Return>]

export type MakeEndpoints<
  Prefix extends IPrefixIpcEnum,
  M extends Record<string, RouteDefinition>
> = {
  [K in keyof M as Join<[Prefix, K & string]>]: Endpoint<M[K]['args'], M[K]['ret']>
}
