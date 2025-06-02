import { Image } from '@mantine/core'
import StaticImage from '@renderer/assets/images'
import { FC, PropsWithChildren } from 'react'

const LayoutAuthForm: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="w-[70%] 2xl:w-[68%] p-[30px] h-[90vh] rounded-[30px] right-50px relative items-center flex flex-col justify-center custom-shadow">
      <div className="mb-5">
        <Image
          src={StaticImage.logoLogin}
          alt="logo"
          classNames={{
            root: '!h-[150px]'
          }}
        />
      </div>
      {children}
    </div>
  )
}

export default LayoutAuthForm
