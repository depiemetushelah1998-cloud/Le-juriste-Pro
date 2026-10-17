# DÉPLOIEMENT NETLIFY & GÉNÉRATION APK (PWA BUILDER)

Tous vos fichiers sont prêts, testés et conformes pour un hébergement statique sur **Netlify** et la création de l'APK via **PWABuilder**.

---

## 1. Quels fichiers / dossiers devez-vous déposer sur Netlify ?

Sur votre ordinateur, ouvrez le dossier :
```text
C:\Users\ETOILE DEPIE\Desktop\Projet application
```

Vous devez déposer le contenu complet de ce dossier (ou glisser le dossier lui-même) comprenant les **7 fichiers de production essentiels** :

1. [index.html](file:///c:/Users/ETOILE%20DEPIE/Desktop/Projet%20application/index.html) *(Point d'entrée de l'application)*
2. [app.js](file:///c:/Users/ETOILE%20DEPIE/Desktop/Projet%20application/app.js) *(Moteur d'évaluation, chronomètre, persistance localStorage)*
3. [questions.js](file:///c:/Users/ETOILE%20DEPIE/Desktop/Projet%20application/questions.js) *(Banque de QCM et fondements juridiques)*
4. [style.css](file:///c:/Users/ETOILE%20DEPIE/Desktop/Projet%20application/style.css) *(Styles et composants hors-ligne)*
5. [manifest.json](file:///c:/Users/ETOILE%20DEPIE/Desktop/Projet%20application/manifest.json) *(Fiche d'identité PWA complète requise par Google & PWABuilder)*
6. [sw.js](file:///c:/Users/ETOILE%20DEPIE/Desktop/Projet%20application/sw.js) *(Service Worker pour exécution hors-ligne)*
7. [icon.svg](file:///c:/Users/ETOILE%20DEPIE/Desktop/Projet%20application/icon.svg) *(Icône officielle dorée de l'application)*
8. [_redirects](file:///c:/Users/ETOILE%20DEPIE/Desktop/Projet%20application/_redirects) *(Règle Netlify pour éviter les erreurs 404 lors du rafraîchissement)*

*(Note : les fichiers `.md` de documentation peuvent être laissés ou retirés, Netlify n'enverra que les fichiers web).*

---

## 2. Procédure Pas-à-Pas sur Netlify (Glisser-Déposer en 30 secondes)

1. Rendez-vous sur votre compte **[https://app.netlify.com/](https://app.netlify.com/)**.
2. Allez dans l'onglet **Sites** (ou **Overview**).
3. Repérez la section intitulée **« Want to deploy a new site without connecting to Git? Drag and drop your site output folder here »**.
4. Faites un **glisser-déposer** du dossier `Projet application` directement dans cette zone pointillée.
5. Netlify déploie le site instantanément et vous attribue une adresse sécurisée en HTTPS (ex : `https://vigorous-curie-xxxxxx.netlify.app`).
6. *(Optionnel)* Cliquez sur **Site configuration > Change site name** pour lui donner un nom personnalisé : ex `le-juriste-pro-ci.netlify.app`.

---

## 3. Génération de l'APK via PWA Builder

Dès que votre site est en ligne sur Netlify :

1. Ouvrez **[https://www.pwabuilder.com/](https://www.pwabuilder.com/)**.
2. Collez l'URL fournie par Netlify (ex: `https://le-juriste-pro-ci.netlify.app`).
3. Cliquez sur **Start**.
   * Le rapport PWA s'affiche avec un score vert (Manifest OK, Service Worker OK, Sécurité HTTPS OK).
4. Cliquez sur le bouton violet **« Package for Stores »** ou **« Package for Android »**.
5. Dans les options de packaging :
   * Nom de l'app : `Le Juriste Pro`
   * Package ID : `ci.juristepro.app`
6. Cliquez sur **Generate / Download Package**.
7. Vous obtenez votre archive contenant le fichier **`.apk`** signé et prêt à être installé sur n'importe quel smartphone Android !
