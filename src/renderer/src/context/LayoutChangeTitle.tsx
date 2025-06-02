import { configSidebar, configSidebarType } from '@renderer/config'
import { changeTitleDocmemt } from '@renderer/helper'
import { Driver, driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

const ChangeTitleContext = createContext({})

interface LayoutChangeTitleProps {
  children?: ReactNode
}

export interface ICurrentActiveSlidebar extends configSidebarType {
  activeIndex: number[]
}

interface IValueChangeTitle {
  currentSlidebar?: ICurrentActiveSlidebar
  tour?: Driver
  handleTour?: (stepIndex?: number) => void
  isDisableTour?: boolean
}

const LayoutChangeTitle: FC<LayoutChangeTitleProps> = ({ children }) => {
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const [tour, setTour] = useState<Driver>()
  const [currentSlidebar, setCurrentSlidebar] = useState<ICurrentActiveSlidebar>()
  const isDisableTour = useMemo(() => !currentSlidebar?.configTourSteps, [currentSlidebar])
  const newConfigTable = useMemo(() => {
    return configSidebar?.reduce((total, current, parentIndex) => {
      if (current?.isHeader) return total
      if (!current?.children) {
        total.push({
          ...current,
          activeIndex: [parentIndex]
        })
      } else {
        current?.children?.forEach((child, index) => {
          const newChild: ICurrentActiveSlidebar = {
            ...child,
            activeIndex: [parentIndex, index]
          }
          total.push(newChild)
        })
      }
      return total
    }, [] as ICurrentActiveSlidebar[])
  }, [])

  useEffect(() => {
    const currentActiveSlidebar = newConfigTable?.find((sidebar) => sidebar?.path === pathname)
    if (currentActiveSlidebar?.configTourSteps) {
      const driveTour = driver({
        showProgress: true,
        steps: currentActiveSlidebar?.configTourSteps,
        allowClose: false
      })
      if (!(pathname?.length === 1 && pathname.startsWith('/'))) {
        driveTour.drive()
      }
      setTour(driveTour)
    } else {
      setTour(undefined)
    }
    setCurrentSlidebar(currentActiveSlidebar)
    changeTitleDocmemt(t(currentActiveSlidebar?.title ?? ''))
    return (): void => {
      tour && tour.destroy()
    }
  }, [pathname])

  const handleTour = useCallback(
    (stepIndex?: number) => {
      if (!currentSlidebar?.configTourSteps) return
      tour && tour?.drive(stepIndex)
    },
    [currentSlidebar]
  )

  const values = useMemo((): IValueChangeTitle => {
    return {
      currentSlidebar,
      tour,
      handleTour,
      isDisableTour
    }
  }, [currentSlidebar, tour, isDisableTour])

  return <ChangeTitleContext.Provider value={values}>{children}</ChangeTitleContext.Provider>
}

export const useLayoutChangeTitle = (): IValueChangeTitle => {
  return useContext(ChangeTitleContext)
}

export default LayoutChangeTitle
