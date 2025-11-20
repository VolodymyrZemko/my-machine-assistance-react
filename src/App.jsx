import React, { useState } from 'react';
import './App.css';
import { Footer } from './components/layout/Footer.jsx';

// Minimal reset: a self-contained tab component setup.

const TABS = [
  { key: 'my-account', label: 'My Account Machine', content: 'My Account placeholder content' },
  { key: 'ol', label: 'OL Machine', content: 'OL Machine placeholder content' },
  { key: 'vl', label: 'VL Machine', content: 'VL Machine placeholder content' },
  { key: 'milk', label: 'Milk Machine', content: 'Milk Machine placeholder content' }
];

export default function App() {
  const [active, setActive] = useState(TABS[0].key);
  const current = TABS.find(t => t.key === active);

  return (
    <div className="app-wrapper minimal">
      <div className="tabs-bar">
        {TABS.map(tab => (
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
        <h2>{current.label}</h2>
        <p>{current.content}</p>
      </div>
      <Footer text="v1.2 reset" />
    </div>
  );
}

