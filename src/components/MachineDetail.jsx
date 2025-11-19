import { useParams, Link } from "react-router-dom";
import { useMachineDetail } from "../hooks/useMachineDetail.js";
import products from "../data/products.json";
import { slugify } from "../utils/slugify.js";

export default function MachineDetail() {
  const { slug } = useParams();
  const { data, loading, error } = useMachineDetail(slug);

  const product = products.find(p => slugify(p.name) === slug);

  return (
    <div className="machine-detail" aria-live="polite">
      <Link to="/" className="back-link">← Back</Link>
      <h2>{product ? product.name : slug}</h2>
      {loading && <p>Loading details...</p>}
      {error && <p className="error-msg">Error: {error}</p>}
      {data && (
        <pre style={{ textAlign: "left", background: "#fafafa", padding: "1rem", border: "1px solid #e3e3e3", borderRadius: 8, overflow: "auto", maxHeight: "420px" }}>
{JSON.stringify(data, null, 2)}
        </pre>
      )}
      {!loading && !error && !data && <p>No data found for this machine.</p>}
    </div>
  );
}
