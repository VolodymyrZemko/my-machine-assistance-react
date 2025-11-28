import React, { useState, useMemo, useEffect, useRef } from 'react';
import './App.css';
import machines from './data/machines.json';
import { useMachineRoute } from './modules/routing/useMachineRoute.js';
import { MachineDetail } from './components/machines/MachineDetail.jsx';
import { Footer } from './components/layout/Footer.jsx';
import { Search } from './components/search/Search.jsx';
import { MyMachineSection } from './components/myMachine/MyMachineSection.jsx';
import { useTranslation } from './translations/translations.js';
import * as GTMTracking from './utils/gtmTracking.js';
import { useInView } from 'react-intersection-observer';

// Tab icon components
const TabIcon = ({ icon }) => {
  return <nb-icon icon={icon} aria-hidden="true"></nb-icon>;
};

const TECH_TABS = [
  { key: 'MY_MACHINE', label: 'myMachine', GTMlabelEN: 'My Machine', icon: '32/machine/machine-care-ol' },
  { key: 'OL', label: 'olMachines', GTMlabelEN: 'Original', icon: '32/machine/machine-technology-ol' },
  { key: 'VL', label: 'vlMachines', GTMlabelEN: 'Vertuo', icon: '32/machine/machine-technology-vl' },
  { key: 'MILK', label: 'milkMachines', GTMlabelEN: 'Milk Devices', icon: '32/machine/milk-frothing' }
];

export default function App() {
  const t = useTranslation();
  const [active, setActive] = useState(TECH_TABS[0].key);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasCheckedLogin, setHasCheckedLogin] = useState(false);
  const { machineId, openMachine, closeMachine } = useMachineRoute();
  const activeMachine = machineId ? machines.find(m => m.id === machineId) : null;

  // Save scroll position when opening a machine detail, restore when closing
  useEffect(() => {
    if (!machineId) {
      // Restore scroll position when returning to list
      const savedPos = sessionStorage.getItem('machineListScrollPos');
      if (savedPos) {
        // Use requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(() => {
          window.scrollTo(0, parseInt(savedPos, 10));
        });
        // Remove the saved position after using it
        sessionStorage.removeItem('machineListScrollPos');
      }
    }
  }, [machineId]);

  // Save scroll position before navigating to machine detail
  const handleMachineClick = (e, machineId) => {
    sessionStorage.setItem('machineListScrollPos', window.scrollY.toString());
    // Let the default href navigation happen
  };

  // Preload all machine images on mount
  useEffect(() => {
    machines.forEach(machine => {
      const img = new Image();
      img.src = machine.img;
    });
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return machines.filter(m => m.name.toLowerCase().includes(query));
  }, [searchQuery]);

  const filtered = useMemo(() => {
    if (active === 'MY_MACHINE') return [];
    return machines.filter(m => m.technology === active);
  }, [active]);


  return (
    <div className="app-wrapper minimal">
      {!activeMachine && (
        <>
          <Search 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchResults={searchResults}
            onMachineClick={handleMachineClick}
          />
          <div className="select-from-list-message">
            {searchQuery.trim() && searchResults.length > 0 && (
              <p className='search-more-title'>{t('didntFindWhat')}</p>
            )}
            <p className='select-from-list-title'>{t('selectFromList')}</p>
          </div>
          <div className="tabs-bar" role="tablist" aria-label="Machine categories">
            {TECH_TABS.map(tab => (
              <button
                key={tab.key}
                className={tab.key === active ? 'tab active' : 'tab'}
                onClick={() => {
                  // GTM event
                  // GTMTracking.GTMtrackTabChange(tab.GTMlabelEN);
                  setActive(tab.key);
                }}
                role="tab"
                aria-selected={tab.key === active}
                aria-controls={`panel-${tab.key}`}
                id={`tab-${tab.key}`}
              >
                <TabIcon icon={tab.icon} />
                <span>{t(tab.label)}</span>
              </button>
            ))}
          </div>
          <div className="tab-panel" role="tabpanel" id={`panel-${active}`} aria-labelledby={`tab-${active}`}>
            {active === 'MY_MACHINE' ? (
              <MyMachineSection 
                onMachineClick={handleMachineClick} 
                onSwitchToOL={() => {
                  // Only switch if login hasn't been checked yet
                  if (!hasCheckedLogin) {
                    setActive('OL');
                  }
                }}
                onLoginChecked={() => setHasCheckedLogin(true)}
              />
            ) : (
              <>
                <h2 className="sr-only">{t(TECH_TABS.find(tab => tab.key === active)?.label)}</h2>
                <div className="machine-grid">
                  {filtered.map(machine => (
                    <div key={machine.id} className="machine-card">
                      <a href={`#!/${machine.id}`} onClick={(e) => handleMachineClick(e, machine.id)}>
                        <img 
                          src={machine.img} 
                          alt={machine.name}
                          loading="eager"
                        />
                        <p>{machine.name}</p>
                      </a>
                    </div>
                  ))}
                  {filtered.length === 0 && <p>No machines.</p>}
                </div>
              </>
            )}
          </div>
        </>
      )}
      {activeMachine && (
        <div className="machine-detail-panel">
          <MachineDetail machine={activeMachine} onClose={closeMachine} />
        </div>
      )}
      <Footer />
    </div>
  );
}

