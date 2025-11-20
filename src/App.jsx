import React, { useState, useMemo } from 'react';
import './App.css';
import machines from './data/machines.json';
import { useMachineRoute } from './modules/routing/useMachineRoute.js';
import { MachineDetail } from './components/machines/MachineDetail.jsx';
import { Footer } from './components/layout/Footer.jsx';

const TECH_TABS = [
  { key: 'OL', label: 'OL Machines' },
  { key: 'VL', label: 'VL Machines' },
  { key: 'MILK', label: 'Milk Machines' }
];

export default function App() {
  const [active, setActive] = useState(TECH_TABS[0].key);
  const { machineId, openMachine, closeMachine } = useMachineRoute();
  const activeMachine = machineId ? machines.find(m => m.id === machineId) : null;

  const filtered = useMemo(() => machines.filter(m => m.technology === active), [active]);

  function handleTestRouting() {
    const first = filtered[0];
    if (first) openMachine(first.id);
  }

  return (
    <div className="app-wrapper minimal">
      {!activeMachine && (
        <>
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
            <button className="tab" onClick={handleTestRouting}>test routing</button>
          </div>
          <div className="tab-panel">
            <h2>{TECH_TABS.find(t => t.key === active)?.label}</h2>
            <div className="machine-grid">
              {filtered.map(machine => (
                <div key={machine.id} className="machine-card">
                  <a href={`#machine/${machine.id}`}>
                    <img src={machine.img} alt={machine.name} />
                    <p>{machine.name}</p>
                  </a>
                </div>
              ))}
              {filtered.length === 0 && <p>No machines.</p>}
            </div>
          </div>
        </>
      )}
      {activeMachine && (
        <div className="tab-panel">
          <MachineDetail machine={activeMachine} onClose={closeMachine} />
        </div>
      )}
      <Footer text={activeMachine ? 'Viewing machine detail' : 'Machine tabs'} />
    </div>
  );
}

