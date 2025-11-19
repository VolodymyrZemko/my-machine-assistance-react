import { Link } from "react-router-dom";
import { slugify } from "../utils/slugify.js";

export default function ProductCard({ product }) {
  const slug = slugify(product.name);
  return (
    <Link to={`/machine/${slug}`} className="product-card" tabIndex="0">
      <div className="img-wrap">
        <img src={product.img} alt={product.name} loading="lazy" />
      </div>
      <h3>{product.name}</h3>
    </Link>
  );
}
