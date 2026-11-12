import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createApp } from "./app.js";

const products = JSON.parse(fs.readFileSync(new URL("./data/products.json", import.meta.url), "utf8"));

async function start() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "zina-"));
  fs.copyFileSync(new URL("./data/products.json", import.meta.url), path.join(dir, "products.json"));
  fs.writeFileSync(path.join(dir, "orders.json"), "[]");
  const server = createApp({ dataDir: dir, adminToken: "secret" }).listen(0);
  await new Promise((r) => server.once("listening", r));
  const base = `http://localhost:${server.address().port}`;
  return { base, close: () => server.close() };
}
const customer = { name: "Amal B.", phone: "+216 22 123 456", city: "Tunis", address: "12 rue de Marseille" };
const post = (url, body) =>
  fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });

test("liste les produits", async () => {
  const s = await start();
  const data = await (await fetch(`${s.base}/api/products`)).json();
  assert.equal(data.products.length, 16);
  assert.equal(data.shipping.freeFrom, 120);
  s.close();
});

test("calcule le total côté serveur avec la livraison", async () => {
  const s = await start();
  const price = products[0].price;
  const res = await post(`${s.base}/api/orders`, { items: [{ id: 1, qty: 2, price: 1 }], customer });
  assert.equal(res.status, 201);
  assert.equal((await res.json()).total, price * 2 + 7);
  s.close();
});

test("livraison offerte à partir de 120 DT", async () => {
  const s = await start();
  const res = await post(`${s.base}/api/orders`, { items: [{ id: 3, qty: 3 }], customer }); // 3 x 42 = 126
  assert.equal((await res.json()).total, 126);
  s.close();
});

test("refuse un panier vide, un article inconnu et un téléphone invalide", async () => {
  const s = await start();
  assert.equal((await post(`${s.base}/api/orders`, { items: [], customer })).status, 400);
  assert.equal((await post(`${s.base}/api/orders`, { items: [{ id: 999, qty: 1 }], customer })).status, 400);
  assert.equal((await post(`${s.base}/api/orders`, { items: [{ id: 1, qty: 1 }], customer: { ...customer, phone: "abc" } })).status, 400);
  s.close();
});

test("l'espace admin demande le mot de passe", async () => {
  const s = await start();
  await post(`${s.base}/api/orders`, { items: [{ id: 1, qty: 1 }], customer });
  assert.equal((await fetch(`${s.base}/api/orders`)).status, 401);
  const ok = await fetch(`${s.base}/api/orders`, { headers: { "x-admin-token": "secret" } });
  const { orders } = await ok.json();
  assert.equal(orders.length, 1);
  const patch = await fetch(`${s.base}/api/orders/${orders[0].id}`, {
    method: "PATCH",
    headers: { "content-type": "application/json", "x-admin-token": "secret" },
    body: JSON.stringify({ status: "expédiée" }),
  });
  assert.equal((await patch.json()).status, "expédiée");
  s.close();
});
