import { useEffect, useRef, useState } from "react";
import { Picture, FINISH_LABEL, dt } from "./Product.jsx";

const EMPTY = { name: "", phone: "", city: "", address: "" };

export default function CartDrawer({ open, onClose, cart, shipping }) {
  const [step, setStep] = useState("cart"); // cart | checkout | done
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const closeRef = useRef(null);

  useEffect(() => {
    if (open) closeRef.current?.focus();
    else if (step === "done") setStep("cart");
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const left = Math.max(0, shipping.freeFrom - cart.subtotal);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setSending(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.lines.map((l) => ({ id: l.id, qty: l.qty })),
          customer: form,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "La commande n'a pas pu être envoyée.");
      setOrderId(data.id);
      cart.clear();
      setForm(EMPTY);
      setStep("done");
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  const title = step === "checkout" ? "Livraison" : step === "done" ? "Commande envoyée" : "Votre panier";

  return (
    <>
      <div className="veil" onClick={onClose} style={open ? { opacity: 1, pointerEvents: "auto" } : undefined} />
      <aside
        className={`drawer${open ? " is-open" : ""}`}
        aria-label="Panier"
        aria-hidden={!open}
      >
        <div className="d-head">
          <h2>{title}</h2>
          <button ref={closeRef} className="x" onClick={onClose} aria-label="Fermer le panier">✕</button>
        </div>

        {step === "done" ? (
          <div className="d-body">
            <p>
              Merci ! Votre commande <b>{orderId}</b> est bien reçue. Nous vous appelons pour confirmer la livraison.
            </p>
            <p className="note">Vous payez en espèces au livreur.</p>
            <button className="btn primary" onClick={onClose}>Continuer mes achats</button>
          </div>
        ) : cart.lines.length === 0 ? (
          <div className="d-body">
            <p className="note">Votre panier est vide. Ajoutez un bijou depuis la collection.</p>
          </div>
        ) : step === "cart" ? (
          <>
            <div className="d-body">
              {cart.lines.map(({ id, qty, product }) => (
                <div className="line" key={id}>
                  <div className="pic" style={{ background: `var(--t${(id % 4) + 1})` }}>
                    <Picture product={product} />
                  </div>
                  <div>
                    <h4>{product.name}</h4>
                    <small>{FINISH_LABEL[product.finish]} · {dt(product.price)}</small>
                    <div className="qty">
                      <button onClick={() => cart.change(id, -1)} aria-label="Retirer un exemplaire">−</button>
                      <span>{qty}</span>
                      <button onClick={() => cart.change(id, 1)} aria-label="Ajouter un exemplaire">+</button>
                    </div>
                  </div>
                  <span className="lt">{dt(product.price * qty)}</span>
                </div>
              ))}
              <div className="ship">
                {left > 0 ? <>Plus que <b>{dt(left)}</b> pour la livraison offerte.</> : "Livraison offerte."}
                <div className="bar"><i style={{ width: `${Math.min(100, (cart.subtotal / shipping.freeFrom) * 100)}%` }} /></div>
              </div>
            </div>
            <div className="d-foot">
              <div className="row"><span>Sous-total</span><span>{dt(cart.subtotal)}</span></div>
              <div className="row"><span>Livraison</span><span>{cart.fee ? dt(cart.fee) : "Offerte"}</span></div>
              <div className="row tot"><span>Total à payer</span><span>{dt(cart.total)}</span></div>
              <button className="btn primary" onClick={() => setStep("checkout")}>Commander</button>
            </div>
          </>
        ) : (
          <form className="order-form" onSubmit={submit}>
            <div className="d-body">
              <button type="button" className="back" onClick={() => setStep("cart")}>← Retour au panier</button>
              <div className="order">
                <label htmlFor="name">Nom et prénom
                  <input id="name" value={form.name} onChange={set("name")} required maxLength={80} autoComplete="name" />
                </label>
                <label htmlFor="phone">Téléphone
                  <input id="phone" value={form.phone} onChange={set("phone")} required inputMode="tel" maxLength={20} autoComplete="tel" />
                </label>
                <label htmlFor="city">Ville
                  <input id="city" value={form.city} onChange={set("city")} required maxLength={60} autoComplete="address-level2" />
                </label>
                <label htmlFor="address">Adresse
                  <input id="address" value={form.address} onChange={set("address")} required maxLength={160} autoComplete="street-address" />
                </label>
                {error && <p className="note" role="alert" style={{ color: "var(--accent)" }}>{error}</p>}
              </div>
            </div>
            <div className="d-foot">
              <div className="row tot"><span>Total à payer</span><span>{dt(cart.total)}</span></div>
              <p className="note">Paiement en espèces à la livraison.</p>
              <button className="btn primary" type="submit" disabled={sending}>
                {sending ? "Envoi…" : "Confirmer la commande"}
              </button>
            </div>
          </form>
        )}
      </aside>
    </>
  );
}
