# Plantify Garden

Boutique de plantes construite avec Next.js, Better Auth, Prisma ORM 7 et PostgreSQL.

## Développement local

1. Installer les dépendances avec `npm install`.
2. Créer un fichier `.env` contenant `DATABASE_URL`. Pour la base locale de
   `docker-compose.yml`, utiliser :

   ```env
   DATABASE_URL="postgresql://plantify:plantify_dev_password@localhost:5432/plantify?schema=public"
   ```

3. Démarrer PostgreSQL avec `docker compose up -d`.
4. Appliquer les migrations, créer le client et synchroniser les images :

   ```bash
   npm run db:migrate
   npm run db:generate
   npm run db:seed
   npm run images:sync
   ```

   Les 60 photos de plantes sont déjà stockées dans `public/images/products/`.
   `images:sync` met à jour uniquement leurs chemins en base, sans modifier les
   prix ni les stocks.

5. Démarrer Next.js avec `npm run dev`.

## Compte administrateur

Créer un compte depuis `/register`, retrouver son identifiant dans Prisma
Studio (`npx prisma studio`), puis le promouvoir explicitement depuis un
environnement disposant de `DATABASE_URL` :

```bash
npm run admin:promote -- identifiant-utilisateur
```

Cette opération donne accès à `/admin` et aux API d’administration des produits.
Le rôle n’est pas modifiable depuis l’inscription publique.

## Fonctionnalités

- La page d’accueil affiche directement le catalogue : 60 produits, 12 par page, avec une photo distincte par produit. Les sources et licences sont listées sur `/image-credits`.
- Catalogue public, panier invité et connexion/inscription.
- Fusion du panier invité avec le panier du compte lors de la connexion.
- Commande sans paiement en ligne ; le stock est vérifié et décrémenté dans une
  transaction à la création de la commande.
- Administration des produits, prix, catégories et stocks.
