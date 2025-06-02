import { Tooltips } from '@renderer/components'
import type { JobDetail } from '@vitechgroup/mkt-job-queue'
import { TFunction } from 'i18next'
// import { TFunctionNonStrict } from 'i18next'
import React, { memo } from 'react'

interface RenderLogsProps {
  currentJobDetail: JobDetail
  t?: TFunction<'translation', undefined>
}

const RenderLogs: React.FC<RenderLogsProps> = ({ t, currentJobDetail }) => {
  if (!currentJobDetail.logRunning || !t) {
    return (
      <Tooltips content="-">
        <span>-</span>
      </Tooltips>
    )
  }

  // const trans = translationLogProcessRun(t, currentJobDetail.logRunning)

  return <p>123</p>
}

export default memo(RenderLogs)
