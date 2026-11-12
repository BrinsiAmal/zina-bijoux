import { useState } from "react";
import { dt } from "./Product.jsx";

const STATUSES = ["nouvelle", "confirmée", "expédiée", "livrée", "annulée"];

export default function Admin() {
  const [token, setToken] = useState("");
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");

  async function load(e) {
    e?.preventDefault();
    setError("");
    const res = await fetch("/api/orders", { headers: { "x-admin-token": token } });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return setError(data.error || "Erreur.");
    setOrders(data.orders);
  }

  async function setStatus(id, status) {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ status }),
    });
    if (res.ok) setOrders((os) => os.map((o) => (o.id === id ? { ...o, status } : o)));
  }

  return (
    <main className="wrap admin">
      <p className="eyebrow">Espace boutique</p>
      <h1 style={{ fontSize: "2.4rem", margin: "6px 0 20px" }}>Commandes</h1>

      {!orders ? (
        <form onSubmit={load} className="admin-login">
          <label htmlFor="token" className="eyebrow">Mot de passe</label>
          <input id="token" type="password" value={token} onChange={(e) => setToken(e.target.value)} autoComplete="current-password" />
          <button className="btn primary" type="submit">Ouvrir</button>
          {error && <p role="alert" className="note" style={{ color: "var(--accent)" }}>{error}</p>}
        </form>
      ) : orders.length === 0 ? (
        <p className="note">Aucune commande pour le moment.</p>
      ) : (
        <div className="admin-list">
          {orders.map((o) => (
            <article className="admin-order" key={o.id}>
              <header>
                <b>{o.id}</b>
                <span className="note">{new Date(o.createdAt).toLocaleString("fr-FR")}</span>
                <select value={o.status} onChange={(e) => setStatus(o.id, e.target.value)} aria-label={`Statut de ${o.id}`}>
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </header>
              <p>{o.customer.name} · {o.customer.phone}</p>
              <p className="note">{o.customer.address}, {o.customer.city}</p>
              <ul>
                {o.lines.map((l) => <li key={l.id}>{l.qty} × {l.name} ({dt(l.unitPrice * l.qty)})</li>)}
              </ul>
              <p><b>Total à encaisser : {dt(o.total)}</b> <span className="note">(livraison {o.shipping ? dt(o.shipping) : "offerte"})</span></p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
