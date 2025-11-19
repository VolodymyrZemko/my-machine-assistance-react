import { CATEGORIES } from "../constants/categories.js";

export default function Tabs({ active, onChange }) {
  return (
    <nav className="tabs" aria-label="Machine categories">
      <button className={active === "my-machines" ? "active" : ""} onClick={() => onChange("my-machines")}>Мої машини</button>
      {CATEGORIES.map(cat => (
        <button key={cat} className={active === cat ? "active" : ""} onClick={() => onChange(cat)}>
          {cat.charAt(0).toUpperCase() + cat.slice(1)}
        </button>
      ))}
    </nav>
  );
}
