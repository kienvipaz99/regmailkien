import { configContextMenuType } from '@renderer/components/ContextMenu/RenderContextMenu'
import { IButtonContext } from '@renderer/types'
import { TFunction } from 'i18next'
import { isEmpty } from 'lodash'

import { AiOutlineExport } from 'react-icons/ai'
import { BiSolidPaste } from 'react-icons/bi'
import { FaCopy } from 'react-icons/fa'
import { FaDisplay } from 'react-icons/fa6'

import { FiChrome } from 'react-icons/fi'
import { HiMail } from 'react-icons/hi'
import { HiOutlineMinusSmall } from 'react-icons/hi2'
import { IoMdRemoveCircleOutline } from 'react-icons/io'
import { MdContentCopy } from 'react-icons/md'
import { PiEraser } from 'react-icons/pi'
import {
  RiEdit2Line,
  RiExchangeBoxLine,
  RiFileUploadFill,
  RiFolderTransferFill
} from 'react-icons/ri'
import { RxAvatar } from 'react-icons/rx'
import { TbLiveView, TbServerBolt } from 'react-icons/tb'
import { VscExtensions } from 'react-icons/vsc'

import { toast } from 'react-toastify'

export function checkSelection(
  valueSelected: string[],
  t?: TFunction<'translation', undefined>,
  keyTranslate?: string,
  warnings?: { multiple: boolean }
): boolean {
  if (isEmpty(valueSelected)) {
    toast.warn(t && t(keyTranslate ?? 'notifications.no_account_selected'))
    return false
  } else if (valueSelected.length > 1 && warnings?.multiple) {
    toast.warn(t && t('notifications.please_choose_one'))
    return false
  }
  return true
}

export const configMenuActionAccount = (
  show_avatar: boolean = false,
  payloadPending?: IButtonContext
): configContextMenuType[] => {
  return [
    // {
    //   Icon: BadgeCheck,
    //   action: 'config_menu.check_live_or_die',
    //   onClick: async (valueSelected, { t, checkLiveOrDie }): Promise<void> => {
    //     if (checkSelection(valueSelected, t)) {
    //       checkLiveOrDie &&
    //         checkLiveOrDie(valueSelected, {
    //           onSettled: (result) => {
    //             if (result?.status === 'success') {
    //               queriesToInvalidate([queryKeys.account.readAllByParams])
    //             }
    //           }
    //         })
    //     }
    //   }
    // },

    {
      Icon: RiFileUploadFill,
      action: 'config_menu.update_info_account',
      onClick: async (valueSelected, { setIsShowEdit, t }): Promise<void> => {
        if (checkSelection(valueSelected, t, undefined, { multiple: true })) {
          setIsShowEdit && setIsShowEdit(true)
        }
      }
    },

    {
      Icon: RiFolderTransferFill,
      action: 'config_menu.change_category',
      onClick: async (valueSelected, { setIsChangeCate, t }): Promise<void> => {
        if (checkSelection(valueSelected, t)) {
          setIsChangeCate && setIsChangeCate(true)
        }
      }
    },

    // {
    //   Icon: TfiFacebook,
    //   action: 'config_menu.login_facebook',
    //   children: [
    //     ...(payloadPending?.isWork
    //       ? [
    //           {
    //             Icon: HiOutlineMinusSmall,
    //             action: 'config_menu.stop_login_browser',
    //             onClick: async (listUidSelect, { t, startAction }): Promise<void> => {
    //               if (checkSelection(listUidSelect, t)) {
    //                 startAction && startAction({ actionName: 'close_chrome', data: [] })
    //               }
    //             }
    //           } as configContextMenuType
    //         ]
    //       : [
    //           {
    //             Icon: HiOutlineMinusSmall,
    //             action: 'config_menu.login_browser',
    //             onClick: async (listUidSelect, { t, startAction, setAction }): Promise<void> => {
    //               if (checkSelection(listUidSelect, t)) {
    //                 setAction && setAction('login_facebook')
    //                 startAction &&
    //                   startAction({ actionName: 'login_facebook', data: listUidSelect })
    //               }
    //             }
    //           } as configContextMenuType
    //         ])

    // ...(isWork
    //   ? [
    //       {
    //         Icon: HiOutlineMinusSmall,
    //         action: 'Dừng đăng nhập ẩn',
    //       } as configContextMenuType
    //     ]
    //   : [
    //       {
    //         Icon: HiOutlineMinusSmall,
    //         action: 'Đăng nhập ẩn'
    //       } as configContextMenuType
    //     ])
    //   ]
    // },

    // ...(payloadPending?.isWork
    //   ? [
    //       {
    //         Icon: HiMail,
    //         action: 'config_menu.stop_login_mail'
    //       } as configContextMenuType
    //     ]
    //   : [
    //       {
    //         Icon: HiMail,
    //         action: 'config_menu.login_mail',
    //         onClick: async (listUidSelect, { t, startAction, setAction }): Promise<void> => {
    //           if (checkSelection(listUidSelect, t)) {
    //             setAction && setAction('login_mail')
    //             startAction && startAction({ actionName: 'login_mail', data: listUidSelect })
    //           }
    //         }
    //       } as configContextMenuType
    //     ]),

    ...(payloadPending?.isWork
      ? [
          {
            Icon: HiMail,
            action: 'config_menu.close_chrome'
          } as configContextMenuType
        ]
      : [
          {
            Icon: FiChrome,
            action: 'config_menu.open_chrome',
            onClick: async (listUidSelect, { t, startAction, setAction }): Promise<void> => {
              if (checkSelection(listUidSelect, t)) {
                setAction && setAction('open_chrome')
                startAction && startAction({ actionName: 'open_chrome', data: listUidSelect })
              }
            }
          } as configContextMenuType
        ]),

    ...(show_avatar
      ? [
          {
            Icon: RxAvatar,
            action: 'config_menu.hidden_avatar',
            onClick: async (_, { updateSettings }): Promise<void> => {
              updateSettings &&
                updateSettings({
                  key: 'setting_system',
                  value: { show_avatar: !show_avatar }
                })
            }
          } as configContextMenuType
        ]
      : [
          {
            Icon: RxAvatar,
            action: 'config_menu.get_avatar',
            onClick: async (_, { updateSettings }): Promise<void> => {
              updateSettings &&
                updateSettings({
                  key: 'setting_system',
                  value: { show_avatar: !show_avatar }
                })
            }
          } as configContextMenuType
        ]),

    {
      Icon: TbServerBolt,
      action: 'config_menu.proxy_static',
      children: [
        {
          Icon: HiOutlineMinusSmall,
          action: 'config_menu.pase_proxy',
          children: [
            {
              Icon: HiOutlineMinusSmall,
              action: 'config_menu.paste_proxy_format',
              onClick: async (valueSelected, { t, updateByClipboard }): Promise<void> => {
                if (checkSelection(valueSelected, t)) {
                  updateByClipboard &&
                    updateByClipboard({ value: valueSelected, key: 'proxy', select: 'proxy' })
                }
              }
            },
            {
              Icon: HiOutlineMinusSmall,
              action: 'config_menu.paste_proxy',
              onClick: async (valueSelected, { t, updateByClipboard }): Promise<void> => {
                if (checkSelection(valueSelected, t)) {
                  updateByClipboard &&
                    updateByClipboard({ value: valueSelected, key: 'uid', select: 'proxy' })
                }
              }
            }
          ]
        },
        {
          Icon: HiOutlineMinusSmall,
          action: 'config_menu.remove_proxy',
          children: [
            {
              Icon: HiOutlineMinusSmall,
              action: 'config_menu.remove_proxy_profile',
              onClick: async (valueSelected, { t, removeFieldBy, actionBy }): Promise<void> => {
                if (checkSelection(valueSelected, t)) {
                  if (actionBy && removeFieldBy) {
                    removeFieldBy(
                      { key: 'uid', value: ['proxy'], select: valueSelected },
                      {
                        onSettled: () => {
                          actionBy({ key: 'uid', value: 'remove_profile', select: valueSelected })
                        }
                      }
                    )
                  }
                }
              }
            }
          ]
        }
      ]
    },

    {
      Icon: FaCopy,
      action: 'config_menu.copy',
      children: [
        {
          Icon: HiOutlineMinusSmall,
          action: 'config_menu.copy_custom',
          onClick: async (valueSelected, { setIsCopy, t }): Promise<void> => {
            if (checkSelection(valueSelected, t)) {
              setIsCopy && setIsCopy(true)
            }
          }
        },
        {
          Icon: HiOutlineMinusSmall,
          action: `account_key.uid`,
          onClick: async (valueSelected, { t, copyByField }): Promise<void> => {
            if (checkSelection(valueSelected, t)) {
              copyByField && copyByField({ key: 'uid', value: 'uid', select: valueSelected })
            }
          }
        },
        {
          Icon: HiOutlineMinusSmall,
          action: `account_key.password`,
          onClick: async (valueSelected, { t, copyByField }): Promise<void> => {
            if (checkSelection(valueSelected, t)) {
              copyByField && copyByField({ key: 'uid', value: 'password', select: valueSelected })
            }
          }
        },
        {
          Icon: HiOutlineMinusSmall,
          action: `account_key.cookie`,
          onClick: async (valueSelected, { t, copyByField }): Promise<void> => {
            if (checkSelection(valueSelected, t)) {
              copyByField && copyByField({ key: 'uid', value: 'cookie', select: valueSelected })
            }
          }
        },
        {
          Icon: HiOutlineMinusSmall,
          action: `account_key.token`,
          onClick: async (valueSelected, { t, copyByField }): Promise<void> => {
            if (checkSelection(valueSelected, t)) {
              copyByField && copyByField({ key: 'uid', value: 'token', select: valueSelected })
            }
          }
        },
        {
          Icon: HiOutlineMinusSmall,
          action: `account_key.email`,
          onClick: async (valueSelected, { t, copyByField }): Promise<void> => {
            if (checkSelection(valueSelected, t)) {
              copyByField && copyByField({ key: 'uid', value: 'email', select: valueSelected })
            }
          }
        },

        {
          Icon: HiOutlineMinusSmall,
          action: 'config_menu.uid|password|_2fa',
          onClick: async (valueSelected, { t, copyByField }): Promise<void> => {
            if (checkSelection(valueSelected, t)) {
              copyByField &&
                copyByField({ key: 'uid', value: 'uid|password|_2fa', select: valueSelected })
            }
          }
        },
        {
          Icon: HiOutlineMinusSmall,
          action: 'config_menu.email|pass_email',
          onClick: async (valueSelected, { t, copyByField }): Promise<void> => {
            if (checkSelection(valueSelected, t)) {
              copyByField &&
                copyByField({ key: 'uid', value: 'email|pass_email', select: valueSelected })
            }
          }
        }
      ]
    },

    {
      Icon: BiSolidPaste,
      action: 'config_menu.paste',
      children: [
        {
          Icon: HiOutlineMinusSmall,
          action: 'config_menu.paste_mail_recover_sequentially',
          onClick: async (valueSelected, { t, updateByClipboard }): Promise<void> => {
            if (checkSelection(valueSelected, t)) {
              updateByClipboard &&
                updateByClipboard({ key: 'uid', value: valueSelected, select: 'recovery_email' })
            }
          }
        },
        {
          Icon: HiOutlineMinusSmall,
          action: 'config_menu.paste_mail_recover_by_id',
          onClick: async (valueSelected, { t, updateByClipboard }): Promise<void> => {
            if (checkSelection(valueSelected, t)) {
              updateByClipboard &&
                updateByClipboard({
                  key: 'recovery_email',
                  value: valueSelected,
                  select: 'recovery_email'
                })
            }
          }
        },
        {
          Icon: HiOutlineMinusSmall,
          action: 'config_menu.paste_useragent_turn',
          onClick: async (valueSelected, { t, updateByClipboard }): Promise<void> => {
            if (checkSelection(valueSelected, t)) {
              updateByClipboard &&
                updateByClipboard({
                  key: 'uid',
                  value: valueSelected,
                  select: 'user_agent'
                })
            }
          }
        },
        {
          Icon: HiOutlineMinusSmall,
          action: 'config_menu.paste_useragent_format',
          onClick: async (valueSelected, { t, updateByClipboard }): Promise<void> => {
            if (checkSelection(valueSelected, t)) {
              updateByClipboard &&
                updateByClipboard({
                  key: 'user_agent',
                  value: valueSelected,
                  select: 'user_agent'
                })
            }
          }
        }
      ]
    },

    {
      Icon: PiEraser,
      action: 'config_menu.remove',
      children: [
        {
          Icon: HiOutlineMinusSmall,
          action: 'config_menu.remove_account_trash',
          onClick: async (valueSelected, { t, updateAccountByField }): Promise<void> => {
            if (checkSelection(valueSelected, t)) {
              updateAccountByField &&
                updateAccountByField({
                  key: 'uid',
                  select: valueSelected,
                  value: { is_show: false }
                })
            }
          }
        },
        {
          Icon: HiOutlineMinusSmall,
          action: 'config_menu.remove_cookie',
          onClick: async (valueSelected, { t, updateAccountByField }): Promise<void> => {
            if (checkSelection(valueSelected, t)) {
              updateAccountByField &&
                updateAccountByField({ key: 'uid', select: valueSelected, value: { cookie: null } })
            }
          }
        },
        {
          Icon: HiOutlineMinusSmall,
          action: 'config_menu.remove_token',
          onClick: async (valueSelected, { t, updateAccountByField }): Promise<void> => {
            if (checkSelection(valueSelected, t)) {
              updateAccountByField &&
                updateAccountByField({ key: 'uid', select: valueSelected, value: { token: null } })
            }
          }
        },
        {
          Icon: HiOutlineMinusSmall,
          action: 'config_menu.remove_useagent',
          onClick: async (valueSelected, { t, updateAccountByField }): Promise<void> => {
            if (checkSelection(valueSelected, t)) {
              updateAccountByField &&
                updateAccountByField({
                  key: 'uid',
                  select: valueSelected,
                  value: { user_agent: null }
                })
            }
          }
        },
        {
          Icon: HiOutlineMinusSmall,
          action: 'config_menu.remove_recovery_mail',
          onClick: async (valueSelected, { t, updateAccountByField }): Promise<void> => {
            if (checkSelection(valueSelected, t)) {
              updateAccountByField &&
                updateAccountByField({
                  key: 'uid',
                  select: valueSelected,
                  value: { recovery_email: null }
                })
            }
          }
        }
      ]
    },

    {
      Icon: VscExtensions,
      action: 'config_menu.utilities',
      children: [
        {
          Icon: HiOutlineMinusSmall,
          action: 'config_menu.check_profile',
          onClick: async (valueSelected, { t, actionBy }): Promise<void> => {
            if (isEmpty(valueSelected)) {
              toast.warn(t && t('notifications.no_account_selected'))
              return
            }
            actionBy &&
              actionBy({ key: 'uid', value: 'check_exits_profile', select: valueSelected })
          }
        },
        {
          Icon: HiOutlineMinusSmall,
          action: 'Backup Profile',
          onClick: async (valueSelected, { t, setIsBackup }): Promise<void> => {
            if (isEmpty(valueSelected)) {
              toast.warn(t && t('notifications.no_account_selected'))
              return
            }
            setIsBackup && setIsBackup(true)
          }
        },
        {
          Icon: HiOutlineMinusSmall,
          action: 'config_menu.remove_profile',
          onClick: async (valueSelected, { t, actionBy }): Promise<void> => {
            if (isEmpty(valueSelected)) {
              toast.warn(t && t('notifications.no_account_selected'))
              return
            }
            actionBy && actionBy({ key: 'uid', value: 'remove_profile', select: valueSelected })
          }
        },
        {
          Icon: HiOutlineMinusSmall,
          action: 'config_menu.remove_cache',
          onClick: async (valueSelected, { t, actionBy }): Promise<void> => {
            if (isEmpty(valueSelected)) {
              toast.warn(t && t('notifications.no_account_selected'))
              return
            }
            actionBy && actionBy({ key: 'uid', value: 'remove_cache', select: valueSelected })
          }
        }
      ]
    },

    // {
    //   Icon: GiToken,
    //   action: 'Get Token',
    //   children: [
    // {
    //   Icon: HiOutlineMinusSmall,
    //   action: 'Get Token từ Cookie',
    //   children: [
    //     {
    //       Icon: HiOutlineMinusSmall,
    //       action: 'Facebook for android',
    //       onClick: async (valueSelected, { t, getTokenFacebookBy }): Promise<void> => {
    //         if (checkSelection(valueSelected, t)) {
    //           getTokenFacebookBy &&
    //             getTokenFacebookBy({
    //               key: 'uid',
    //               value: valueSelected,
    //               select: 'cookie_android'
    //             })
    //         }
    //       }
    //     },
    //     {
    //       Icon: HiOutlineMinusSmall,
    //       action: 'Facebook for Lite',
    //       onClick: async (valueSelected, { t, getTokenFacebookBy }): Promise<void> => {
    //         if (checkSelection(valueSelected, t)) {
    //           getTokenFacebookBy &&
    //             getTokenFacebookBy({
    //               key: 'uid',
    //               value: valueSelected,
    //               select: 'cookie_fb_lite'
    //             })
    //         }
    //       }
    //     },
    //     {
    //       Icon: HiOutlineMinusSmall,
    //       action: 'Facebook messenger for android',
    //       onClick: async (valueSelected, { t, getTokenFacebookBy }): Promise<void> => {
    //         if (checkSelection(valueSelected, t)) {
    //           getTokenFacebookBy &&
    //             getTokenFacebookBy({
    //               key: 'uid',
    //               value: valueSelected,
    //               select: 'cookie_messenger_android'
    //             })
    //         }
    //       }
    //     }
    //   ]
    // },
    // {
    //   Icon: HiOutlineMinusSmall,
    //   action: 'Get token EAAG',
    //   onClick: async (valueSelected, { t, getTokenFacebookBy }): Promise<void> => {
    //     if (checkSelection(valueSelected, t)) {
    //       getTokenFacebookBy &&
    //         getTokenFacebookBy({ key: 'uid', value: valueSelected, select: 'eagg' })
    //     }
    //   }
    // }
    //   ]
    // },

    {
      Icon: FaCopy,
      action: 'config_menu.copy_2fa_code',
      onClick: async (valueSelected, { t, copy2faCode }): Promise<void> => {
        if (checkSelection(valueSelected, t)) {
          copy2faCode && copy2faCode({ key: 'uid', select: valueSelected })
        }
      }
    }
  ]
}

export const configContextMenuContentManagement = (): configContextMenuType[] => {
  return [
    {
      action: 'config_menu.edit_post',
      Icon: RiEdit2Line,
      onClick: async (valueSelected, { setIsOpenEditContent, t }): Promise<void> => {
        if (checkSelection(valueSelected, t, undefined, { multiple: true })) {
          setIsOpenEditContent && setIsOpenEditContent(true)
        }
      }
    },

    {
      action: 'config_menu.remove_post',
      Icon: IoMdRemoveCircleOutline,
      onClick: (valueSelected, { t, removePostByField }): void => {
        if (checkSelection(valueSelected, t)) {
          removePostByField && removePostByField({ key: 'uuid', select: valueSelected })
        }
      }
    },

    {
      action: 'config_menu.change_category',
      Icon: RiExchangeBoxLine,
      onClick: async (valueSelected, { setIsChangeCate, t }): Promise<void> => {
        if (checkSelection(valueSelected, t)) {
          setIsChangeCate && setIsChangeCate(true)
        }
      }
    }
  ]
}

export const configMenuSeeding = (): configContextMenuType[] => {
  return [
    {
      action: 'config_menu.show_live_account',
      Icon: FaDisplay
    },
    {
      action: 'config_menu.export_all_link_success',
      Icon: AiOutlineExport
    }
  ]
}

export const configMenuActionProxy = (): configContextMenuType[] => {
  return [
    // {
    //   action: 'select_all',
    //   Icon: FaRegCheckSquare
    // },
    {
      action: 'show_proxy_live',
      Icon: TbLiveView
      // onClick: (_, { setConfigSearch }): void => {
      //   setConfigSearch &&
      //     setConfigSearch((prevState) => ({
      //       ...prevState,
      //       filterType: 'live'
      //     }))
      // }
    },
    {
      action: 'coppy_proxy',
      Icon: MdContentCopy
      // onClick: async (valueSelected, { t, useCopyProxyByField }): Promise<void> => {
      //   if (checkSelection(valueSelected, t)) {
      //     useCopyProxyByField &&
      //       useCopyProxyByField([{ key: 'id', value: 'id', select: valueSelected }])
      //   }
      // }
    },
    {
      action: 'remove_proxy',
      Icon: IoMdRemoveCircleOutline
      // onClick: async (valueSelected, { t, deleteProxy }): Promise<void> => {
      //   if (checkSelection(valueSelected, t, undefined, { multiple: false })) {
      //     deleteProxy &&
      //       deleteProxy({
      //         ids: valueSelected
      //       })
      //   }
      // }
    }
  ]
}
