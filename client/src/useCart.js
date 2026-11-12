import { useEffect, useMemo, useState } from "react";

const KEY = "zina-cart";

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(raw) ? raw.filter((l) => Number.isInteger(l.id) && l.qty > 0) : [];
  } catch {
    return [];
  }
}

export function useCart(products, shipping) {
  const [lines, setLines] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      /* stockage indisponible : le panier reste en mémoire */
    }
  }, [lines]);

  const detailed = useMemo(
    () =>
      lines
        .map((l) => ({ ...l, product: products.find((p) => p.id === l.id) }))
        .filter((l) => l.product),
    [lines, products]
  );

  const subtotal = detailed.reduce((t, l) => t + l.product.price * l.qty, 0);
  const fee = subtotal === 0 || subtotal >= shipping.freeFrom ? 0 : shipping.fee;

  return {
    lines: detailed,
    count: detailed.reduce((t, l) => t + l.qty, 0),
    subtotal,
    fee,
    total: subtotal + fee,
    add: (id) =>
      setLines((ls) =>
        ls.some((l) => l.id === id)
          ? ls.map((l) => (l.id === id ? { ...l, qty: Math.min(20, l.qty + 1) } : l))
          : [...ls, { id, qty: 1 }]
      ),
    change: (id, delta) =>
      setLines((ls) =>
        ls.map((l) => (l.id === id ? { ...l, qty: Math.min(20, l.qty + delta) } : l)).filter((l) => l.qty > 0)
      ),
    clear: () => setLines([]),
  };
}
