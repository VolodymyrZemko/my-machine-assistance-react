import React from 'react';
import { useTranslation } from '../../translations/translations.js';
import './Search.css';

export function Search({ searchQuery, onSearchChange, searchResults, onMachineClick }) {
  const t = useTranslation();

  return (
    <div className="search-section">
      <div className="search-wrapper">
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
      </div>

      {searchQuery.trim() && searchResults.length > 0 && (
        <div className="search-results">
          <p className='search-results-field-text'>{t('searchResultFor')} 
            <span className='search-query-wrapper'>
                <span>{searchQuery}</span>
                <button 
                className="remove-search-button" 
                onClick={() => onSearchChange('')}
                aria-label="Clear search"
                >
                <nb-icon icon="24/symbol/close"></nb-icon>
                </button>
            </span>
          </p>
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
        </div>
      )}

      {searchQuery.trim() && searchResults.length === 0 && (
        <div className="search-results no-results">
            <p className='search-results-field-text'>{t('searchResultFor')} 
                <span className='search-query-wrapper'>
                    <span>{searchQuery}</span>
                    <button 
                    className="remove-search-button" 
                    onClick={() => onSearchChange('')}
                    aria-label="Clear search"
                    >
                    <nb-icon icon="24/symbol/close"></nb-icon>
                    </button>
                </span>
            </p>
        </div>
      )}
    </div>
  );
}
