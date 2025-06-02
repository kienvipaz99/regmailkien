import type { Account } from '@preload/types'
import CopyToClipboard from '@renderer/components/CopyToClipboard'
import InputPasswordTable from '@renderer/components/CustomFormField/InputPasswordTable'
import ToolTips from '@renderer/components/Default/Tooltips'
import type { ITableData, TColumnsTable } from '@renderer/types'
import type { JobDetail } from '@vitechgroup/mkt-job-queue'
import { TFunction } from 'i18next'
// import { TFunctionNonStrict } from 'i18next'
import moment from 'moment'

export const configTableAddAccount = (show_avatar: boolean = false): TColumnsTable<Account> => {
  return [
    {
      key: 'uid',
      minWidth: 150,
      maxWidth: 200,
      name: 'account_key.uid',
      sortable: true
    },
    {
      key: 'avatar',
      name: 'account_key.avatar',
      minWidth: 150,
      maxWidth: 180,
      sortable: true,
      renderCell: ({ row: { name, avatar } }): JSX.Element => (
        <div className="flex items-center gap-2">
          <ToolTips content={name}>
            {show_avatar && avatar ? (
              <img
                className="w-6 h-6 rounded-full object-cover saturate-50 group-hover:saturate-100"
                src={avatar}
                alt="userProfile"
              />
            ) : (
              <h4 className="text-base">-</h4>
            )}
          </ToolTips>
        </div>
      )
    },

    {
      key: 'password',
      name: 'account_key.password',
      width: 170,
      renderCell: ({ row: { password } }) => (
        <InputPasswordTable
          clsInput="shadow-none rounded-none"
          name="password"
          password={password}
          isShowDefault={false}
        />
      )
    },

    // {
    //   key: '_2fa',
    //   name: 'account_key._2fa',
    //   width: 150,
    //   renderCell: ({ row: { _2fa } }) => (
    //     <ToolTips content={_2fa} classWapper="overflow-hidden">
    //       <span>{_2fa}</span>
    //     </ToolTips>
    //   )
    // },

    {
      key: 'cookie',
      name: 'account_key.cookie',
      width: 150,
      renderCell: ({ row: { cookie } }) => <span>{cookie}</span>
    },

    {
      key: 'token',
      name: 'account_key.token',
      width: 150,
      renderCell: ({ row: { token } }) => <span>{token}</span>
    },

    {
      key: 'email',
      name: 'account_key.email',
      width: 150,
      renderCell: ({ row: { email } }) => (
        <ToolTips content={email}>
          <span>{email}</span>
        </ToolTips>
      )
    },
    {
      key: 'pass_email',
      name: 'account_key.pass_email',
      width: 150,
      renderCell: ({ row: { pass_email } }) => (
        <ToolTips content={pass_email}>
          <span>{pass_email}</span>
        </ToolTips>
      )
    },

    {
      key: 'recovery_email',
      name: 'account_key.recovery_email',
      width: 150,
      renderCell: ({ row: { recovery_email } }) => (
        <ToolTips content={recovery_email}>
          <span>{recovery_email}</span>
        </ToolTips>
      )
    },
    {
      key: 'pass_recovery_email',
      name: 'account_key.pass_recovery_email',
      width: 200,
      renderCell: ({ row: { pass_recovery_email } }) => (
        <ToolTips content={pass_recovery_email}>
          <span>{pass_recovery_email}</span>
        </ToolTips>
      )
    },
    {
      key: 'birthday',
      name: 'account_key.birthday',
      width: 150,
      renderCell: ({ row: { birthday } }) => (
        <ToolTips content={birthday}>
          <span>{birthday}</span>
        </ToolTips>
      )
    },
    {
      key: 'proxy',
      name: 'account_key.proxy',
      width: 150,
      renderCell: ({ row: { proxy } }) => (
        <ToolTips content={proxy}>
          <span>{proxy}</span>
        </ToolTips>
      )
    }
  ]
}

export const configTableManagerAccount = (payload?: ITableData): TColumnsTable<Account> => {
  return [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(configTableAddAccount(payload?.settingSystem?.show_avatar) as any),
    {
      key: 'created_time',
      name: 'account_key.created_time',
      sortable: true,
      resizable: true,
      renderCell: ({ row: { created_time } }): JSX.Element => {
        return <span>{created_time ? moment(created_time).format('DD/MM/YYYY') : '-'}</span>
      }
    },

    {
      key: 'log',
      name: 'process_history',
      resizable: true
    },

    {
      key: 'status',
      name: 'account_key.status',
      sortable: true,
      resizable: true,
      width: 200,
      renderCell: ({ row: { status } }) => (
        <span>
          {status ? (
            <p className="text-[#00ab55] w-[70px] px-3 py-[2px] m-auto !font-bold text-left rounded-xl bg-[#DEFDD7]">
              Live
            </p>
          ) : (
            <p className="text-[#ef4444] w-[70px] px-3 py-[2px] m-auto !font-bold text-left rounded-xl bg-[#FFE2E2]">
              Die
            </p>
          )}
        </span>
      )
    },

    {
      key: 'access_token_mail',
      name: 'account_key.access_token_mail',
      sortable: true,
      resizable: true
    },

    {
      key: 'refresh_token_mail',
      name: 'account_key.refresh_token_mail',
      sortable: true,
      resizable: true
    },

    {
      key: 'last_action',
      name: 'account_key.last_action',
      sortable: true,
      resizable: true,
      width: 250,
      renderCell: ({ row: { last_action } }): JSX.Element => {
        return <span>{last_action ? payload?.t(`last_action.${last_action}`) : '-'}</span>
      }
    },

    {
      key: 'last_time_action',
      name: 'account_key.last_time_action',
      sortable: true,
      resizable: true
    },

    {
      key: 'category.name',
      name: 'account_key.category',
      sortable: true,
      resizable: true,
      maxWidth: 150,
      renderCell: ({ row: { category } }): JSX.Element => {
        return (
          <ToolTips content={category?.name ?? '-'}>
            <span>{category?.name ?? '-'}</span>
          </ToolTips>
        )
      }
    },

    {
      key: 'note',
      name: 'account_key.note',
      sortable: true,
      resizable: true,
      width: 200,
      renderCell: ({ note }: Account) => (
        <ToolTips content={note}>
          <span>{note}</span>
        </ToolTips>
      )
    }
  ]
}

export const configTableInteractionAccount = (payload: {
  t?: TFunction<'translation', undefined>
  dataHistory: JobDetail[]
}): TColumnsTable<Account> => {
  payload

  return [
    {
      key: 'uid',
      name: 'account_key.uid',
      sortable: true
    },

    {
      key: 'name',
      name: 'account_key.name'
    },

    {
      key: 'email',
      name: 'account_key.email',
      width: 150,
      renderCell: ({ row: { email } }) => (
        <ToolTips content={email}>
          <span>{email}</span>
        </ToolTips>
      )
    },

    {
      key: 'status',
      name: 'account_key.status',
      sortable: true,
      renderCell: ({ row: { status } }) => (
        <span>
          {status ? (
            <p className="text-[#00ab55] w-[70px] px-3 py-[2px] m-auto !font-bold text-left rounded-xl bg-[#DEFDD7]">
              Live
            </p>
          ) : (
            <p className="text-[#ef4444] w-[70px] px-3 py-[2px] m-auto !font-bold text-left rounded-xl bg-[#FFE2E2]">
              Die
            </p>
          )}
        </span>
      )
    }

    // {
    //   key: 'error_count',
    //   name: 'account_key.error_count',
    //   width: 100,
    //   renderCell: ({ row: { uid } }): JSX.Element => {
    //     const currentJob = findJobDetail(uid, dataHistory)
    //     const result = findValueByModuleAndKey(
    //       JSON.parse(currentJob?.logs ?? '{}'),
    //       'interaction_account',
    //       'action_failed'
    //     )
    //     return (
    //       <ToolTips content={`Số lần thất bại ${result?.length ?? 0}`}>
    //         <span>{result?.length ?? 0}</span>
    //       </ToolTips>
    //     )
    //   }
    // },
    // {
    //   key: 'success_count',
    //   name: 'account_key.success_count',
    //   width: 130,
    //   renderCell: ({ row: { uid } }): JSX.Element => {
    //     const currentJob = findJobDetail(uid, dataHistory)
    //     const result = findValueByModuleAndKey(
    //       JSON.parse(currentJob?.logs ?? '{}'),
    //       'interaction_account',
    //       'action_success'
    //     )
    //     return (
    //       <ToolTips content={`Số lần thành công ${result?.length ?? 0}`}>
    //         <span>{result?.length ?? 0}</span>
    //       </ToolTips>
    //     )
    //   }
    // },
    // {
    //   key: 'log_process_run',
    //   name: 'account_key.log',
    //   renderCell: ({ row: { uid } }): JSX.Element => {
    //     const currentJobDetail = findJobDetail(uid, dataHistory)
    //     return (
    //       <>{currentJobDetail ? <RenderLogs t={t} currentJobDetail={currentJobDetail} /> : '-'}</>
    //     )
    //   }
    // }
    // {
    //   key: 'log_process_run',
    //   name: 'progress',
    //   width: '200px',
    //   renderCell: ({ row: { uid } }): JSX.Element => {
    //     const currentJobDetail = (dataHistory ?? []).find((jobDetail) => {
    //       if (!jobDetail.data) {
    //         return
    //       }
    //       const data = JSON.parse(jobDetail.data) as IJobDetailData<'interaction_account'>
    //       return data.uidAccount === uid
    //     })
    //     return (
    //       <>
    //         {currentJobDetail ? <RenderAllLogs t={t} currentJobDetail={currentJobDetail} /> : '-'}
    //       </>
    //     )
    //   }
    // }
  ]
}

export const configTableModalSelectAccount = (): TColumnsTable<Account> => [
  {
    key: 'uid',
    name: 'account_key.uid',
    sortable: true,
    resizable: true
  },
  {
    key: 'fullname',
    name: 'account_key.name',
    sortable: true,
    resizable: true
  },
  {
    key: 'login_state',
    name: 'account_key.login_state',
    minWidth: 250,
    resizable: true
  }
]

export const configTableManagerAccountAssignProxy = (): TColumnsTable<Account> => {
  return [
    {
      key: 'uid',
      minWidth: 150,
      maxWidth: 200,
      name: 'account_key.uid',
      resizable: true,
      sortable: true,
      renderCell: ({ row: { uid } }) => (
        <CopyToClipboard content={uid}>
          <span>{uid}</span>
        </CopyToClipboard>
      )
    },
    {
      key: 'name',
      name: 'account_key.name',
      resizable: true,
      sortable: true,
      minWidth: 150,
      maxWidth: 200
    },
    {
      key: 'category.name',
      name: 'account_key.category',
      sortable: true,
      resizable: true,
      maxWidth: 150,
      renderCell: ({ row: { category } }): JSX.Element => {
        return (
          <ToolTips content={category?.name ?? '-'}>
            <span>{category?.name ?? '-'}</span>
          </ToolTips>
        )
      }
    },
    {
      key: 'status',
      name: 'account_key.status',
      sortable: true,
      resizable: true,
      width: 200,
      renderCell: ({ row: { status } }) => (
        <span>
          {status ? (
            <p className="text-[#00ab55] w-[70px] px-3 py-[2px] m-auto !font-bold text-left rounded-xl bg-[#DEFDD7]">
              Live
            </p>
          ) : (
            <p className="text-[#ef4444] w-[70px] px-3 py-[2px] m-auto !font-bold text-left rounded-xl bg-[#FFE2E2]">
              Die
            </p>
          )}
        </span>
      )
    },
    {
      key: 'proxy',
      name: 'proxy',
      sortable: true,
      resizable: true,
      width: 200
    }
  ]
}
