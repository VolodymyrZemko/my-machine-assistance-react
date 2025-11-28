import React, { useEffect, useRef } from 'react';
import { useTranslation } from '../../translations/translations.js';
import { useInView } from 'react-intersection-observer';
import * as GTMTracking from '../../utils/gtmTracking.js';
import './Footer.css';

// Footer icon component using nb-icon web component
const FooterIcon = ({ icon }) => {
  return <nb-icon icon={icon} aria-hidden="true"></nb-icon>;
};

export function Footer({ activeMachine }) {
  const t = useTranslation();
  
  // GTM footer tracking: IntersectionObserver
  const { ref: footerRef, inView: isFooterInView } = useInView({
    threshold: 1.0, // Trigger when 100% in view
    delay: 1500, // Delay to ensure all content is loaded
  });

  // GTM footer tracking controls
  const allowFooterTrackingRef = useRef(false);
  const footerVisibleTimerRef = useRef(null);

  // Wait a short settle delay on mount so layout/globals finish loading
  useEffect(() => {
    const SETTLE_MS = 2000;
    const id2 = setTimeout(() => {
      allowFooterTrackingRef.current = true;
    }, SETTLE_MS);
    return () => clearTimeout(id2);
  }, []);

  // GTM event: Track footer view when 100% visible for a period
  useEffect(() => {
    const VISIBLE_MS = 2000;

    if (!allowFooterTrackingRef.current) return;

    if (isFooterInView) {
      footerVisibleTimerRef.current = setTimeout(() => {
        // Determine label: machine name on detail page, 'search' on list page
        const label = activeMachine ? activeMachine.name : 'search';
        GTMTracking.trackFooterView(label);
      }, VISIBLE_MS);
    } else {
      if (footerVisibleTimerRef.current) {
        clearTimeout(footerVisibleTimerRef.current);
        footerVisibleTimerRef.current = null;
      }
    }

    return () => {
      if (footerVisibleTimerRef.current) {
        clearTimeout(footerVisibleTimerRef.current);
        footerVisibleTimerRef.current = null;
      }
    };
  }, [isFooterInView, activeMachine]);
  
  return (
    <footer ref={footerRef} className="app-footer">
      <div className="container">
        <div className="section-user-info">
          <div className="section-wrapper">
            <p className="footer-title">{t('personalizedAssistance')}</p>
            <p className="footer-subtitle">{t('needHelp')}</p>
            <p>{t('contactAssistance')}</p>
            <p>{t('assistancePackage')}</p>
            <p>
              {t('termsConditions')} <a 
                id="machine-registration-tc-link" 
                href="legal"
                onClick={() => GTMTracking.trackServiceTCClick()}
              >{t('here')}</a>.
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
            <a 
              id="machine-registration-link" 
              href="myaccount/machines" 
              className="btn"
              onClick={() => GTMTracking.trackRegisterMachineClick()}
            >{t('registerMachine')}</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
