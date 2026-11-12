import { Picture } from "./Product.jsx";

export function Header({ count, onOpenCart }) {
  return (
    <header className="top">
      <div className="wrap">
        <a className="logo" href="#haut"><i></i>Zina Bijoux</a>
        <nav aria-label="Navigation principale">
          <a href="#collection">Collection</a>
          <a href="#services">Nos engagements</a>
          <a href="#contact">Contact</a>
        </nav>
        <button className="cart-btn" onClick={onOpenCart} aria-label="Ouvrir le panier">
          Panier <b>{count}</b>
        </button>
      </div>
    </header>
  );
}

export function Hero({ products }) {
  const picks = [1, 6, 10, 13].map((id) => products.find((p) => p.id === id)).filter(Boolean);
  return (
    <div className="hero">
      <div>
        <p className="eyebrow">Fantaisie · Nouvelle collection</p>
        <h1>Faux bijoux, <mark>vrai style.</mark></h1>
        <p className="lead">
          Colliers, boucles d'oreilles, bagues et bracelets à porter tous les jours, à partir de 15 DT.
          Paiement à la livraison partout en Tunisie.
        </p>
        <div className="cta-row">
          <a className="btn primary" href="#collection">Voir la collection</a>
          <a className="btn" href="#services">Livraison et retours</a>
        </div>
      </div>
      <div className="collage" aria-hidden="true">
        {picks.map((p) => <div className="tile" key={p.id}><Picture product={p} /></div>)}
      </div>
    </div>
  );
}

const WORDS = ["Colliers", "Boucles d'oreilles", "Bagues", "Bracelets", "Livraison 7 DT", "Paiement à la livraison", "Nouveautés chaque semaine"];
export function Ticker() {
  const spans = [...WORDS, ...WORDS].map((w, i) => <span key={i}>{w}</span>);
  return <div className="ticker" aria-hidden="true"><div className="track">{spans}</div></div>;
}

export function Services({ shipping }) {
  return (
    <section id="services">
      <div className="sec-head"><div><p className="eyebrow">Commander sereinement</p><h2>Nos engagements</h2></div></div>
      <div className="services">
        <div className="svc"><h3>Paiement à la livraison</h3><p>Vous payez en espèces au livreur, une fois le colis entre vos mains.</p></div>
        <div className="svc"><h3>Livraison en 48 à 72 h</h3><p>{shipping.fee} DT dans toute la Tunisie, offerts dès {shipping.freeFrom} DT d'achats.</p></div>
        <div className="svc"><h3>Échange sous 7 jours</h3><p>Une taille de bague qui ne va pas ? Nous l'échangeons.</p></div>
        <div className="svc"><h3>Emballage cadeau</h3><p>Chaque bijou arrive dans une pochette prête à offrir.</p></div>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact" style={{ paddingTop: 0 }}>
      <div className="contact">
        <div>
          <h2>Une question ? Un conseil ?</h2>
          <p>Écrivez-nous pour une taille, une couleur ou une commande en gros pour un mariage ou un cadeau.</p>
        </div>
        <dl>
          <div><dt>Instagram</dt><dd>@zina.bijoux</dd></div>
          <div><dt>WhatsApp</dt><dd>+216 00 000 000</dd></div>
          <div><dt>E-mail</dt><dd>contact@zina-bijoux.tn</dd></div>
        </dl>
      </div>
    </section>
  );
}
