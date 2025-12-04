import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../../translations/translations.js';
import machines from '../../data/machines.json';

// GTM tracking
const trackMyMachineLoginClick = () => {
  try {
    window.gtmDataObject?.push({
      event: 'local_event',
      event_raised_by: 'gr',
      local_event_category: 'user engagement',
      local_event_action: 'click',
      local_event_label: 'machine assistance - my machines - log in'
    });
  } catch (e) {}
  // console.log('GTM Event: machine assistance - my machines - log in');
};

const trackNoMachinesView = () => {
  try {
    window.gtmDataObject?.push({
      event: 'local_event',
      event_raised_by: 'gr',
      local_event_category: 'impression',
      local_event_action: 'view',
      local_event_label: 'machine assistance - my machines - no registered machines'
    });
  } catch (e) {}
  // console.log('GTM Event: machine assistance - my machines - no registered machines');
};

const trackNoMachinesRegisterClick = () => {
  try {
    window.gtmDataObject?.push({
      event: 'local_event',
      event_raised_by: 'gr',
      local_event_category: 'user engagement',
      local_event_action: 'click',
      local_event_label: 'machine assistance - my machines - no registered machines - go to my account'
    });
  } catch (e) {}
  // console.log('GTM Event: machine assistance - my machines - no registered machines - go to my account');
};

const trackMyAccountClick = () => {
  try {
    window.gtmDataObject?.push({
      event: 'local_event',
      event_raised_by: 'gr',
      local_event_category: 'user engagement',
      local_event_action: 'click',
      local_event_label: 'machine assistance - my machines - edit in my account'
    });
  } catch (e) {}
  // console.log('GTM Event: machine assistance - my machines - edit in my account');
};

const trackTroubleshootingClick = () => {
  try {
    window.gtmDataObject?.push({
      event: 'local_event',
      event_raised_by: 'gr',
      local_event_category: 'user engagement',
      local_event_action: 'click',
      local_event_label: 'machine assistance - my machines - troubleshooting'
    });
  } catch (e) {}
  // console.log('GTM Event: machine assistance - my machines - troubleshooting');
};

export function MyMachineSection({ onMachineClick, onSwitchToOL, onLoginChecked }) {
  const t = useTranslation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [memberId, setMemberId] = useState(null);
  const [userMachines, setUserMachines] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userError, setUserError] = useState(null);
  const hasTrackedNoMachines = useRef(false);

  useEffect(() => {
    // Normalize machine name for matching
    function normalizeMachineName(name) {
      if (!name) return '';
      
      return name
        .toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with hyphens
        .replace(/&/g, '-and-')         // Replace & with -and-
        .replace(/\+/g, '-plus')        // Replace + with -plus
        .replace(/-+/g, '-')            // Replace multiple hyphens with single
        .replace(/^-|-$/g, '');         // Remove leading/trailing hyphens
    }

    // Extract machine ID from FAQ link
    function extractMachineIdFromFaq(faqLink) {
      if (!faqLink) return null;
      
      // Extract the part after #!/ in the FAQ link
      const match = faqLink.match(/#!\/([^/]+)/);
      if (match && match[1]) {
        return match[1].toLowerCase(); // Convert to lowercase to match our JSON ids
      }
      return null;
    }

    // Find matching machine from our JSON based on FAQ link or category
    function findMatchingMachine(faqLink, category) {
      // First try: Match by FAQ link (exact match)
      const faqId = extractMachineIdFromFaq(faqLink);
      if (faqId) {
        const exactMatch = machines.find(machine => machine.id === faqId);
        if (exactMatch) return exactMatch;
      }
      
      // Second try: Match by category (normalized matching)
      if (category) {
        const normalizedCategory = normalizeMachineName(category);
        
        // Try exact normalized match first
        const normalizedMatch = machines.find(machine => 
          machine.id === normalizedCategory
        );
        if (normalizedMatch) return normalizedMatch;
        
        // Try pattern matching for variations
        const patternMatch = machines.find(machine => {
          const machineId = machine.id;
          const categoryLower = normalizedCategory;
          
          // Remove all hyphens and compare
          const machineIdNoHyphens = machineId.replace(/-/g, '');
          const categoryNoHyphens = categoryLower.replace(/-/g, '');
          
          if (machineIdNoHyphens === categoryNoHyphens) return true;
          
          // Handle common patterns
          // CitiZ&Milk, CitizMilk, citiz-milk -> citiz-and-milk
          if (categoryLower.includes('milk')) {
            const categoryBase = categoryLower.replace(/-?(and-)?milk/g, '');
            const machineBase = machineId.replace(/-?(and-)?milk/g, '');
            if (categoryBase === machineBase) return true;
          }
          
          // Handle Plus variations (POP+, pop-plus)
          if (categoryLower.includes('plus') || machineId.includes('plus')) {
            const categoryBasePlus = categoryLower.replace(/-?plus/g, '');
            const machineBasePlus = machineId.replace(/-?plus/g, '');
            if (categoryBasePlus === machineBasePlus) return true;
          }
          
          return false;
        });
        
        if (patternMatch) return patternMatch;
      }
      
      return null;
    }

    async function checkUserLogin() {
      try {
        if (!window.napi?.customer) {
          console.log("NAPI not available - switching to OL tab");
          setIsLoggedIn(false);
          setLoadingUser(false);
          onSwitchToOL(); // Switch to OL tab
          onLoginChecked(); // Mark login check as complete
          return;
        }

        const myCustomer = await window.napi.customer().read();
        const memberID = myCustomer.memberNumber || null;

        if (memberID) {
          console.log("User is logged in:", memberID);
          setMemberId(memberID);
          setIsLoggedIn(true);
          await fetchMachines();
          onLoginChecked(); // Mark login check as complete
        } else {
          console.log("User is not logged in.");
          setIsLoggedIn(false);
          setLoadingUser(false);
          onLoginChecked(); // Mark login check as complete
        }
      } catch (error) {
        console.error("Error in checkUserLogin:", error);
        console.log("User is not logged in.");
        setIsLoggedIn(false);
        setLoadingUser(false);
        onSwitchToOL(); // Switch to OL tab on error
        onLoginChecked(); // Mark login check as complete
      }
    }

    async function fetchMachines() {
      try {
        const userMachinesData = await window.napi.customer().getMachines();

        if (userMachinesData.length === 0) {
          setUserMachines([]);
          setLoadingUser(false);
          return;
        }

        // Fetch product details for each machine
        const fetchProducts = await Promise.all(
          userMachinesData.map(async ({ productId, serialNumber, purchaseDate }) => {
            try {
              const productData = await window.napi.catalog().getProduct(productId.split("/").pop());
              
              // Find matching machine from our local JSON using FAQ link or category
              const matchedMachine = findMatchingMachine(
                productData.faq, 
                productData.category || productData.name
              );
              
              return {
                name: productData.name, // Original name from API
                id: matchedMachine?.id || null,
                img: productData.images?.icon || productData.image || matchedMachine?.img || machines[0].img,
                serialNumber,
                purchaseDate,
                faqLink: productData.faq, // Keep FAQ link for debugging
                category: productData.category || productData.name, // Keep category for debugging
                matchedBy: matchedMachine ? 'matched' : 'not-found' // Debug info
              };
            } catch (err) {
              // Skip products that can't be fetched (ResourceNotFoundError, etc.)
              console.warn(`Skipping product ${productId}: Product not found or unavailable`);
              return null;
            }
          })
        );

        // Filter out any null results from failed fetches
        setUserMachines(fetchProducts.filter(Boolean));
      } catch (error) {
        console.error("Error fetching machines:", error);
        setUserError("Unable to load your machines");
      } finally {
        setLoadingUser(false);
      }
    }

    checkUserLogin();
  }, []);

  // Track no machines view when the state is displayed, GTM
  useEffect(() => {
    if (!loadingUser && isLoggedIn && userMachines.length === 0 && !hasTrackedNoMachines.current) {
      hasTrackedNoMachines.current = true;
      trackNoMachinesView();
    }
  }, [loadingUser, isLoggedIn, userMachines.length]);

  return (
    <div className="my-machine-section">
      <h2 className="sr-only">{t('myMachine')}</h2>
      {loadingUser ? (
        <div className="my-machines-list">
          <div className="my-machine-item shimmer-machine-item">
            <div className="my-machine-image">
              <div className="shimmer-box shimmer-image"></div>
            </div>
            <div className="my-machine-info">
              <div className="shimmer-box shimmer-title"></div>
              <div className="shimmer-box shimmer-text"></div>
              <div className="shimmer-box shimmer-text"></div>
            </div>
            <div className="my-machine-actions">
              <div className="shimmer-box shimmer-button"></div>
              <div className="shimmer-box shimmer-button"></div>
            </div>
          </div>
          <div className="my-machine-item shimmer-machine-item">
            <div className="my-machine-image">
              <div className="shimmer-box shimmer-image"></div>
            </div>
            <div className="my-machine-info">
              <div className="shimmer-box shimmer-title"></div>
              <div className="shimmer-box shimmer-text"></div>
              <div className="shimmer-box shimmer-text"></div>
            </div>
            <div className="my-machine-actions">
              <div className="shimmer-box shimmer-button"></div>
              <div className="shimmer-box shimmer-button"></div>
            </div>
          </div>
        </div>
      ) : !isLoggedIn ? (
        <div className="login-prompt">
          <p>{t('pleaseLogin')}</p>
          <p className="register-info">
            {t('registerMachineInfo')} <a 
              href="secure/login" 
              className="login-link-inline"
              onClick={() => trackMyMachineLoginClick()}
            >{t('loginHere')}</a>
          </p>
        </div>
      ) : userMachines.length > 0 ? (
        <div>
          <div className="my-machines-list">
            {userMachines.map((machine, index) => (
              <div key={index} className="my-machine-item">
                <div className="my-machine-image">
                  <img 
                    src={machine.img} 
                    alt={machine.name}
                    loading="eager"
                  />
                </div>
                <div className="my-machine-info">
                  <h4>{machine.name}</h4>
                  {machine.serialNumber && <p>{t('serialNumber')} <span>{machine.serialNumber}</span></p>}
                  {machine.purchaseDate && <p>{t('purchaseDate')} <span>{new Date(machine.purchaseDate).toLocaleDateString()}</span></p>}
                </div>
                <div className="my-machine-actions">
                  <a 
                    href="myaccount/machines" 
                    className="my-machine-link"
                    onClick={() => trackMyAccountClick()}
                  >{t('myAccount')}</a>
                  {machine.id ? (
                    <a 
                      href={'#!/' + machine.id} 
                      className="my-machine-link primary" 
                      onClick={(e) => {
                        trackTroubleshootingClick();
                        onMachineClick(e, machine.id);
                      }}
                    >{t('viewDetails')}</a>
                  ) : (
                    <span className="my-machine-not-found">{t('machineNotFound')}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="no-machines">
          <p className="no-machine-title">{t('noMachines')}</p>
          <p>{t('noMachinesDescription')}</p>
          <a 
            href="myaccount/machines" 
            className="register-machine-link"
            onClick={() => trackNoMachinesRegisterClick()}
          >{t('registerMachine')}
          </a>
        </div>
      )}
    </div>
  );
}
