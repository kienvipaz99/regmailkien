import { Tooltips } from '@renderer/components'
import type { JobDetail } from '@vitechgroup/mkt-job-queue'
import { TFunction } from 'i18next'
// import { TFunctionNonStrict } from 'i18next'
import React, { memo } from 'react'

interface LogDetail {
  mess: string
  success: boolean
}
interface RenderAllLogsProps {
  currentJobDetail: JobDetail
  t?: TFunction<'translation', undefined>
}

const RenderAllLogs: React.FC<RenderAllLogsProps> = ({ t, currentJobDetail }) => {
  const logData = JSON.parse(currentJobDetail.logs ?? '{}') as Record<string, LogDetail>
  const logEntries = Object.entries(logData).map(([key, value]) => {
    const { success } = value
    const color = success ? 'green' : 'red'
    const statusText = success ? t && t('success') : t && t('error')

    return (
      <span key={key}>
        {/* <span>{translationLogProcessRun(t, mess)}</span> */}
        <span style={{ color: color }} className="ml-1 font-semibold">
          ({statusText})
        </span>
      </span>
    )
  })
  const logOutput = logEntries.reduce((prev, curr) => (
    <>
      {prev} {' -> '} {curr}
    </>
  ))

  return (
    <Tooltips content={logOutput}>
      <span>{logOutput}</span>
    </Tooltips>
  )
}

export default memo(RenderAllLogs)
