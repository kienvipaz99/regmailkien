import { DB_PROXY_FILE, logger, sendMessageToMain } from '@main/core/nodejs'
import { Account as AccountEntity } from '@main/database/entities'
import { AccountModel } from '@main/database/models'
import {
  Account,
  IJobData,
  IPayloadJobManager,
  ITaskName,
  ITypeModuleLogUpdate
} from '@preload/types'
import { IPayloadLogUpdate, JobDetail, JobDetailStatus } from '@vitechgroup/mkt-job-queue'
import { delay, MktClient } from '@vitechgroup/mkt-key-client'
import { IResultAssignProxy, MktProxyManager } from '@vitechgroup/mkt-proxy-client'

export class JobManager {
  private jobData: IJobData<ITaskName>
  private payload: IPayloadJobManager<ITaskName>

  constructor(payload: IPayloadJobManager<ITaskName>) {
    this.payload = payload

    payload.parentPort.on('message', payload.handleParentMessage.bind(this))
    payload.mktJobQueue.on('next', this.handleNextJob.bind(this))
    payload.parentPort.on('check_retry_action', this.handleCheckRetry.bind(this))
  }

  public start(): void {
    this.payload.mktJobQueue
      .getJobDb()
      .jobRepo.findOneBy({ id: this.payload.jobId })
      .then(async (job) => {
        if (job && job.data) {
          this.jobData = JSON.parse(job.data)
          MktClient.get().httpClient.setUser(this.jobData.user)
          sendMessageToMain(this.payload.parentPort, { key: 'read_history_again' })
          this.payload.mktJobQueue.start()
        }
      })
      .catch((error) =>
        logger.error(`[Lỗi truy vấn]: [JOB_ID = ${this.payload.jobId}] => ${error}`)
      )
  }

  private async updateStatusJobDetail(jobDetailId: string, status: JobDetailStatus): Promise<void> {
    await this.payload.mktJobQueue.getJobDb().jobDetailModel?.updateStatus(jobDetailId, status)
  }

  private async updateStatusJobDetailByJobId(): Promise<void> {
    await this.payload.mktJobQueue
      .getJobDb()
      .jobDetailModel?.whereJobId(this.payload.jobId)
      .update({ status: JobDetailStatus.queue })
      .execute()
  }

  private async logUpdate(
    jobDetailId: string,
    options: IPayloadLogUpdate<ITypeModuleLogUpdate>
  ): Promise<boolean> {
    try {
      return !!(await this.payload.mktJobQueue
        .getJobDb()
        .jobDetailModel?.log(jobDetailId, {
          ...options,
          key: options.key ?? options.mess,
          actionName: this.jobData.actionName
        })
        .finally(() => sendMessageToMain(this.payload.parentPort, { key: 'log_update' })))
    } catch (error) {
      logger.error(`[Cập nhật log thất bại]: [JOB_DETAIL_ID = ${jobDetailId}] => ${error}`)
    }

    return false
  }

  private async check(jobDetail: JobDetail): Promise<IResultAssignProxy | undefined> {
    try {
      const jobDetailData = JSON.parse(jobDetail.data ?? '{}')
      const account = await AccountModel.getOne(jobDetailData.uidAccount)
      if (!account) {
        return
      }
      const proxy = await this.handleAssignProxy(account, jobDetail)
      if (!proxy) {
        return
      }
      return proxy
    } catch (error) {
      console.log(error)
    }
    return
  }

  private async handleNextJob(jobDetail: JobDetail): Promise<void> {
    const proxy = await this.check(jobDetail)
    if (!proxy && this.jobData.setting_proxy.selected_proxy === 'proxy_rotating') {
      await this.updateStatusJobDetail(jobDetail.id, JobDetailStatus.queue)
      this.payload.mktJobQueue.done(jobDetail.id)
      this.payload.parentPort.emit('check_queue', this.jobData.actionName)
      return
    }

    try {
      const jobDetailData = JSON.parse(jobDetail.data ?? '{}')

      const account = await AccountModel.getOne(jobDetailData.uidAccount)
      if (account) {
        const status = await this.payload.callbackAction(
          {
            account,
            jobDetail,
            jobDetailData,
            jobId: this.payload.jobId,
            jobData: this.jobData,
            parentPort: this.payload.parentPort,
            logUpdate: (options) => this.logUpdate(jobDetail.id, options)
          },
          proxy?.data
        )

        await this.updateStatusJobDetail(jobDetail.id, status)
      }
    } catch (error) {
      await this.updateStatusJobDetail(jobDetail.id, JobDetailStatus.fail)
      logger.error(`[Lỗi job detail]: [JOB_DETAIL_ID = ${jobDetail.id}] => ${error}`)
    } finally {
      this.payload.mktJobQueue.done(jobDetail.id)
      this.payload.parentPort.emit('check_queue', this.jobData.actionName)
    }
  }

  private async handleCheckRetry(): Promise<void> {
    if (this.payload?.retry && this.payload.retry.is_use && this.payload.retry.numRetry > 0) {
      this.payload.retry.numRetry--
      await this.updateStatusJobDetailByJobId()
      await this.payload.mktJobQueue.open()
      await delay(this.payload.retry.timeout * 1000)

      this.start()
      return
    }

    sendMessageToMain(this.payload.parentPort, { key: 'job_action_finally' })
  }

  private async handleAssignProxy(
    account: Account,
    jobDetail: JobDetail
  ): Promise<IResultAssignProxy | undefined> {
    const proxyId = account.proxy?.split(':')[5]

    const isChangeProxyRotating = this.jobData.setting_proxy.selected_proxy === 'proxy_rotating'

    const isChangeProxy = isChangeProxyRotating || !!proxyId

    if (!isChangeProxy) {
      return
    }
    const mktProxyManager = MktProxyManager.getInstance(DB_PROXY_FILE)
    if (!mktProxyManager.mktProxyDb.dataSource.isInitialized) {
      await mktProxyManager.mktProxyDb.dataSource.initialize()
      mktProxyManager.mktProxyDb.connect()
    }

    const typeChangeIp =
      !isChangeProxyRotating && proxyId
        ? 'proxy_static'
        : this.jobData.setting_proxy.type_proxy === 'no_change_ip'
          ? 'ww_proxy'
          : this.jobData.setting_proxy.type_proxy

    return await mktProxyManager.assignProxy(
      {
        accountUid: Object.prototype.hasOwnProperty.call(AccountEntity.prototype, 'uid')
          ? account['uid']
          : account['phone'],
        jobDetailId: jobDetail.id,
        thread: this.jobData.setting_system.threads_run,
        threadPerIp: this.jobData.setting_system.thread_proxy,
        proxyId: isChangeProxyRotating ? undefined : proxyId,
        isChangeProxy,
        typeChangeIp
      },
      (options) => this.logUpdate(jobDetail.id, { ...options, module: 'mkt_proxy' }),
      ''
    )
  }
}
