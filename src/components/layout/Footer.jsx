import React from 'react';
import { useTranslation } from '../../translations/translations.js';

export function Footer({ text = 'test1.2' }) {
  const t = useTranslation();
  
  return (
    <footer className="app-footer">
      <p>{text}</p>
      <h4>{t('personalizedAssistance')}</h4>
      <h3>{t('needHelp')}</h3>
    </footer>
  );
}
