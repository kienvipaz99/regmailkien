import {
  Dispatch,
  FC,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
export interface AccordionWapperProps {
  children: (obj: {
    refButton: MutableRefObject<HTMLDivElement | HTMLAnchorElement | null>
    refContent: MutableRefObject<HTMLDivElement | null>
    active?: boolean
    toggleAccordion?: () => void
    setUpdated?: Dispatch<SetStateAction<boolean>>
    setActive?: Dispatch<SetStateAction<boolean>>
  }) => JSX.Element
  customProgressOpen?: (element: HTMLDivElement | null | undefined) => void
  customFucOpenDone?: (element: HTMLDivElement | null) => void
  customFucCloseDone?: (element: HTMLDivElement | null) => void
  callBackUpdate?: (obj: {
    toggleAccordion: () => void
    active: boolean
    setActive: Dispatch<SetStateAction<boolean>>
    expandAccordion: () => void
    collapseAccordion: () => void
  }) => void
  isUpdate?: boolean
}

const AccordionWapper: FC<AccordionWapperProps> = ({
  children,
  customFucOpenDone,
  customFucCloseDone,
  customProgressOpen,
  callBackUpdate,
  isUpdate
}) => {
  const [active, setActive] = useState(false)
  const [updated, setUpdated] = useState(false)
  const accordionContentRef = useRef<HTMLDivElement | null>(null)
  const divActive = useRef<HTMLDivElement | HTMLAnchorElement | null>(null)

  const expandAccordion = useCallback(() => {
    if (accordionContentRef.current) {
      const element: HTMLDivElement = accordionContentRef.current

      element.style.transition = 'height .2s ease'
      const sectionHeight = 1 * element.scrollHeight
      element.style.height = `${sectionHeight}px`
      typeof customProgressOpen === 'function' && customProgressOpen(element)

      element.ontransitionend = (): void => {
        element.style.removeProperty('transition')
        typeof customFucOpenDone === 'function' && customFucOpenDone(element)
        element.onanimationend = null
      }
    }
  }, [])

  const collapseAccordion = useCallback(() => {
    if (accordionContentRef.current) {
      const element: HTMLDivElement = accordionContentRef.current

      element.style.transition = 'height .2s ease'
      element.style.height = `0px`

      element.ontransitionend = (): void => {
        element.style.removeProperty('transition')
        typeof customFucCloseDone === 'function' && customFucCloseDone(element)
        element.onanimationend = null
      }
    }
  }, [])

  const updateUi = useCallback(
    (isOpen: boolean) => {
      if (isOpen) {
        expandAccordion()
      } else {
        collapseAccordion()
      }
    },
    [expandAccordion, collapseAccordion]
  )

  const toggleAccordion = useCallback(() => {
    const expanded = !active

    updateUi(expanded)
    setActive(expanded)
  }, [active, updateUi])

  useEffect(() => {
    if (typeof callBackUpdate === 'function') {
      callBackUpdate({
        toggleAccordion,
        active,
        collapseAccordion,
        expandAccordion,
        setActive
      })
    }
  }, [isUpdate, updated])

  return (
    <>
      {children({
        refButton: divActive,
        active,
        toggleAccordion,
        refContent: accordionContentRef,
        setUpdated: setUpdated,
        setActive
      })}
    </>
  )
}

export default AccordionWapper
