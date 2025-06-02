import { useLocalStorage } from '@mantine/hooks'
import { createContext, FC, PropsWithChildren, useCallback, useContext, useMemo } from 'react'

const slidebarContext = createContext({})

interface ValueConextValues {
  isSidebar?: boolean
  toggleSlidebar?: () => void
}

const LayoutSidebarProvider: FC<PropsWithChildren> = ({ children }) => {
  const [value, setValue] = useLocalStorage({
    key: 'slide',
    defaultValue: 'false'
  })

  const toggleSlidebar = useCallback((): void => {
    setValue(value === 'true' ? 'false' : 'true')
  }, [value])

  const values = useMemo((): ValueConextValues => {
    return {
      isSidebar: value === 'true',
      toggleSlidebar
    }
  }, [value, toggleSlidebar])

  return <slidebarContext.Provider value={values}>{children}</slidebarContext.Provider>
}

export const useLayoutSidebar = (): ValueConextValues => {
  return useContext(slidebarContext)
}

export default LayoutSidebarProvider
