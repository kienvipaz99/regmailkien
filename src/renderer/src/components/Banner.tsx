import { Image } from '@mantine/core'
import StaticImage from '@renderer/assets/images'
import type { IModalDefault } from '@renderer/types'
import { Modal } from 'flowbite-react'
import { FC } from 'react'
import { IoIosCloseCircle } from 'react-icons/io'

interface BannerProps extends IModalDefault<unknown> {
  onClick?: () => void
}

const Banner: FC<BannerProps> = ({ isShow, setIsShow, onClick }) => {
  const handleClose = (): void => {
    onClick && onClick()
    setIsShow && setIsShow(false)
  }

  return (
    <Modal show={isShow} onClose={handleClose} size="6xl">
      <Modal.Body className="p-0 rounded-lg overflow-hidden shadow-3xl">
        <div className="">
          <Image className="object-center" src={StaticImage.BannerMKT} alt="BannerImg" />
        </div>
      </Modal.Body>
      <IoIosCloseCircle
        role="button"
        className="absolute right-0 h-6 w-6 text-white hover:opacity-90 transition-all duration-200"
        onClick={handleClose}
      />
    </Modal>
  )
}

export default Banner
