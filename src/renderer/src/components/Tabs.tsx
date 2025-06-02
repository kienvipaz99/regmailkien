import { cn } from '@renderer/helper'
import { TabConfig } from '@renderer/types'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface TabsProps {
  tabs: TabConfig[]
}

const Tabs = ({ tabs }: TabsProps): JSX.Element => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState(0)

  const handleTabClick = (id: number): void => {
    setActiveTab(id)
  }

  const Compoment = useMemo(() => {
    return tabs?.[activeTab]?.content
  }, [activeTab])

  return (
    <div>
      <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
        <ul
          className="flex flex-wrap -mb-px text-sm font-medium text-center"
          id="default-tab"
          role="tablist"
        >
          {tabs.map((tab, index) => {
            const isActive = activeTab === index

            return (
              <li key={tab.id} className="me-2" role="presentation">
                <button
                  className={cn(
                    'inline-block p-4 border-b-2 rounded-t-lg',
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300',
                    tab.disabled && 'cursor-not-allowed opacity-50'
                  )}
                  type="button"
                  role="tab"
                  aria-controls={tab.id}
                  aria-selected={isActive}
                  onClick={(): void => {
                    !tab.disabled && handleTabClick(index)
                  }}
                  disabled={tab.disabled}
                >
                  {t(`${tab.title}`)}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
      <div id="default-tab-content" className="custom_scroll">
        <div className={`p-4 rounded-lg bg-gray-50 dark:bg-gray-800`} role="tabpanel">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <strong className="font-medium text-gray-800 dark:text-white">
              {Compoment && <Compoment />}
            </strong>
          </div>
        </div>

        {/* {tabs.map((tab) => {
					const Compoment = tab.content as TabConfig['content']
					return (
						<div
							key={tab.id}
							className={`p-4 rounded-lg bg-gray-50 dark:bg-gray-800 ${
								activeTab === tab.id ? 'block' : 'hidden'
							}`}
							id={tab.id}
							role="tabpanel"
							aria-labelledby={`${tab.id}-tab`}
						>
							<div className="text-sm text-gray-500 dark:text-gray-400">
								<strong className="font-medium text-gray-800 dark:text-white">
									<Compoment formik={formik} />
								</strong>
							</div>
						</div>
					)
				})} */}
      </div>
    </div>
  )
}

export default Tabs
