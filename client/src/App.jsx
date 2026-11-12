import { useEffect, useState } from "react";
import { useCart } from "./useCart.js";
import { Header, Hero, Ticker, Services, Contact } from "./components/Sections.jsx";
import Collection from "./components/Collection.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import Admin from "./components/Admin.jsx";

const NO_PRODUCTS = [];
const DEFAULT_SHIPPING = { fee: 7, freeFrom: 120 };

export default function App() {
  const [products, setProducts] = useState(NO_PRODUCTS);
  const [shipping, setShipping] = useState(DEFAULT_SHIPPING);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [cartOpen, setCartOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(location.hash === "#admin");

  useEffect(() => {
    const onHash = () => setIsAdmin(location.hash === "#admin");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        setProducts(d.products);
        setShipping(d.shipping);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  const cart = useCart(products, shipping);
  const closeCart = () => setCartOpen(false);

  if (isAdmin) return <Admin />;

  return (
    <>
      <Header count={cart.count} onOpenCart={() => setCartOpen(true)} />
      <main className="wrap" id="haut">
        {status === "ready" && <Hero products={products} />}
      </main>
      <Ticker />
      <div className="wrap">
        {status === "loading" && <p className="empty">Chargement de la collection…</p>}
        {status === "error" && (
          <p className="empty" role="alert">La collection ne se charge pas. Vérifiez que le serveur est lancé, puis rechargez la page.</p>
        )}
        {status === "ready" && (
          <Collection products={products} onAdd={(id) => { cart.add(id); setCartOpen(true); }} />
        )}
        <Services shipping={shipping} />
        <Contact />
        <footer><span>© 2026 Zina Bijoux</span><span>Fait à Tunis</span></footer>
      </div>
      <CartDrawer open={cartOpen} onClose={closeCart} cart={cart} shipping={shipping} />
    </>
  );
}
