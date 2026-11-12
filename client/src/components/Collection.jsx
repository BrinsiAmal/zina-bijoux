import { useMemo, useState } from "react";
import { CATEGORIES, ProductCard } from "./Product.jsx";

export default function Collection({ products, onAdd }) {
  const [category, setCategory] = useState("tous");
  const [finish, setFinish] = useState("");
  const [sort, setSort] = useState("new");

  const list = useMemo(() => {
    const l = products.filter((p) => (category === "tous" || p.category === category) && (!finish || p.finish === finish));
    if (sort === "asc") l.sort((a, b) => a.price - b.price);
    if (sort === "desc") l.sort((a, b) => b.price - a.price);
    return l;
  }, [products, category, finish, sort]);

  return (
    <section id="collection">
      <div className="sec-head">
        <div>
          <p className="eyebrow">La boutique</p>
          <h2>Toute la collection</h2>
        </div>
        <p className="eyebrow" aria-live="polite">
          {list.length} bijou{list.length > 1 ? "x" : ""}
        </p>
      </div>

      <div className="tools" role="group" aria-label="Filtrer par catégorie">
        {CATEGORIES.map(([key, label]) => (
          <button key={key} className="chip" aria-pressed={category === key} onClick={() => setCategory(key)}>
            {label}
          </button>
        ))}
      </div>
      <div className="tools">
        <label htmlFor="finish" className="eyebrow">Finition</label>
        <select id="finish" value={finish} onChange={(e) => setFinish(e.target.value)}>
          <option value="">Toutes</option>
          <option value="dore">Doré</option>
          <option value="argente">Argenté</option>
        </select>
        <span className="sp" />
        <label htmlFor="sort" className="eyebrow">Trier</label>
        <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="new">Nouveautés</option>
          <option value="asc">Prix croissant</option>
          <option value="desc">Prix décroissant</option>
        </select>
      </div>

      <div className="grid">
        {list.length ? (
          list.map((p) => <ProductCard key={p.id} product={p} onAdd={onAdd} />)
        ) : (
          <p className="empty">Aucun bijou ne correspond à ces filtres.</p>
        )}
      </div>
    </section>
  );
}
