import products from "../data/products.json";
import { CATEGORIES } from "../constants/categories.js";
import { useMemo } from "react";

export function useCategoryProducts(activeTab) {
  const list = useMemo(() => {
    if (!activeTab || activeTab === "my-machines") return [];
    if (!CATEGORIES.includes(activeTab)) return [];
    return products.filter(p => p.category === activeTab);
  }, [activeTab]);
  return list;
}
