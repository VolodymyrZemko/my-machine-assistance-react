import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { machinesData } from '../../data/machines.js';
import { useMachineDetail } from '../../modules/machines/useMachineDetail.js';

export function MachineDetail() {
  const { id } = useParams();
  const machine = machinesData.find(m => m.id === id);
  const { data: remote, loading, error } = useMachineDetail(id);

  useEffect(() => {
    if (machine) {
      document.title = `${machine.name} • Machine Detail`;
    } else {
      document.title = 'Machine Not Found';
    }
  }, [machine]);

  if (!machine) {
    return (
      <div className="machine-detail">
        <h2>Machine not found</h2>
        <p>No machine exists with id: <code>{id}</code></p>
        <Link to="/">Back to machines</Link>
      </div>
    );
  }

  // If remote file 404s, we still show local machine with a notice.
  const notFoundRemote = !loading && !remote && !error;

  return (
    <div className="machine-detail">
      <Link to="/">← Back</Link>
      <h1>{machine.name}</h1>
      <img src={machine.img} alt={machine.name} width={200} height={200} loading="lazy" />
      <ul className="meta">
        <li><strong>ID:</strong> {machine.id}</li>
        <li><strong>Technology:</strong> {machine.technology}</li>
        {loading && <li>Loading remote data…</li>}
        {error && <li style={{color:'red'}}>Remote data error: {error}</li>}
        {remote && remote?.model && <li><strong>Model:</strong> {remote.model}</li>}
        {remote && remote?.submodel && <li><strong>Submodel:</strong> {remote.submodel}</li>}
        {notFoundRemote && <li><em>No remote assistance data found.</em></li>}
      </ul>
      {remote?.description && (
        <section>
          <h2>Description</h2>
          <p>{remote.description}</p>
        </section>
      )}
      {remote?.features && Array.isArray(remote.features) && remote.features.length > 0 && (
        <section>
          <h2>Features</h2>
          <ul>
            {remote.features.map((f,i) => <li key={i}>{f}</li>)}
          </ul>
        </section>
      )}
    </div>
  );
}
