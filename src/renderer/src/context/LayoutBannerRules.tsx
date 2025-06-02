import { keyBanner, keyRules, setLocalStore } from '@renderer/helper'
import { FC, ReactNode, createContext, useCallback, useContext, useMemo, useState } from 'react'

const BannerRulesContext = createContext({})

interface LayoutBannerRulesProps {
  children?: ReactNode
}

interface IValuesBannerRuler {
  handleShowTerm?: () => void
  handleCheckShowBannerOrRules?: () => void
}

const LayoutBannerRules: FC<LayoutBannerRulesProps> = ({ children }) => {
  const [isShow, setIsShow] = useState(false)
  const [isRules, setIsRules] = useState(false)

  const handleShowBanner = useCallback((value: string): void => {
    setIsShow(value === '1')
    sessionStorage.setItem(keyBanner, value)
  }, [])

  const handleShowTerm = useCallback((): void => {
    setIsRules(true)
    setLocalStore(keyRules, '1')
  }, [])

  const handleCheckShowBannerOrRules = (): void => {
    const valueRules = localStorage.getItem(keyRules)
    if (['0', null].includes(valueRules)) {
      handleShowTerm()
      handleShowBanner('1')
    }
    return
  }

  const values: IValuesBannerRuler = useMemo(() => {
    return { handleShowTerm, handleCheckShowBannerOrRules }
  }, [handleShowTerm, handleCheckShowBannerOrRules])

  return (
    <BannerRulesContext.Provider value={values}>
      {/* {isShow && (
        <Banner isShow={isShow} setIsShow={setIsShow} onClick={(): void => handleShowBanner('0')} />
      )} */}

      {/* {isRules && <ModalTerm isShow={isRules} setIsShow={setIsRules} />} */}

      {children}
    </BannerRulesContext.Provider>
  )
}

export const useLayoutBannerRules = (): IValuesBannerRuler => useContext(BannerRulesContext)

export default LayoutBannerRules
