import React from 'react';

export function Footer({ text = 'test7' }) {
  return (
    <footer className="app-footer">
      <p>{text}</p>
    </footer>
  );
}
