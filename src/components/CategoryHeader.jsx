import { CATEGORY_LABELS } from "../constants/categories.js";

export default function CategoryHeader({ category }) {
  if (!category || category === "my-machines") return null;
  return (
    <header className="hero">
      <h1>{CATEGORY_LABELS[category] || category}</h1>
      <p className="subtitle">Explore our range of {category} machines.</p>
    </header>
  );
}
