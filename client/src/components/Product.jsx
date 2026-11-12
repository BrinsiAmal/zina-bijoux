export const CATEGORIES = [
  ["tous", "Tout voir"],
  ["colliers", "Colliers"],
  ["boucles", "Boucles d'oreilles"],
  ["bagues", "Bagues"],
  ["bracelets", "Bracelets"],
];
export const CATEGORY_LABEL = { colliers: "Collier", boucles: "Boucles d'oreilles", bagues: "Bague", bracelets: "Bracelet" };
export const FINISH_LABEL = { dore: "Doré", argente: "Argenté" };

export const dt = (n) => `${n} DT`;

export function Picture({ product }) {
  return (
    <img
      src={product.image}
      alt={`${product.name}, ${CATEGORY_LABEL[product.category].toLowerCase()} ${FINISH_LABEL[product.finish].toLowerCase()}`}
      loading="lazy"
      decoding="async"
      style={product.focus ? { objectPosition: product.focus } : undefined}
    />
  );
}

export function ProductCard({ product, onAdd }) {
  return (
    <article className="card">
      <div className="pic" style={{ background: `var(--t${(product.id % 4) + 1})` }}>
        {product.isNew && <span className="badge">Nouveau</span>}
        <Picture product={product} />
      </div>
      <h3>{product.name}</h3>
      <p className="meta">
        {CATEGORY_LABEL[product.category]} · {FINISH_LABEL[product.finish]}
      </p>
      <div className="buy">
        <span className="price">
          {dt(product.price)}
          {product.oldPrice && <s>{dt(product.oldPrice)}</s>}
        </span>
        <button className="add" onClick={() => onAdd(product.id)} aria-label={`Ajouter ${product.name} au panier`}>
          Ajouter
        </button>
      </div>
    </article>
  );
}
