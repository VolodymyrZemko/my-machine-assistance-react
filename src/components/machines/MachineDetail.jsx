import React, { useEffect, useState } from 'react';
import { useTranslation, getCurrentLanguage } from '../../translations/translations.js';

// GTM tracking
const trackMachineDetailView = (machineName) => {
  try {
    window.gtmDataObject?.push({
      event: 'local_event',
      event_raised_by: 'gr',
      local_event_category: 'impression',
      local_event_action: 'view',
      local_event_label: `machine assistance - ${machineName}`
    });
  } catch (e) {}
  // console.log('GTM Event: machine assistance -', machineName);
};

const trackUserManualClick = (machineName) => {
  try {
    window.gtmDataObject?.push({
      event: 'local_event',
      event_raised_by: 'gr',
      local_event_category: 'user engagement',
      local_event_action: 'click',
      local_event_label: `machine assistance - ${machineName} - user manual`
    });
  } catch (e) {}
  // console.log('GTM Event: machine assistance -', machineName, '- user manual');
};

const trackOverviewPDPClick = (machineName) => {
  try {
    window.gtmDataObject?.push({
      event: 'local_event',
      event_raised_by: 'gr',
      local_event_category: 'user engagement',
      local_event_action: 'click',
      local_event_label: `machine assistance - ${machineName} - overview - go to pdp`
    });
  } catch (e) {}
  // console.log('GTM Event: machine assistance -', machineName, '- overview - go to pdp');
};

const DETAIL_TABS = [
  { key: 'overview', label: 'overview', icon: '32/machine/dimensions', GTMlabelDpEN: 'overview' },
  { key: 'guides', label: 'guides', icon: '32/machine/machine-tutorial-vl', GTMlabelDpEN: 'guides and videos' },
  { key: 'troubleshooting', label: 'troubleshooting', icon: '32/machine/machine-care-ol', GTMlabelDpEN: 'troubleshooting' }
];

// Detail tab icon component
const DetailTabIcon = ({ icon }) => {
  return <nb-icon icon={icon} aria-hidden="true"></nb-icon>;
};

export function MachineDetail({ machine, onClose }) {
  const t = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [expandedTrouble, setExpandedTrouble] = useState(new Set());

  // Track detail tab clicks - defined inside component to avoid race condition
  const trackDetailTabClick = (machineName, tabName) => {
    try {
      window.gtmDataObject?.push({
        event: 'local_event',
        event_raised_by: 'gr',
        local_event_category: 'user engagement',
        local_event_action: 'click',
        local_event_label: `machine assistance - ${machineName} - ${tabName}`
      });
    } catch (e) {}
    // console.log('GTM Event: machine assistance -', machineName, '-', tabName);
  };

  const trackGuideClick = (machineName, guideName) => {
    try {
      window.gtmDataObject?.push({
        event: 'local_event',
        event_raised_by: 'gr',
        local_event_category: 'user engagement',
        local_event_action: 'click',
        local_event_label: `machine assistance - ${machineName} - guides - ${guideName}`
      });
    } catch (e) {}
    // console.log('GTM Event: machine assistance -', machineName, '- guides -', guideName);
  };

  if (!machine) return null;

  // Scroll to top when machine changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [machine.id]);

  // Track machine detail page view, GTM
  useEffect(() => {
    trackMachineDetailView(machine.name);
  }, [machine.name]);

  useEffect(() => {
    const prev = document.title;
    document.title = `${machine.name} • Machine Detail`;
    return () => { document.title = prev; };
  }, [machine]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setData(null);

    const lang = getCurrentLanguage();
    const url = `https://www.nespresso.com/shared_res/markets/gr/json/machine-assistance/v3/${machine.id}_${lang}.json`;

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(json => {
        if (!cancelled) {
          setData(json);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          console.error('Failed to load machine data:', err);
          setError(err.message);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [machine.id]);

  const overview = data?.menus?.find(m => m.id === 'overview');
  const instructions = data?.menus?.find(m => m.id === 'instructions');
  const troubleshooting = data?.menus?.find(m => m.id === 'troubleshooting');
  const userManuals = data?.userManuals || [];

  // Sync active tab to hash
  useEffect(() => {
    const hash = window.location.hash;
    const match = hash.match(/#!\/[^/]+\/(.+)/);
    const tabKeys = DETAIL_TABS.map(t => t.key);
    if (match && tabKeys.includes(match[1])) {
      setActiveTab(match[1]);
    } else {
      // Set default to overview and replace URL (don't create new history entry)
      setActiveTab('overview');
      const newHash = `#!/${machine.id}/overview`;
      history.replaceState(null, '', window.location.pathname + window.location.search + newHash);
    }

    // Listen for hash changes
    function onHashChange() {
      const currentHash = window.location.hash;
      const currentMatch = currentHash.match(/#!\/[^/]+\/(.+)/);
      if (currentMatch && tabKeys.includes(currentMatch[1])) {
        setActiveTab(currentMatch[1]);
      }
      
      // Check if we're in a guide detail view
      const guideMatch = currentHash.match(/#!\/[^/]+\/guides\/(.+)/);
      if (guideMatch && instructions) {
        const guidePath = guideMatch[1];
        const guide = instructions.topics?.find(t => t.path === guidePath);
        if (guide) {
          setSelectedGuide(guide);
        }
      } else if (currentHash.includes('/guides') && !currentHash.includes('/guides/')) {
        // We're on guides tab but no specific guide
        setSelectedGuide(null);
      }
    }

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [machine.id, instructions]);

  function handleTabChange(tab) {
    setActiveTab(tab);
    window.location.hash = `#!/${machine.id}/${tab}`;
  }

  function handleGuideSelect(guide) {
    setSelectedGuide(guide);
    window.location.hash = `#!/${machine.id}/guides/${guide.path}`;
    // Scroll to top when opening a guide
    window.scrollTo(0, 0);
  }

  function handleBackToGuides() {
    setSelectedGuide(null);
    window.location.hash = `#!/${machine.id}/guides`;
  }

  function toggleTrouble(index) {
    setExpandedTrouble(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  }

  return (
    <div className="machine-detail">
      <nav className="breadcrumbs">
        <div className="breadcrumbs-wrapper">
          <a href="/" className="breadcrumb-link">{t('home')}</a>
          <span className="breadcrumb-separator">›</span>
          <button onClick={onClose} className="breadcrumb-link">{t('machineAssistance')}</button>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">{machine.name}</span>
        </div>
      </nav>

      {(loading || error) && (
        <div className="shimmer-detail-container">
          <div className="shimmer-detail-header">
            <div className="shimmer-detail-image">
              <div className="shimmer-box shimmer-machine-image"></div>
            </div>
            <div className="shimmer-detail-content">
              <div className="shimmer-box shimmer-detail-subtitle"></div>
              <div className="shimmer-box shimmer-detail-title"></div>
              <div className="shimmer-box shimmer-detail-text"></div>
              <div className="shimmer-box shimmer-detail-text"></div>
            </div>
          </div>
          <div className="shimmer-tabs">
            <div className="shimmer-tab"></div>
            <div className="shimmer-tab"></div>
            <div className="shimmer-tab"></div>
          </div>
          <div className="shimmer-content">
            <div className="shimmer-box large"></div>
            <div className="shimmer-box medium"></div>
            <div className="shimmer-box small"></div>
          </div>
        </div>
      )}

      {data && (
        <>
          <div className="detail-header">
            <div className="detail-header-image">
              <img src={machine.img} alt={machine.name} className="machine-header-img" />
            </div>
            <div className="detail-header-content">
              <p className='detail-header-content-main-title'>{t('detailHeaderMainTitle')}</p>
              <h2>{machine.name}</h2>
              {userManuals.length > 0 && (
                <div className="user-manuals">
                  <strong>{t('userManuals')}</strong>
                  {userManuals.map((manual, i) => (
                    <div key={i} className="manual-item">
                      <span>{manual.name} ({manual.weight})</span>
                      {manual.links?.map((link, j) => (
                        <a 
                          key={j} 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={() => trackUserManualClick(machine.name)}
                        >
                          {link.language}
                        </a>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="detail-tabs">
            {DETAIL_TABS.map(tab => (
              <button
                key={tab.key}
                className={tab.key === activeTab ? 'detail-tab active' : 'detail-tab'}
                onClick={() => {
                  trackDetailTabClick(machine.name, tab.GTMlabelDpEN);
                  handleTabChange(tab.key);
                }}
              >
                <DetailTabIcon icon={tab.icon} />
                <span data-text={t(tab.label)}>{t(tab.label)}</span>
              </button>
            ))}
          </div>

          <div className="detail-content">
            {activeTab === 'overview' && overview ? (
              <div className="overview-section">
                <div
                  className="overview-bg"
                  style={{ backgroundImage: `url(${overview.imageBg})` }}
                />
                {overview.overviewHeaderTitle ? (
                  <div className="overview-text">
                    <h2>{overview.overviewHeaderTitle.title}</h2>
                    <h3>{overview.overviewHeaderTitle.headline}</h3>
                    <h4>{overview.overviewHeaderTitle.subheadline}</h4>
                    <p>{overview.overviewHeaderTitle.description}</p>
                    {overview.overviewHeaderTitle.cta && (
                      <a 
                        href={overview.overviewHeaderTitle.cta.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="cta-button"
                        onClick={() => trackOverviewPDPClick(machine.name)}
                      >
                        {overview.overviewHeaderTitle.cta.text}
                      </a>
                    )}
                  </div>
                ) : null}
                {overview.imageBgMob && (
                  <div
                    className="overview-bg-mobile"
                    style={{ backgroundImage: `url(${overview.imageBgMob})` }}
                  />
                )}
                {overview.specifications && overview.specifications.length > 0 && (
                  <div className="specifications">
                    <h3 className="sr-only">Specifications</h3>
                    <div className="specs-grid">
                      {overview.specifications.map((spec, i) => (
                        <div key={i} className="spec-item">
                          <img src={spec.icon} alt="" />
                          <div dangerouslySetInnerHTML={{ __html: spec.content }} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : activeTab === 'overview' && !overview ? (
              <div className="no-data-message">
                <p>{t('overviewNotAvailable')}</p>
              </div>
            ) : null}
            {activeTab === 'guides' && instructions ? (
              <div className="guides-section">
                {!selectedGuide ? (
                  <>
                    <div
                      className="guides-bg"
                      style={{ backgroundImage: `url(${instructions.imageBg})` }}
                    />
                    <p className="guides-intro">{t('selectFunctionality')}</p>
                    <div className="guides-grid">
                      {instructions.topics?.map((topic, i) => (
                        <div 
                          key={i} 
                          className="guide-card" 
                          onClick={() => {
                            trackGuideClick(machine.name, topic.title);
                            handleGuideSelect(topic);
                          }}
                        >
                          <img src={topic.icon} alt={topic.title} />
                          <h4>{topic.title}</h4>
                        </div>
                      ))}
                    </div>
                    {instructions.imageBgMob && (
                      <div
                        className="guides-bg-mobile"
                        style={{ backgroundImage: `url(${instructions.imageBgMob})` }}
                      />
                    )}
                  </>
                ) : (
                  <div className="guide-detail">
                    <p className="guides-intro">{t('selectFunctionality')}</p>
                    <button className="guide-back-button" onClick={handleBackToGuides}>
                      {selectedGuide.icon && <img src={selectedGuide.icon} alt="Back" />}
                      {t('backToGuides')}
                    </button>
                    <h3 className="sr-only">{selectedGuide.title}</h3>
                    {selectedGuide.videoId && (
                      <div className="guide-video">
                        <iframe
                          width="100%"
                          height="400"
                          src={`https://www.youtube.com/embed/${selectedGuide.videoId}`}
                          title={selectedGuide.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}
                    <div className="guide-instructions">
                      {selectedGuide.instructions?.map((instruction, i) => (
                        <div key={i} className="instruction-step">
                          {instruction.visual && <img src={instruction.visual} alt={`${t('step')} ${i + 1}`} />}
                          <div className="instruction-step-content">
                            <strong className="instruction-step-index">{t('step')} {i + 1}</strong>
                            <div dangerouslySetInnerHTML={{ __html: instruction.content }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : activeTab === 'guides' && !instructions ? (
              <div className="no-data-message">
                <p>{t('guidesNotAvailable')}</p>
              </div>
            ) : null}
            {activeTab === 'troubleshooting' && troubleshooting ? (
              <div className="troubleshooting-section">
                <div
                  className="troubleshooting-bg"
                  style={{ backgroundImage: `url(${troubleshooting.imageBg})` }}
                />
                <div className="troubleshooting-list">
                  <h3>{t('selectIssue')}</h3>
                  {troubleshooting.troubles?.map((trouble, index) => (
                    <div key={index} className="trouble-item">
                      <button
                        className="trouble-button"
                        onClick={() => toggleTrouble(index)}
                        aria-expanded={expandedTrouble.has(index)}
                      >
                        <span>{trouble.title}</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="chevron"
                          style={{ transform: expandedTrouble.has(index) ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        >
                          <path d="m12 15.3-8-8v1.4l8 8 8-8V7.3l-8 8Z"></path>
                        </svg>
                      </button>
                      <div
                        className="trouble-panel"
                        style={{
                          maxHeight: expandedTrouble.has(index) ? '500px' : '0px',
                          overflow: 'hidden',
                          transition: 'max-height 0.3s ease-in-out'
                        }}
                      >
                        <div className="trouble-content" dangerouslySetInnerHTML={{ __html: trouble.content }} />
                      </div>
                    </div>
                  ))}
                </div>
                {troubleshooting.imageBgMob && (
                  <div
                    className="troubleshooting-bg-mobile"
                    style={{ backgroundImage: `url(${troubleshooting.imageBgMob})` }}
                  />
                )}
              </div>
            ) : activeTab === 'troubleshooting' && !troubleshooting ? (
              <div className="no-data-message">
                <p>{t('troubleshootingNotAvailable')}</p>
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
