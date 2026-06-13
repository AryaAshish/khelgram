import { useState } from 'react'

export type GetInvolvedTab = 'parents' | 'schools' | 'partners' | 'volunteers'

const tabs: Array<{ id: GetInvolvedTab; label: string; targetId: string }> = [
  { id: 'parents', label: 'Parents', targetId: 'get-involved' },
  { id: 'schools', label: 'Schools', targetId: 'get-involved' },
  { id: 'partners', label: 'Partners', targetId: 'partner-inquiry' },
  { id: 'volunteers', label: 'Volunteers', targetId: 'volunteer-signup' },
]

export type GetInvolvedTabsProps = {
  initialTab?: GetInvolvedTab
}

export function GetInvolvedTabs({ initialTab = 'parents' }: GetInvolvedTabsProps) {
  const [activeTab, setActiveTab] = useState<GetInvolvedTab>(initialTab)

  const handleSelect = (tab: (typeof tabs)[number]) => {
    setActiveTab(tab.id)
    const element = document.getElementById(tab.targetId)
    if (element && typeof element.scrollIntoView === 'function') {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="get-involved-tabs" role="tablist" aria-label="Stakeholder paths">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.id}
          className={`get-involved-tabs__item ${activeTab === tab.id ? 'get-involved-tabs__item--active' : ''}`}
          onClick={() => handleSelect(tab)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
