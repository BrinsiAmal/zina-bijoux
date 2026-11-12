# Zina Bijoux

Boutique en ligne de faux bijoux, en français. Frontend React (Vite), serveur Node.js (Express).

## Démarrer (Node 18 ou plus récent)

```bash
npm run install:all        # installe le serveur et le client
npm run dev                # site sur http://localhost:5173, API sur le port 3001
```

## Mettre en ligne

```bash
npm run build              # compile le site React dans client/dist
ADMIN_TOKEN=votre-mot-de-passe npm start    # http://localhost:3001
```

Express sert alors le site et l'API sur un seul port. Copiez `.env.example` pour la configuration.

## Ce que fait le site

- Collection filtrable (catégorie, finition) et triable par prix.
- Panier conservé dans le navigateur, livraison 7 DT, offerte dès 120 DT.
- Commande en paiement à la livraison. Le serveur recalcule le total avec ses propres prix.
- Commandes enregistrées dans `server/data/orders.json`.
- Espace boutique : ouvrez `/#admin`, saisissez `ADMIN_TOKEN`, suivez et changez le statut des commandes.

## Où modifier

| Quoi | Où |
| --- | --- |
| Produits, prix, photos | `server/data/products.json` et `client/public/img/` |
| Livraison (7 DT, 120 DT) | `server/app.js` (`SHIPPING_FEE`, `FREE_SHIPPING_FROM`) |
| Nom, contacts, textes | `client/src/components/Sections.jsx` |
| Couleurs et typographie | `client/src/styles.css` (variables en haut) |

## Tests

```bash
npm test                   # 5 tests de l'API
```

## Avant la vraie mise en ligne

- Remplacez les photos par les vôtres (celles fournies viennent d'autres boutiques).
- Mettez vos vrais contacts dans `Sections.jsx`.
- Définissez un `ADMIN_TOKEN` long. Sans lui, l'espace boutique est fermé.
- Sauvegardez `server/data/orders.json`. Pour beaucoup de commandes, passez à une base de données.
