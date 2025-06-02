import { ICalculatorTotalPage, ISTTParams } from '@renderer/components'

export const calculatorTotalPage = ({ total = 0, pageSize = 0 }: ICalculatorTotalPage): number => {
  if (!pageSize || (pageSize && pageSize <= 0)) return 0
  return Math.ceil(total / pageSize)
}

export const STT = (data?: ISTTParams, index?: number): number => {
  let stt = 1
  let current_page = 0
  let per_page = 0

  if (data?.page !== undefined && data?.pageSize !== undefined) {
    current_page = data.page
    per_page = data.pageSize
  }

  let i = (current_page - 1) * per_page
  i = isNaN(i) ? 0 : i
  stt = i + (index ?? 0) + 1

  return stt
}
