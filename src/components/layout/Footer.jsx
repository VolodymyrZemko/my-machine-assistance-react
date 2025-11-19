import React from 'react';

export function Footer({ text = '© 2025 Nespresso • All rights reserved.' }) {
  return (
    <footer className="app-footer">
      <p>{text}</p>
    </footer>
  );
}
