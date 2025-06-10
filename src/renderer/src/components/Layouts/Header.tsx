import { Menu } from '@mantine/core'
import { registerEventListeners, removeEventListeners, type IUser } from '@preload/types'
import { useLayoutChangeTitle } from '@renderer/context'
import { cn } from '@renderer/helper'
import useCustomFormik from '@renderer/hook/useCustomFormik'
import {
  queriesToInvalidate,
  queryKeys,
  useReadSettingProxy,
  useUpdateSettingBy
} from '@renderer/services'
import { useReadProxyRotateByParams } from '@renderer/services/proxy'
import { isEmpty } from 'lodash'
import { CirclePlay } from 'lucide-react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { IoIosNotificationsOutline } from 'react-icons/io'
import { useLoaderData } from 'react-router-dom'
import { toast } from 'react-toastify'
import ChangeLanguage from '../ChangeLanguage'
import { SwitchField } from '../CustomFormField'
import ToolTips from '../Default/Tooltips'
import GroupAvatarDetail from '../GroupAvatarDetail'
import ButtonActionSetting from '../Setting/ButtonActionSetting'
import ButtonHeaderWapper from './ButtonHeaderWapper'

const Header = (): JSX.Element => {
  // const { handleShowTerm } = useLayoutBannerRules()
  const { handleTour, isDisableTour } = useLayoutChangeTitle()
  const user = useLoaderData() as IUser
  const { t } = useTranslation()
  const { data: dataSetting } = useReadSettingProxy()
  const { mutate: updateSettings } = useUpdateSettingBy('setting_proxy')
  // const { data: proxyData } = useReadProxyRotateByParams({
  //   ...configSearch,
  //   proxyType: ['v4_rotate', 'v6_rotate', 'key_proxy']
  // })

  // const handleProxyChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
  //   if (isEmpty(proxyData?.data)) {
  //     toast.error('Không có proxy khả dụng để sử dụng!')
  //     return
  //   }
  //   updateSettings({
  //     key: 'setting_proxy',
  //     value: {
  //       ...dataSetting,
  //       selected_proxy: e.target.checked ? 'proxy_rotating' : 'no_selected'
  //     }
  //   })
  // }

  useEffect(() => {
    registerEventListeners('wait_check_browser', () => {
      toast.success(`Đang kiểm tra chrome`)
      queriesToInvalidate([queryKeys.action.readStatusDownload])
    })

    registerEventListeners('check_browser_success', () => {
      toast.success(`Kiểm tra chrome thành công`)
      queriesToInvalidate([queryKeys.action.readStatusDownload])
    })

    registerEventListeners('download_chrome_progress', (_, progress: number) => {
      if (progress <= 0) {
        toast.error('Tải Chrome thất bại')
      } else if (progress >= 100) {
        toast.success('Tải xuống hoàn tất. Đang giải nén...')
      }
      // setProgress(progress)
    })

    return removeEventListeners([
      'wait_check_browser',
      'check_browser_success',
      'download_chrome_progress'
    ])
  }, [])
  const { configSearch } = useCustomFormik({ ACTION_TYPE: 'base_action', defaultValues: {} })
  const { data: proxyData } = useReadProxyRotateByParams({
    ...configSearch,
    proxyType: ['v4_rotate', 'v6_rotate', 'key_proxy']
  })
  const handleProxyChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (isEmpty(proxyData?.data)) {
      toast.error('Không có proxy khả dụng để sử dụng!')
      return
    }

    updateSettings({
      key: 'setting_proxy',
      value: {
        ...dataSetting,
        selected_proxy: e.target.checked ? 'proxy_rotating' : 'no_selected'
      }
    })
  }
  return (
    <header>
      <div className="shadow-sm">
        <div className="relative bg-white flex w-full items-center p-2">
          <div className="sm:flex-1 ltr:sm:ml-0 ltr:ml-auto sm:rtl:mr-0 rtl:mr-auto flex items-center space-x-1.5 justify-end lg:space-x-2 rtl:space-x-reverse dark:text-[#d0d2d6] gap-[5px]">
            <ToolTips content={t('start_proxy')}>
              <SwitchField
                name="action-proxy"
                label={t(
                  dataSetting?.selected_proxy === 'proxy_rotating'
                    ? 'proxy_enabled'
                    : 'proxy_disabled'
                )}
                labelPosition="left"
                classCheckBox={`cursor-pointer ${proxyData?.data && proxyData.data.length > 0 ? '' : ''} `}
                onChange={handleProxyChange}
                checked={dataSetting?.selected_proxy === 'proxy_rotating'}
              />
            </ToolTips>
            <ChangeLanguage />
            <ButtonHeaderWapper content={t('general_management.notification')}>
              <IoIosNotificationsOutline size={25} className="hover:text-primary" />
            </ButtonHeaderWapper>
            <ButtonHeaderWapper
              className={cn(isDisableTour && '!cursor-default text-gray-400')}
              tooltips={{
                disabled: isDisableTour
              }}
              content={t('general_management.user_manual')}
              onClick={() => handleTour && handleTour()}
            >
              <CirclePlay size={25} className={cn(!isDisableTour && 'hover:text-primary')} />
            </ButtonHeaderWapper>

            {/* <ButtonSetting /> */}
            <ButtonActionSetting />

            <div className="dropdown shrink-0 flex border-l-2 pl-2">
              <Menu shadow="md" width={250}>
                <Menu.Target>
                  <div>
                    <GroupAvatarDetail
                      group={{
                        wrap: 'nowrap'
                      }}
                      title={user?.fullName ?? 'Admin'}
                      desc={user?.email ?? 'admin@phanmemmkt.vn'}
                      img={typeof user?.avatar === 'string' ? user.avatar : undefined}
                    />
                  </div>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>
                    <GroupAvatarDetail
                      title={user?.fullName ?? 'Admin'}
                      desc={user?.email ?? 'admin@phanmemmkt.vn'}
                      img={typeof user?.avatar === 'string' ? user.avatar : undefined}
                    />
                  </Menu.Label>
                  {/* <Menu.Item onClick={handleShowTerm}>{t('clause')}</Menu.Item> */}
                  {/* <Menu.Item onClick={() => logout()} color="red">
                    {t('sign_out')}
                  </Menu.Item> */}
                </Menu.Dropdown>
              </Menu>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
