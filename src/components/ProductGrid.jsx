import ProductCard from "./ProductCard.jsx";

export default function ProductGrid({ products, activeCategory }) {
  if (!products.length) {
    return <p style={{ opacity: 0.7 }}>No products for category: {activeCategory}</p>;
  }
  return (
    <section className="product-grid" aria-label={`${activeCategory} machines`}>
      {products.map(p => <ProductCard key={p.name} product={p} />)}
    </section>
  );
}
