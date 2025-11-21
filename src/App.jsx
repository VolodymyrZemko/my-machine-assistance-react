import React, { useState, useMemo, useEffect } from 'react';
import './App.css';
import machines from './data/machines.json';
import { useMachineRoute } from './modules/routing/useMachineRoute.js';
import { MachineDetail } from './components/machines/MachineDetail.jsx';
import { Footer } from './components/layout/Footer.jsx';

const TECH_TABS = [
  { key: 'MY_MACHINE', label: 'My Machine' },
  { key: 'OL', label: 'OL Machines' },
  { key: 'VL', label: 'VL Machines' },
  { key: 'MILK', label: 'Milk Machines' }
];

export default function App() {
  const [active, setActive] = useState(TECH_TABS[0].key);
  const [searchQuery, setSearchQuery] = useState('');
  const { machineId, openMachine, closeMachine } = useMachineRoute();
  const activeMachine = machineId ? machines.find(m => m.id === machineId) : null;

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
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search machines by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {searchQuery.trim() && searchResults.length > 0 && (
            <div className="search-results">
              <h3>Search Results ({searchResults.length})</h3>
              <div className="machine-grid">
                {searchResults.map(machine => (
                  <div key={machine.id} className="machine-card">
                    <a href={`#!/${machine.id}`}>
                      <img src={machine.img} alt={machine.name} />
                      <p>{machine.name}</p>
                      <small>{machine.technology}</small>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
          {searchQuery.trim() && searchResults.length === 0 && (
            <div className="search-results">
              <p>No machines found for "{searchQuery}"</p>
            </div>
          )}
          <div className="tabs-bar">
            {TECH_TABS.map(tab => (
              <button
                key={tab.key}
                className={tab.key === active ? 'tab active' : 'tab'}
                onClick={() => setActive(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="tab-panel">
            {active === 'MY_MACHINE' ? (
              <div>
                <h2>My Machine</h2>
                <p>Login to see your machine</p>
              </div>
            ) : (
              <>
                <h2>{TECH_TABS.find(t => t.key === active)?.label}</h2>
                <div className="machine-grid">
                  {filtered.map(machine => (
                    <div key={machine.id} className="machine-card">
                      <a href={`#!/${machine.id}`}>
                        <img src={machine.img} alt={machine.name} />
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
        <div className="tab-panel">
          <MachineDetail machine={activeMachine} onClose={closeMachine} />
        </div>
      )}
      <Footer text="v1.2" />
    </div>
  );
}

