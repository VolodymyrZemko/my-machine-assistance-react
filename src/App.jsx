import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Footer from "./components/Footer.jsx";
import MyMachinesTab from "./components/MyMachinesTab.jsx";
import Tabs from "./components/Tabs.jsx";
import CategoryHeader from "./components/CategoryHeader.jsx";
import ProductGrid from "./components/ProductGrid.jsx";
import MachineDetail from "./components/MachineDetail.jsx";
import { useCategoryProducts } from "./hooks/useCategoryProducts.js";
// Styles moved to main.jsx for consistent global load on static hosts (Netlify)

function HomeView({ activeTab, setActiveTab }) {
  const filteredProducts = useCategoryProducts(activeTab);
  return (
    <>
      <Tabs active={activeTab} onChange={setActiveTab} />
      <main className="app-shell">
        {activeTab === "my-machines" ? (
          <MyMachinesTab />
        ) : (
          <>
            <CategoryHeader category={activeTab} />
            <ProductGrid products={filteredProducts} activeCategory={activeTab} />
          </>
        )}
      </main>
    </>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState("my-machines");
  const location = useLocation();
  const isDetail = location.pathname.startsWith("/machine/");

  return (
    <>
      <Routes>
        <Route path="/" element={<HomeView activeTab={activeTab} setActiveTab={setActiveTab} />} />
        <Route path="/machine/:slug" element={<MachineDetail />} />
      </Routes>
      {!isDetail && <Footer />}
    </>
  );
}

export default App;
