# Zina Bijoux

Boutique en ligne de faux bijoux pour la Tunisie : colliers, boucles d'oreilles, bagues et bracelets. Les clientes parcourent la collection, remplissent un panier et commandent avec paiement à la livraison, sans créer de compte. La boutique suit les commandes dans un espace protégé par mot de passe.

Projet full stack : **React** (Vite) pour le site, **Node.js** (Express) pour le serveur.

<!-- Ajoutez ici une capture d'écran : ![Aperçu du site](docs/apercu.png) -->

## Fonctionnalités

- Collection filtrable par catégorie et par finition (doré ou argenté), triable par prix
- Panier conservé dans le navigateur, avec une barre de progression vers la livraison offerte
- Commande sans compte : nom, téléphone, ville, adresse
- Paiement en espèces à la livraison
- Prix recalculés par le serveur à chaque commande (jamais pris dans le navigateur)
- Espace boutique (`/#admin`) : liste des commandes et changement de statut (nouvelle, confirmée, expédiée, livrée, annulée)
- Design moderne et dynamique, adapté au mobile, avec mode clair et sombre automatique
- Accessibilité : navigation au clavier, contrastes lisibles, animations réduites sur demande

## Technologies

| Partie | Outils |
| --- | --- |
| Site | React, Vite |
| Serveur | Node.js, Express |
| Données | fichiers JSON |
| Tests | module de test intégré à Node.js |

## Structure du projet

```
zina-bijoux/
├── client/               # site React (Vite)
│   ├── public/img/       # photos des produits
│   └── src/
│       ├── components/   # collection, panier, espace boutique...
│       ├── App.jsx
│       ├── useCart.js    # logique du panier
│       └── styles.css
├── server/
│   ├── app.js            # interface du serveur (produits, commandes)
│   ├── app.test.js       # tests automatiques
│   ├── index.js          # démarrage
│   └── data/             # products.json, orders.json
└── package.json
```

## Installation

Il faut [Node.js](https://nodejs.org) 18 ou plus récent.

```bash
git clone https://github.com/VOTRE-NOM/zina-bijoux.git
cd zina-bijoux
npm run install:all
```

## Lancer en développement

```bash
npm run dev
```

Le site s'ouvre sur http://localhost:5173 et le serveur tourne sur le port 3001.

Pour tester l'espace boutique, définissez un mot de passe avant de lancer :

```bash
# macOS / Linux
ADMIN_TOKEN=monmotdepasse npm run dev

# Windows PowerShell
$env:ADMIN_TOKEN="monmotdepasse"
npm run dev
```

Puis ouvrez http://localhost:5173/#admin. Sans `ADMIN_TOKEN`, l'espace boutique reste fermé.

## Mettre en production

```bash
npm run build
ADMIN_TOKEN=un-mot-de-passe-long npm start
```

Express sert alors le site et le serveur sur un seul port (3001 par défaut, modifiable avec `PORT`).

## Tests

```bash
npm test
```

Les tests vérifient la liste des produits, le calcul du total côté serveur, la livraison offerte, le refus des commandes invalides et la protection de l'espace boutique.

## Personnaliser

| Quoi | Où |
| --- | --- |
| Produits, prix, photos | `server/data/products.json` et `client/public/img/` |
| Frais de livraison et seuil de livraison offerte | `server/app.js` |
| Nom, contacts, textes | `client/src/components/Sections.jsx` |
| Couleurs et polices | `client/src/styles.css` |

## Limites actuelles

- Les commandes sont stockées dans un fichier JSON : suffisant pour un faible volume, à remplacer par une base de données ensuite.
- L'espace boutique utilise un mot de passe unique, sans comptes utilisateurs.
- Pas de paiement en ligne, de recherche, ni de newsletter.
- Le site est en français uniquement.

## Idées pour la suite

- Page d'administration pour ajouter et modifier les produits
- Base de données (SQLite ou MongoDB)
- Version en arabe
- Notification des nouvelles commandes (WhatsApp ou e-mail)

## Photos

Les photos fournies avec le projet sont des exemples. Remplacez-les par vos propres photos ou par des images dont vous détenez les droits avant toute publication.

## Licence

Projet personnel. Ajoutez une licence (par exemple MIT) si vous souhaitez autoriser la réutilisation du code.
