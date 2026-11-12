import express from "express";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

export const FREE_SHIPPING_FROM = 120;
export const SHIPPING_FEE = 7;

export function createApp({ dataDir = path.join(here, "data"), adminToken = process.env.ADMIN_TOKEN } = {}) {
  const productsFile = path.join(dataDir, "products.json");
  const ordersFile = path.join(dataDir, "orders.json");

  const readJson = (file, fallback) => {
    try {
      return JSON.parse(fs.readFileSync(file, "utf8"));
    } catch {
      return fallback;
    }
  };
  // Écriture atomique : on écrit un fichier temporaire puis on le renomme.
  const writeJson = (file, data) => {
    const tmp = `${file}.${process.pid}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
    fs.renameSync(tmp, file);
  };

  const app = express();
  app.disable("x-powered-by");
  app.use(express.json({ limit: "20kb" }));

  app.get("/api/products", (_req, res) => {
    res.json({
      products: readJson(productsFile, []),
      shipping: { fee: SHIPPING_FEE, freeFrom: FREE_SHIPPING_FROM },
    });
  });

  const clean = (v, max) => String(v ?? "").trim().slice(0, max);

  app.post("/api/orders", (req, res) => {
    const { items, customer } = req.body ?? {};
    const products = readJson(productsFile, []);

    if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
      return res.status(400).json({ error: "Le panier est vide." });
    }
    const lines = [];
    for (const it of items) {
      const product = products.find((p) => p.id === it?.id);
      const qty = Number(it?.qty);
      if (!product || !Number.isInteger(qty) || qty < 1 || qty > 20) {
        return res.status(400).json({ error: "Un article du panier est invalide." });
      }
      lines.push({ id: product.id, name: product.name, unitPrice: product.price, qty });
    }

    const c = {
      name: clean(customer?.name, 80),
      phone: clean(customer?.phone, 20),
      city: clean(customer?.city, 60),
      address: clean(customer?.address, 160),
    };
    if (Object.values(c).some((v) => !v)) {
      return res.status(400).json({ error: "Merci de remplir tous les champs." });
    }
    if (!/^[+\d][\d\s().-]{6,18}$/.test(c.phone)) {
      return res.status(400).json({ error: "Le numéro de téléphone n'est pas valide." });
    }

    // Les prix viennent toujours du serveur, jamais du navigateur.
    const subtotal = lines.reduce((t, l) => t + l.unitPrice * l.qty, 0);
    const shipping = subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE;
    const order = {
      id: "ZB-" + crypto.randomBytes(3).toString("hex").toUpperCase(),
      createdAt: new Date().toISOString(),
      status: "nouvelle",
      customer: c,
      lines,
      subtotal,
      shipping,
      total: subtotal + shipping,
      payment: "à la livraison",
    };
    const orders = readJson(ordersFile, []);
    orders.push(order);
    writeJson(ordersFile, orders);
    res.status(201).json({ id: order.id, total: order.total });
  });

  const requireAdmin = (req, res, next) => {
    const sent = String(req.get("x-admin-token") ?? "");
    const ok =
      adminToken &&
      sent.length === adminToken.length &&
      crypto.timingSafeEqual(Buffer.from(sent), Buffer.from(adminToken));
    if (!ok) return res.status(401).json({ error: "Mot de passe incorrect." });
    next();
  };

  app.get("/api/orders", requireAdmin, (_req, res) => {
    res.json({ orders: readJson(ordersFile, []).reverse() });
  });

  const STATUSES = ["nouvelle", "confirmée", "expédiée", "livrée", "annulée"];
  app.patch("/api/orders/:id", requireAdmin, (req, res) => {
    const status = req.body?.status;
    if (!STATUSES.includes(status)) return res.status(400).json({ error: "Statut inconnu." });
    const orders = readJson(ordersFile, []);
    const order = orders.find((o) => o.id === req.params.id);
    if (!order) return res.status(404).json({ error: "Commande introuvable." });
    order.status = status;
    writeJson(ordersFile, orders);
    res.json(order);
  });

  app.use("/api", (_req, res) => res.status(404).json({ error: "Route inconnue." }));

  // En production, Express sert aussi le site React compilé.
  const dist = path.join(here, "..", "client", "dist");
  if (fs.existsSync(dist)) {
    app.use(express.static(dist));
    app.get("*", (_req, res) => res.sendFile(path.join(dist, "index.html")));
  }

  return app;
}
