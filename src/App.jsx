import React, { useState, useMemo, useEffect, useRef } from 'react';
import './App.css';
import machines from './data/machines.json';
import { useMachineRoute } from './modules/routing/useMachineRoute.js';
import { MachineDetail } from './components/machines/MachineDetail.jsx';
import { Footer } from './components/layout/Footer.jsx';

const TECH_TABS = [
  { key: 'MY_MACHINE', label: 'My Machine' },
  { key: 'OL', label: 'OL Machines' },
  { key: 'VL', label: 'VL Machines' },
  { key: 'MILK', label: 'Milk Machines' }
];

export default function App() {
  const [active, setActive] = useState(TECH_TABS[0].key);
  const [searchQuery, setSearchQuery] = useState('');
  const { machineId, openMachine, closeMachine } = useMachineRoute();
  const activeMachine = machineId ? machines.find(m => m.id === machineId) : null;

  // Scroll position ref
  const scrollPositionRef = useRef(0);

  // My Machine tab states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [memberId, setMemberId] = useState(null);
  const [userMachines, setUserMachines] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userError, setUserError] = useState(null);

  // Save scroll position when opening a machine detail, restore when closing
  useEffect(() => {
    if (!machineId) {
      // Restore scroll position when returning to list
      const savedPos = sessionStorage.getItem('machineListScrollPos');
      if (savedPos) {
        // Use requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(() => {
          window.scrollTo(0, parseInt(savedPos, 10));
        });
      }
    }
  }, [machineId]);

  // Save scroll position before navigating to machine detail
  const handleMachineClick = (e, machineId) => {
    sessionStorage.setItem('machineListScrollPos', window.scrollY.toString());
    // Let the default href navigation happen
  };

  // Preload all machine images on mount
  useEffect(() => {
    machines.forEach(machine => {
      const img = new Image();
      img.src = machine.img;
    });
  }, []);

  // Check user login status and fetch their machines
  useEffect(() => {
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

    // Find matching machine from our JSON based on FAQ link
    function findMatchingMachine(faqLink) {
      const machineId = extractMachineIdFromFaq(faqLink);
      if (!machineId) return null;
      
      return machines.find(machine => machine.id === machineId);
    }

    async function checkUserLogin() {
      try {
        if (!window.napi?.customer) {
          console.log("NAPI not available - switching to OL tab");
          setIsLoggedIn(false);
          setLoadingUser(false);
          setActive('OL'); // Switch to OL tab
          return;
        }

        const myCustomer = await window.napi.customer().read();
        const memberID = myCustomer.memberNumber || null;

        if (memberID) {
          console.log("User is logged in:", memberID);
          setMemberId(memberID);
          setIsLoggedIn(true);
          await fetchMachines();
        } else {
          console.log("User is not logged in.");
          setIsLoggedIn(false);
          setLoadingUser(false);
        }
      } catch (error) {
        console.error("Error in checkUserLogin:", error);
        setIsLoggedIn(false);
        setLoadingUser(false);
        setActive('OL'); // Switch to OL tab on error
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
              
              // Find matching machine from our local JSON using FAQ link
              const matchedMachine = findMatchingMachine(productData.faq);
              
              return {
                name: productData.name, // Original name from API
                id: matchedMachine?.id || null,
                img: productData.images?.icon || productData.image || matchedMachine?.img || machines[0].img,
                serialNumber,
                purchaseDate,
                faqLink: productData.faq // Keep FAQ link for debugging
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

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return machines.filter(m => m.name.toLowerCase().includes(query));
  }, [searchQuery]);

  const filtered = useMemo(() => {
    if (active === 'MY_MACHINE') return [];
    return machines.filter(m => m.technology === active);
  }, [active]);

  return (
    <div className="app-wrapper minimal">
      {!activeMachine && (
        <>
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search machines by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {searchQuery.trim() && searchResults.length > 0 && (
            <div className="search-results">
              <h3>Search result for: {searchQuery}</h3>
              <div className="machine-grid">
                {searchResults.map(machine => (
                  <div key={machine.id} className="machine-card">
                    <a href={`#!/${machine.id}`} onClick={(e) => handleMachineClick(e, machine.id)}>
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
              <p className='search-more-title'>Didn't find what you need?</p>
              <p>Select your machine from the list below.</p>
            </div>
          )}
          {searchQuery.trim() && searchResults.length === 0 && (
            <div className="search-results no-results">
              <p>Search result for: "{searchQuery}"</p>
              <div className="no-search-result">
                <p>Select your machine from the list below.</p>
              </div>
            </div>
          )}
          <div className="tabs-bar">
            {TECH_TABS.map(tab => (
              <button
                key={tab.key}
                className={tab.key === active ? 'tab active' : 'tab'}
                onClick={() => setActive(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="tab-panel">
            {active === 'MY_MACHINE' ? (
              <div className="my-machine-section">
                <h2>My Machine</h2>
                {loadingUser ? (
                  <div className="shimmer-container">
                    <div className="shimmer-box medium"></div>
                  </div>
                ) : !isLoggedIn ? (
                  <div className="login-prompt">
                    <p>Please log in to your account to find the machines registered to you.</p>
                    <a href="/login" className="login-link">Log in to your account</a>
                  </div>
                ) : userMachines.length > 0 ? (
                  <div>
                    <h3>Your Machines</h3>
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
                            {machine.serialNumber && <p>S/N: {machine.serialNumber}</p>}
                            {machine.purchaseDate && <p>Purchase Date: {new Date(machine.purchaseDate).toLocaleDateString()}</p>}
                          </div>
                          <div className="my-machine-actions">
                            <a href="/my-machine-page" className="my-machine-link">My Account</a>
                            {machine.id ? (
                              <a href={`#!/${machine.id}`} className="my-machine-link primary" onClick={(e) => handleMachineClick(e, machine.id)}>View Details</a>
                            ) : (
                              <span className="my-machine-not-found">Unfortunately, we did not find your machine. Please use search or find it from the list below.</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="no-machines">
                    <p>You do not have any registered machine, choose from list.</p>
                  </div>
                )}
              </div>
            ) : (
              <>
                <h2>{TECH_TABS.find(t => t.key === active)?.label}</h2>
                <div className="machine-grid">
                  {filtered.map(machine => (
                    <div key={machine.id} className="machine-card">
                      <a href={`#!/${machine.id}`} onClick={(e) => handleMachineClick(e, machine.id)}>
                        <img 
                          src={machine.img} 
                          alt={machine.name}
                          loading="eager"
                        />
                        <p>{machine.name}</p>
                      </a>
                    </div>
                  ))}
                  {filtered.length === 0 && <p>No machines.</p>}
                </div>
              </>
            )}
          </div>
        </>
      )}
      {activeMachine && (
        <div className="tab-panel">
          <MachineDetail machine={activeMachine} onClose={closeMachine} />
        </div>
      )}
      <Footer text="v1.2" />
    </div>
  );
}

