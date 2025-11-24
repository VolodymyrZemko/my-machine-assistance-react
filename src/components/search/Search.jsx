import React from 'react';
import { useTranslation } from '../../translations/translations.js';
import './Search.css';

export function Search({ searchQuery, onSearchChange, searchResults, onMachineClick }) {
  const t = useTranslation();

  return (
    <div className="search-section">
      <div className="search-header">
        <h1>{t('searchTitle')}</h1>
        <p>{t('searchDescription')}</p>
      </div>
      
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder={t('searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {searchQuery.trim() && searchResults.length > 0 && (
        <div className="search-results">
          <h3>{t('searchResultFor')} {searchQuery}</h3>
          <div className="machine-grid">
            {searchResults.map(machine => (
              <div key={machine.id} className="machine-card">
                <a href={`#!/${machine.id}`} onClick={(e) => onMachineClick(e, machine.id)}>
                  <img 
                    src={machine.img} 
                    alt={machine.name}
                    loading="eager"
                  />
                  <p>{machine.name}</p>
                </a>
              </div>
            ))}
          </div>
          <p className='search-more-title'>{t('didntFindWhat')}</p>
          <p>{t('selectFromList')}</p>
        </div>
      )}

      {searchQuery.trim() && searchResults.length === 0 && (
        <div className="search-results no-results">
          <p>{t('searchResultFor')} "{searchQuery}"</p>
          <div className="no-search-result">
            <p>{t('selectFromList')}</p>
          </div>
        </div>
      )}
    </div>
  );
}
