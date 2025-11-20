import React, { useEffect, useState } from 'react';

const DETAIL_TABS = ['overview', 'guides', 'troubleshooting'];

export function MachineDetail({ machine, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedGuide, setSelectedGuide] = useState(null);

  if (!machine) return null;

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

    const url = `https://www.nespresso.com/shared_res/markets/gr/json/machine-assistance/v2/${machine.id}_en.json`;

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
          setError(err.message);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [machine.id]);

  const overview = data?.menus?.find(m => m.id === 'overview');
  const instructions = data?.menus?.find(m => m.id === 'instructions');
  const userManuals = data?.userManuals || [];

  // Sync active tab to hash
  useEffect(() => {
    const hash = window.location.hash;
    const match = hash.match(/#!\/[^/]+\/(.+)/);
    if (match && DETAIL_TABS.includes(match[1])) {
      setActiveTab(match[1]);
    } else {
      // Set default to overview and update URL
      setActiveTab('overview');
      window.location.hash = `#!/${machine.id}/overview`;
    }

    // Listen for hash changes
    function onHashChange() {
      const currentHash = window.location.hash;
      const currentMatch = currentHash.match(/#!\/[^/]+\/(.+)/);
      if (currentMatch && DETAIL_TABS.includes(currentMatch[1])) {
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
  }

  function handleBackToGuides() {
    setSelectedGuide(null);
    window.location.hash = `#!/${machine.id}/guides`;
  }

  return (
    <div className="machine-detail">
      <nav className="breadcrumbs">
        <a href="https://www.nespresso.com" className="breadcrumb-link">Home</a>
        <span className="breadcrumb-separator">›</span>
        <button onClick={onClose} className="breadcrumb-link">Machine Assistance</button>
        <span className="breadcrumb-separator">›</span>
        <span className="breadcrumb-current">{machine.name}</span>
      </nav>

      {loading && <p className="status-loading">Loading machine data...</p>}
      {error && <p className="status-error">Error loading data: {error}</p>}

      {data && (
        <>
          <div className="detail-header">
            <img src={machine.img} alt={machine.name} className="machine-header-img" />
            <h2>{machine.name}</h2>
            {userManuals.length > 0 && (
              <div className="user-manuals">
                <strong>User Manuals:</strong>
                {userManuals.map((manual, i) => (
                  <div key={i} className="manual-item">
                    <span>{manual.name} ({manual.weight})</span>
                    {manual.links.map((link, j) => (
                      <a key={j} href={link.url} target="_blank" rel="noopener noreferrer">
                        {link.language}
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="detail-tabs">
            {DETAIL_TABS.map(tab => (
              <button
                key={tab}
                className={tab === activeTab ? 'detail-tab active' : 'detail-tab'}
                onClick={() => handleTabChange(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="detail-content">
            {activeTab === 'overview' && overview && (
              <div className="overview-section">
                <div
                  className="overview-bg"
                  style={{ backgroundImage: `url(${overview.imageBg})` }}
                />
                <div className="overview-text">
                  <h2>{overview.overviewHeaderTitle.title}</h2>
                  <h3>{overview.overviewHeaderTitle.headline}</h3>
                  <h4>{overview.overviewHeaderTitle.subheadline}</h4>
                  <p>{overview.overviewHeaderTitle.description}</p>
                  {overview.overviewHeaderTitle.cta && (
                    <a href={overview.overviewHeaderTitle.cta.link} target="_blank" rel="noopener noreferrer" className="cta-button">
                      {overview.overviewHeaderTitle.cta.text}
                    </a>
                  )}
                </div>
                <div className="specifications">
                  <h3>Specifications</h3>
                  <div className="specs-grid">
                    {overview.specifications.map((spec, i) => (
                      <div key={i} className="spec-item">
                        <img src={spec.icon} alt="" />
                        <div dangerouslySetInnerHTML={{ __html: spec.content }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'guides' && instructions && (
              <div className="guides-section">
                {!selectedGuide ? (
                  <>
                    <div
                      className="guides-bg"
                      style={{ backgroundImage: `url(${instructions.imageBg})` }}
                    />
                    <p className="guides-intro">Select a functionality from the list below to view detailed guides and videos.</p>
                    <div className="guides-grid">
                      {instructions.topics?.map((topic, i) => (
                        <div key={i} className="guide-card" onClick={() => handleGuideSelect(topic)}>
                          <img src={topic.icon} alt={topic.title} />
                          <h4>{topic.title}</h4>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="guide-detail">
                    <button className="guide-back-button" onClick={handleBackToGuides}>
                      <img src={selectedGuide.icon} alt="Back" />
                      Back to all guides
                    </button>
                    <h3>{selectedGuide.title}</h3>
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
                          {instruction.visual && <img src={instruction.visual} alt={`Step ${i + 1}`} />}
                          <div dangerouslySetInnerHTML={{ __html: instruction.content }} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {activeTab === 'troubleshooting' && <p>Troubleshooting content coming soon...</p>}
          </div>
        </>
      )}
    </div>
  );
}
