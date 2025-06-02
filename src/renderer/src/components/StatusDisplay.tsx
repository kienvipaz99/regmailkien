import type { Account } from '@preload/types'
import { numberConvert } from '@renderer/helper'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

type StatusDisplayProps = {
  accountsList?: Account[]
}

interface counter {
  live: number
  die: number
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({ accountsList = [] }) => {
  const { t } = useTranslation()

  const counter = useMemo((): counter => {
    if (!accountsList) {
      return { die: 0, live: 0 }
    }
    return {
      live: accountsList.filter((acc) => acc.status === true)?.length,
      die: accountsList.filter((acc) => acc.status === false)?.length
    }
  }, [accountsList])

  return (
    <div className="flex items-center gap-5">
      <span className="flex gap-2 whitespace-nowrap font-bold">
        {t('total')}: <p className="text-blue-500">{numberConvert(accountsList.length || 0)}</p>
      </span>
      <span className="flex gap-2 whitespace-nowrap font-bold">
        {t('Live')}: <p className="text-success">{numberConvert(counter.live || 0)}</p>
      </span>
      <span className="flex gap-2 whitespace-nowrap font-bold">
        {t('Die')}: <p className="text-red-500">{numberConvert(counter.die || 0)}</p>
      </span>
    </div>
  )
}

export default StatusDisplay
