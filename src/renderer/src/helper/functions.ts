import type { IToggleValues, optionSelect } from '@renderer/types'
import { pickBy } from 'lodash'
import moment from 'moment'

export const setLocalStore = (key: string, value: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value)
  }
}

export const getLocalStore = (key: string): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key)
  } else {
    return null
  }
}

export function convertViToEn(str: string, toUpperCase = false): string {
  str = str.toLowerCase()
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
  str = str.replace(/đ/g, 'd')
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '') // Huyền sắc hỏi ngã nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, '') // Â, Ê, Ă, Ơ, Ư

  return toUpperCase ? str.toUpperCase() : str
}

export const convertNumber = (value: number | string): { value: number; check: boolean } => {
  let num = 0
  if (value) {
    value = value.toString().replace(/[.]/g, '')
    value = value.trim()
    num = Number(value)
  }

  const regex = /^-?\d*$/
  const check = regex.test(num.toString())
  return {
    value: num,
    check
  }
}

export const changeTitleDocmemt = (title?: string): void => {
  document.title = `${title} - Phần Mềm MKT`
}

export const numberConvert = (num: string | number): string => {
  let t = '0'
  if (num) {
    if (typeof num === 'string') {
      num = Number(num)
    }
    t = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }
  return t
}

export const pickBySearch = <T extends Record<string, unknown>>(obj: T): Partial<T> => {
  const filteredObj = pickBy(obj, (value) => value !== '')
  return filteredObj as Partial<T>
}

export const getValueSelected = (value?: unknown, options?: optionSelect[]): optionSelect[] => {
  const currentValue = (options ?? [])?.filter((otp) => {
    return Array.isArray(value) ? value?.includes(otp.value) : otp?.value === value
  })
  return currentValue
}

export const toggleValues = ({ array, value }: IToggleValues): string[] => {
  if (array.includes(value)) {
    return array.filter((item) => item !== value)
  } else {
    return [...array, value]
  }
}

export const arrayLocal = (array?: string): string[] => {
  try {
    const data = array ? JSON.parse(array) : []
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export const formatDate = (
  date?: string | number | Date,
  format: string = 'DD/MM/YYYY HH:mm:ss A'
): string => {
  return moment(date).format(format)
}

export const parseObject = (obj?: string): object => {
  try {
    const data = obj ? JSON.parse(obj) : {}
    return typeof data === 'object' ? data : {}
  } catch {
    return {}
  }
}
