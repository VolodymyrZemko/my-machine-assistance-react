import React from 'react';

export function Footer({ text = 'test1.2' }) {
  return (
    <footer className="app-footer">
      <p>{text}</p>
      <h4>PERSONALIZED MACHINE ASSISTANCE</h4>
      <h3>NEED HELP?</h3>
    </footer>
  );
}
