# GUIDE TECHNIQUE : DÉPLOIEMENT & GÉNÉRATION APK (LE JURISTE PRO)

Ce guide décrit les démarches pour tester, packager et installer l'application mobile **« Le Juriste Pro »** sur votre ordinateur et vos terminaux Android.

---

## 1. Test direct et immédiat sur votre ordinateur

Pour exécuter l'application sur votre PC sans aucune dépendance :
1. Rendez-vous dans le dossier du projet :
   ```text
   C:\Users\ETOILE DEPIE\Desktop\Projet application\
   ```
2. Double-cliquez simplement sur `index.html`. L'application s'ouvre dans votre navigateur par défaut (Chrome, Edge ou Firefox).
3. Toutes les fonctionnalités sont opérationnelles :
   * Progression sauvegardée automatiquement via le `localStorage`.
   * Chronomètre par question (45s, 30s, 10s, Illimité).
   * Mode Examen Blanc de 2h (100 QCM).
   * Modal de bilan avec déblocage de palier (seuil à 60% de réussite).

---

## 2. Génération de l'APK Android (3 Méthodes Gratuites)

### Méthode A : PWABuilder (Recommandée - En 2 minutes sans installation lourde)
1. Téléversez le dossier sur un hébergement web gratuit comme **GitHub Pages**, **Netlify**, ou **Vercel** (ex: `https://votre-compte.github.io/juriste-pro/`).
2. Rendez-vous sur le site officiel de Microsoft : **[https://www.pwabuilder.com/](https://www.pwabuilder.com/)**.
3. Saisissez l'URL de votre application et cliquez sur **Start**.
4. L'outil valide le `manifest.json` et le `sw.js` (déjà intégrés dans le projet).
5. Cliquez sur **« Package for Android »** puis téléchargez le fichier **`.apk`** signé ou prêt pour test !

### Méthode B : Capacitor Android (Application 100% native avec Android Studio)
Dans un terminal PowerShell avec Node.js installé :
```powershell
cd "c:\Users\ETOILE DEPIE\Desktop\Projet application"
npm init -y
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "Le Juriste Pro" "ci.juristepro.app" --web-dir "."
npx cap add android
npx cap copy
npx cap open android
```
Dans **Android Studio**, cliquez sur **Build > Build Bundle(s) / APK(s) > Build APK(s)** pour générer le binaire `app-debug.apk`.

---

## 3. Comment installer l'APK sur votre smartphone Android

1. Transférez le fichier `.apk` sur votre téléphone (via câble USB, WhatsApp Web, Google Drive ou Bluetooth).
2. Ouvrez le fichier téléchargé sur votre smartphone.
3. Si Android affiche *« Installation d'applications inconnues bloquée »*, appuyez sur **Paramètres** puis activez l'autorisation pour la source (Gestionnaire de fichiers ou Navigateur).
4. Cliquez sur **Installer**. L'application « Le Juriste Pro » s'installe avec son icône dorée dédiée.

---

## 4. Déploiement Gratuit aux Candidats (Firebase App Distribution)

Pour distribuer des versions de test facilement à un groupe d'étudiants ou de professionnels sans passer par Google Play Store :
1. Créez un compte gratuit sur [Firebase Console](https://console.firebase.google.com/).
2. Créez un projet nommé **« Le Juriste Pro CI »** et ajoutez une application Android (Package: `ci.juristepro.app`).
3. Dans le menu de gauche, rendez-vous dans **Release & Monitor > App Distribution**.
4. Glissez-déposez votre fichier `.apk`.
5. Ajoutez les adresses e-mail des testeurs (étudiants, juristes, collègues).
6. Les destinataires reçoivent instantanément un lien par e-mail leur permettant d'installer l'application en un clic sur leur smartphone.
