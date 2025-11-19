import products from "./data/products.json";

function App() {
  return (
    <main className="app-shell">
      <header className="hero">
        <h1>Nespresso Machines</h1>
        <p className="subtitle">Explore our range of coffee machines.</p>
      </header>
      <section className="product-grid" aria-label="Available machines">
        {products.map(p => (
          <article className="product-card" key={p.name} tabIndex="0">
            <div className="img-wrap">
              <img src={p.img} alt={p.name} loading="lazy" />
            </div>
            <h3>{p.name}</h3>
          </article>
        ))}
      </section>
    </main>
  );
}

export default App;
