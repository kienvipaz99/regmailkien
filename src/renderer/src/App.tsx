import { PropsWithChildren, useEffect } from 'react'
import { useLayoutSidebar } from './context'
import LayoutChangeTitle from './context/LayoutChangeTitle'
import { cn } from './helper'

function App({ children }: PropsWithChildren): JSX.Element {
  const { isSidebar } = useLayoutSidebar()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light')
  }, [])

  useEffect(() => {
    // Thêm event onbeforeunload
    const handleBeforeUnload = (): void => {
      localStorage.removeItem('rules')
      localStorage.removeItem('tour')
    }
    window.addEventListener('beforeunload', handleBeforeUnload)

    // Cleanup function
    return (): void => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  return (
    <LayoutChangeTitle>
      <div
        className={cn(
          'main-section antialiased border-t relative font-googleSans text-sm font-normal ltr full vertical',
          isSidebar && 'toggle-sidebar'
        )}
      >
        {children}
      </div>
    </LayoutChangeTitle>
  )
}

export default App
