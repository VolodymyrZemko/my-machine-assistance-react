import React from 'react';
import { useTranslation } from '../../translations/translations.js';
import './Footer.css';

// Footer icon component using nb-icon web component
const FooterIcon = ({ icon }) => {
  return <nb-icon icon={icon} aria-hidden="true"></nb-icon>;
};

export function Footer() {
  const t = useTranslation();
  
  return (
    <footer className="app-footer">
      <div className="container">
        <div className="section-user-info">
          <div className="section-wrapper">
            <p className="footer-title">{t('personalizedAssistance')}</p>
            <p className="footer-subtitle">{t('needHelp')}</p>
            <p>{t('contactAssistance')}</p>
            <p>{t('assistancePackage')}</p>
            <p>
              {t('termsConditions')} <a id="machine-registration-tc-link" href="legal">{t('here')}</a>.
            </p>
            
            <div className="features">
              <div className="feature">
                <FooterIcon icon="32/symbol/country-of-origin" />
                <div className="feature-text-wrapper">
                  <p className="feature-title">{t('pickup')}</p>
                  <p>{t('pickupDesc')}</p>
                </div>
              </div>
              
              <div className="feature">
                <FooterIcon icon="32/machine/repair-ol" />
                <div className="feature-text-wrapper">
                  <p className="feature-title">{t('replacement')}</p>
                  <p>{t('replacementDesc')}</p>
                </div>
              </div>
              
              <div className="feature">
                <FooterIcon icon="32/delivery/fast-delivery" />
                <div className="feature-text-wrapper">
                  <p className="feature-title">{t('returnService')}</p>
                  <p>{t('returnDesc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="machine-registration">
          <div className="section-wrapper">
            <p className="registration-title">{t('machineRegistration')}</p>
            <p>{t('registrationDesc')}</p>
            <a id="machine-registration-link" href="myaccount/machines" className="btn">{t('registerMachine')}</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
