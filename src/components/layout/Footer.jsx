import React from 'react';

export function Footer({ text = 'test123' }) {
  return (
    <footer className="app-footer">
      <p>{text}</p>
    </footer>
  );
}
