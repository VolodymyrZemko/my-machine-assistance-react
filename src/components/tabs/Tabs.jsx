import React from 'react';

export function Tabs({ active, onChange, items }) {
  return (
    <div className="tabs">
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => onChange(item.key)}
          className={active === item.key ? 'active' : ''}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export function TabContent({ active, items }) {
  const current = items.find((i) => i.key === active);
  return <div className="tab-content">{current ? current.render() : null}</div>;
}
