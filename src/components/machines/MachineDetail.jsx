import React, { useEffect, useState } from 'react';

const DETAIL_TABS = ['overview', 'guides', 'troubleshooting'];

export function MachineDetail({ machine, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

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

  // Sync active tab to hash
  useEffect(() => {
    const hash = window.location.hash;
    const match = hash.match(/#machine\/[^/]+\/(.+)/);
    if (match && DETAIL_TABS.includes(match[1])) {
      setActiveTab(match[1]);
    } else {
      setActiveTab('overview');
    }
  }, []);

  function handleTabChange(tab) {
    setActiveTab(tab);
    window.location.hash = `machine/${machine.id}/${tab}`;
  }

  const overview = data?.menus?.find(m => m.id === 'overview');
  const userManuals = data?.userManuals || [];

  return (
    <div className="machine-detail">
      <button className="back-button" onClick={onClose}>← Back</button>

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
            {activeTab === 'guides' && <p>Guides content coming soon...</p>}
            {activeTab === 'troubleshooting' && <p>Troubleshooting content coming soon...</p>}
          </div>
        </>
      )}
    </div>
  );
}
