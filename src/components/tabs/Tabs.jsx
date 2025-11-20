import React from 'react';

export function Tabs({ items, active, onChange }) {
  return (
    <div className="tabs-bar">
      {items.map(item => (
        <button
          key={item.key}
          className={item.key === active ? 'tab active' : 'tab'}
          onClick={() => onChange(item.key)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export function TabContent({ items, active }) {
  const found = items.find(i => i.key === active);
  if (!found) return null;
  return (
    <div className="tab-panel">
      {found.render()}
    </div>
  );
}
