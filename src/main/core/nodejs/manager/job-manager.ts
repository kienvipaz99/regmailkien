/* eslint-disable @typescript-eslint/ban-ts-comment */
import { DB_PROXY_FILE, logger, sendMessageToMain } from '@main/core/nodejs'
import { AccountModel } from '@main/database/models'
import { ProxyAuth, ProxyHi } from '@main/helper/proxyhi'
import { ProxyPoolManager } from '@main/helper/ProxyPoolManager'
import {
  Account,
  IJobData,
  IJobDetailData,
  IPayloadJobManager,
  IProxyData,
  ITaskName,
  ITypeModuleLogUpdate
} from '@preload/types'
import { IPayloadLogUpdate, JobDetail, JobDetailStatus } from '@vitechgroup/mkt-job-queue'
import { delay } from '@vitechgroup/mkt-key-client'
import { EnumProxyProvider, MktProxyManager } from '@vitechgroup/mkt-proxy-client'

export class JobManager {
  private jobData: IJobData<ITaskName>
  private payload: IPayloadJobManager<ITaskName>
  private isChangeProxy: boolean = false
  private static initializedProxyPool = false
  constructor(payload: IPayloadJobManager<ITaskName>) {
    this.payload = payload

    payload.parentPort.on('message', payload.handleParentMessage.bind(this))
    payload.mktJobQueue.on('next', this.handleNextJob.bind(this))
    payload.parentPort.on('check_retry_action', this.handleCheckRetry.bind(this))
  }
  public static async create(payload: IPayloadJobManager<ITaskName>): Promise<JobManager> {
    const jobManager = new JobManager(payload)
    await jobManager.initSharedKeyPool()
    return jobManager
  }
  public start(): void {
    this.payload.mktJobQueue
      .getJobDb()
      .jobRepo.findOneBy({ id: this.payload.jobId })
      .then(async (job) => {
        if (job && job.data) {
          this.jobData = JSON.parse(job.data)
          sendMessageToMain(this.payload.parentPort, { key: 'read_history_again' })
          this.payload.mktJobQueue.start()
        }
      })
      .catch((error) =>
        logger.error(`[Lỗi truy vấn]: [JOB_ID = ${this.payload.jobId}] => ${error}`)
      )
  }
  private async initSharedKeyPool(): Promise<void> {
    if (JobManager.initializedProxyPool) return

    const mktProxyManager = MktProxyManager.getInstance(DB_PROXY_FILE)
    const proxyDb = await mktProxyManager.connectDb()
    //@ts-ignore
    const proxies = await proxyDb.proxyRepo.findBy({ provider: 'shared_key_pool' })

    const keys = proxies
      .flatMap((p) => p.key?.split('\n') ?? [])
      .map((k) => k.trim())
      .filter(Boolean)

    ProxyPoolManager.getInstance().initialize(keys)
    JobManager.initializedProxyPool = true
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

  private async handleNextJob(jobDetail: JobDetail): Promise<void> {
    let dataProxy: IProxyData | ProxyAuth | undefined
    try {
      const jobDetailData = JSON.parse(jobDetail.data ?? '{}') as IJobDetailData<ITaskName>
      const account = AccountModel.getOne(jobDetailData.uidAccount)
      if (account) {
        if (this.jobData.setting_proxy.type_proxy === 'shared_key_pool') {
          dataProxy = await this.handleAssignSharedKeyProxy()
        } else {
          dataProxy = await this.handleAssignProxy(account)
        }

        if (this.isChangeProxy && !dataProxy?.proxy?.success) {
          await this.updateStatusJobDetail(jobDetail.id, JobDetailStatus.queue)
          this.doneJobDetail(jobDetail)
          this.finishKeyProxyUse(dataProxy)
          return
        }

        await this.startJob(jobDetailData, account, jobDetail, dataProxy)
      }
    } catch (error) {
      await this.updateStatusJobDetail(jobDetail.id, JobDetailStatus.fail)
      logger.error(`[Lỗi next job detail]: [JOB_DETAIL_ID = ${jobDetail.id}] => ${error}`)
    }
  }

  private async startJob(
    jobDetailData: IJobDetailData<ITaskName>,
    account: Account,
    jobDetail: JobDetail,
    dataProxy?: IProxyData | undefined
  ): Promise<void> {
    try {
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
        dataProxy?.proxy?.data
      )
      await this.updateStatusJobDetail(jobDetail.id, status)
    } catch (error) {
      await this.updateStatusJobDetail(jobDetail.id, JobDetailStatus.fail)
      logger.error(`[Lỗi start job detail]: [JOB_DETAIL_ID = ${jobDetail.id}] => ${error}`)
    } finally {
      console.log('done')

      this.doneJobDetail(jobDetail)
      this.finishKeyProxyUse(dataProxy)
    }
  }

  private doneJobDetail(jobDetail: JobDetail): void {
    this.payload.mktJobQueue.done(jobDetail.id)
    this.payload.parentPort.emit('check_queue', this.jobData.actionName)
  }

  private finishKeyProxyUse(dataProxy: IProxyData | undefined): void {
    if (!dataProxy?.proxy?.data?.key) return

    const key = dataProxy.proxy.data.key
    if (dataProxy.typeChangeIp === 'shared_key_pool') {
      console.log(key, 'release key')
      ProxyPoolManager.getInstance().releaseKey(key)
    } else if (this.isChangeProxy) {
      MktProxyManager.getInstance(DB_PROXY_FILE).finishIpUse(key, dataProxy.typeChangeIp)
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

  private async handleAssignProxy(account: Account): Promise<IProxyData | undefined> {
    const proxyId = account.proxy?.split(':')[5]

    const isChangeProxyRotating = this.jobData.setting_proxy.selected_proxy === 'proxy_rotating'

    this.isChangeProxy = this.jobData.no_change_proxy ? false : isChangeProxyRotating || !!proxyId

    if (!this.isChangeProxy) {
      return
    }

    const mktProxyManager = MktProxyManager.getInstance(DB_PROXY_FILE)
    const proxyDb = await mktProxyManager.connectDb()

    const typeChangeIp =
      !isChangeProxyRotating && proxyId
        ? 'proxy_static'
        : this.jobData.setting_proxy.type_proxy === 'no_change_ip'
          ? EnumProxyProvider.WWPROXY
          : (this.jobData.setting_proxy.type_proxy as EnumProxyProvider)

    if (typeChangeIp === 'proxy_static') {
      const proxy = await proxyDb.proxyRepo.findOneBy({ id: proxyId })

      return {
        proxy: {
          success: true,
          data: {
            host: proxy?.host ?? '',
            port: proxy?.port ?? 0,
            username: proxy?.username ?? '',
            password: proxy?.password ?? '',
            key: proxy?.key ?? '',
            ipV6: proxy?.ipV6 ?? ''
          }
        },
        typeChangeIp: EnumProxyProvider.WWPROXY
      }
    }

    const proxy = await mktProxyManager.changeIp({
      threadPerIp: this.jobData.setting_system.thread_proxy,
      typeChangeIp
    })

    return {
      proxy,
      typeChangeIp
    }
  }
  private async handleAssignSharedKeyProxy(): Promise<IProxyData | undefined> {
    const proxyPool = ProxyPoolManager.getInstance()
    const key = await proxyPool.acquireKey()

    try {
      const proxy = await ProxyHi(key)
      console.log(key, 'key')

      return {
        typeChangeIp: 'shared_key_pool',
        proxy: {
          success: proxy.status,
          data: {
            host: proxy.data.host,
            key: key, // LUÔN gán key để xử lý release sau
            password: proxy.data.password,
            username: proxy.data.username,
            port: proxy.data.port
          }
        }
      }
    } catch (error) {
      logger.error(`[SharedKeyProxy] Lỗi khi lấy proxy với key: ${key} => ${error}`)
      return {
        typeChangeIp: 'shared_key_pool',
        proxy: {
          success: false,
          data: {
            host: '',
            key: key, // vẫn return key để xử lý release
            password: '',
            username: '',
            port: 0
          }
        }
      }
    }
  }
}
