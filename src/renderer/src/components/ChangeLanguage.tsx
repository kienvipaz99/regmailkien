import { Menu } from '@mantine/core'
import languageImage from '@renderer/assets/flags'
import { configStatic } from '@renderer/config/static'
import { useTranslation } from 'react-i18next'

const ChangeLanguage = (): JSX.Element => {
  const { i18n } = useTranslation()
  const keyLang = i18n.language.toLocaleUpperCase()

  return (
    <div className="dropdown shrink-0 text-sm">
      <Menu shadow="md">
        <Menu.Target>
          <img
            className="object-cover bg-[#E3E8EF] p-[5px] rounded-full cursor-pointer size-[33px]"
            src={`${languageImage[keyLang]}`}
            alt="flag"
          />
        </Menu.Target>

        <Menu.Dropdown>
          <ul className="text-dark grid grid-cols-1 gap-2 font-semibold dropdown_menu p-1 w-[150px]">
            {configStatic.languageList.map((item: { code: string; name: string }) => {
              const keyCode = item.code.toUpperCase() as keyof typeof languageImage
              return (
                <Menu.Item className="!p-0 !bg-transparent flex" component="li" key={item.code}>
                  <button
                    type="button"
                    className={`flex w-full gap-2 hover:text-primary rounded-lg select-none p-2 items-center ${
                      keyLang === keyCode ? 'bg-primary/10 text-primary' : 'hover:bg-primary/10'
                    }`}
                    onClick={(): void => {
                      i18n.changeLanguage(item.code)
                    }}
                  >
                    <img
                      src={`${languageImage[keyCode]}`}
                      alt="flag"
                      className="w-5 h-5 object-cover rounded-full"
                    />
                    <span className="ltr:ml-3 rtl:mr-3 text-sm">{item.name}</span>
                  </button>
                </Menu.Item>
              )
            })}
          </ul>
        </Menu.Dropdown>
      </Menu>
    </div>
  )
}

export default ChangeLanguage
