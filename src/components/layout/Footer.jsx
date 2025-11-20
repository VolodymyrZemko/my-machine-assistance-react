import React from 'react';

export function Footer({ text = 'test1.2' }) {
  return (
    <footer className="app-footer">
      <p>{text}</p>
    </footer>
  );
}
