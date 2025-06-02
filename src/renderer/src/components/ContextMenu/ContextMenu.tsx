import { FC, ReactNode, useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import './ContextMenu.css'

export interface ContextMenuProps {
  selector: string
  children?: ReactNode
  zIndex?: number
}

const ContextMenu: FC<ContextMenuProps> = ({ selector, children, zIndex = 40 }): JSX.Element => {
  const menuRef = useRef<HTMLDivElement>(null)

  const closeMenu = useCallback((): void => {
    const contextMenuElem = menuRef.current
    const elementParent = document.querySelector(selector) as HTMLDivElement
    if (contextMenuElem && contextMenuElem.classList.contains('shadow-menu')) {
      contextMenuElem.classList.remove('shadow-menu')
      contextMenuElem.style.opacity = '0'
      contextMenuElem.style.visibility = 'hidden'
    }
    if (elementParent) {
      elementParent.style.removeProperty('overflow')
    }
  }, [menuRef.current])

  useEffect(() => {
    const elementParent = document.querySelector(selector) as HTMLDivElement
    if (elementParent) {
      const clickMenu = (e: MouseEvent): void => {
        const contextMenuElem = menuRef.current
        if (contextMenuElem) {
          contextMenuElem.style.opacity = '1'
          contextMenuElem.style.visibility = 'visible'
          const { width: widthContextMenu, height: heightContextMenu } =
            contextMenuElem.getBoundingClientRect()

          elementParent.style.overflow = 'hidden'

          const maxWidth = window.innerWidth
          const maxHeight = window.innerHeight
          const remainingLeft = maxWidth - e.clientX

          const isLeft = remainingLeft >= widthContextMenu

          const showTop = heightContextMenu + e.clientY <= maxHeight
          const showBottom = e.clientY - heightContextMenu >= 0

          const isCenter = !(showTop || showBottom)

          isCenter

          const styleOrigin = {
            x: 'left',
            y: 'top'
          }

          if (isLeft) {
            contextMenuElem.style.left = `${e.clientX}px`
            styleOrigin.x = 'left'
          } else {
            contextMenuElem.style.left = `${e.clientX - widthContextMenu}px`
            styleOrigin.x = 'right'
          }

          if (showTop) {
            contextMenuElem.style.top = `${e.clientY}px`
            styleOrigin.y = 'top'
          } else if (showBottom) {
            contextMenuElem.style.top = `${e.clientY - heightContextMenu}px`
            styleOrigin.y = 'bottom'
          } else {
            const HalfHeight = heightContextMenu / 2
            const calculatorTop = HalfHeight + e.clientY
            const showTopCenter = calculatorTop <= maxHeight
            const calculatorBottom = e.clientY - HalfHeight
            const showBottom = calculatorBottom >= 0
            let topNew = calculatorBottom
            if (!showBottom && showTopCenter) {
              topNew = topNew - calculatorBottom
            } else if (!showTopCenter && showBottom) {
              const ts = calculatorTop - maxHeight
              topNew = topNew - ts
            }
            contextMenuElem.style.top = `${topNew}px`
            styleOrigin.y = 'center'
          }

          contextMenuElem.style.transformOrigin = `${styleOrigin.y} ${styleOrigin.x}`

          if (!contextMenuElem.classList.contains('shadow-menu')) {
            contextMenuElem.classList.add('shadow-menu')
          }
        }
      }

      elementParent.addEventListener('contextmenu', clickMenu)
      window.addEventListener('click', closeMenu)
      return (): void => {
        elementParent.removeEventListener('contextmenu', clickMenu)
        window.removeEventListener('click', closeMenu)
      }
    }

    return (): void => {}
  }, [])

  return createPortal(
    <div
      className="fixed z-40 w-fit"
      ref={menuRef}
      style={{ opacity: 0, visibility: 'hidden', zIndex: zIndex }}
    >
      {children}
    </div>,
    document.body
  )
}

export default ContextMenu
