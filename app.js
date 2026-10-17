// ==========================================================================
// APP LOGIC: LE JURISTE PRO
// Persistance localStorage, Gestion du Chrono, Évaluation QCM,
// Notifications de Révision Programmées, Forum Communautaire & Fiches
// ==========================================================================

const STORAGE_KEY_LEVELS     = "juriste_pro_module_levels_v2";
const STORAGE_KEY_STATS      = "juriste_pro_user_stats_v2";
const STORAGE_KEY_COMMUNITY  = "juriste_pro_community_posts_v1";
const STORAGE_KEY_REMINDER   = "juriste_pro_reminder_time_v1";
const STORAGE_KEY_SUBSCRIPTION = "juriste_pro_subscription_v1";
const STORAGE_KEY_SUPPORT_DISMISS = "juriste_pro_support_dismissed_until_v1";
const STORAGE_KEY_POSITIONS  = "juriste_pro_quiz_positions_v1";



// ── Supabase Configuration ──────────────────────────────────────────────────
const SUPABASE_URL      = "https://zjrwwwunbtqncsbhzvty.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_SYIQJ7shUYr6tySMWGeFyg_i10e7Dmr";

let supabaseClient = null;
let currentUser    = null;
let currentProfile = null;

// Initialisation du client Supabase
if (typeof supabase !== "undefined") {
  try {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("[Supabase] Client initialisé avec succès :", SUPABASE_URL);
  } catch (err) {
    console.warn("[Supabase] Erreur d'initialisation :", err);
  }
} else {
  console.warn("[Supabase] Le SDK Supabase n'est pas encore injecté ou disponible.");
}

// ── CinetPay Configuration ──────────────────────────────────────────────────
// Si vous n'avez pas encore vos clés, laissez SIMULATION_MODE à true pour tester librement.
// Passez à false dès que vous avez vos clés de production CinetPay.
const SIMULATION_MODE        = true; 

const CINETPAY_CONFIG = {
  apikey:      'VOTRE_API_KEY_CINETPAY',   // ← Remplacer par votre vraie clé
  site_id:     'VOTRE_SITE_ID',            // ← Remplacer par votre vrai Site ID
  currency:    'XOF',
  description: 'Abonnement Mensuel - Le Juriste Pro',
  channels:    'ALL',
  lang:        'fr'
};
const MONTANT_MENSUEL       = 1000; // FCFA
const FREE_QUESTIONS_LIMIT  = 5;    // Questions gratuites avant paywall




// États globaux
let userModuleLevels = {
  CIV: 1,
  PEN: 1,
  OHA: 1,
  ORG: 1,
  ADM: 1,
  NUM: 1
};

let userStats = {
  totalAnswered: 0,
  correctAnswered: 0,
  examsCompleted: 0
};

let communityPosts = [
  {
    id: 1,
    auteur: "Kouamé Jean (Étudiant M1 Droit)",
    date: "Aujourd'hui à 08:30",
    sujet: "Réforme du divorce 2022 : altération définitive",
    message: "Bonjour à tous, pour l'altération définitive du lien conjugal, la loi de 2022 exige bien un délai continu d'au moins 1 an de cessation de vie commune. Les QCM du Juriste Pro m'ont bien éclairé là-dessus !",
    likes: 12
  },
  {
    id: 2,
    auteur: "Me Touré A. (Professionnel en activité)",
    date: "Hier à 19:15",
    sujet: "Conseil pour le chrono 45s",
    message: "Très bonne idée ce mode réflexe de 45 secondes par question. Quand on rentre du travail le soir, faire deux paliers de 50 questions permet de garder le rythme sans s'épuiser.",
    likes: 19
  },
  {
    id: 3,
    auteur: "Soro Mariam (Licence 3 Droit Public)",
    date: "Il y a 2 jours",
    sujet: "Conseil d'État et Recours pour excès de pouvoir",
    message: "N'oubliez pas que le recours administratif préalable de 2 mois est strictement obligatoire avant de saisir le Conseil d'État ivoirien. Bonne révision à tous !",
    likes: 15
  }
];

let perQuestionTimerLimit = 45;
let questionTimerInterval = null;
let perQuestionTimeRemaining = 45;
let examTimerInterval = null;
let isExamMode = false;

let currentQuestions = [];
let activeQuestionIndex = 0;
let selectedOption = null;
let currentSubject = null;
let currentLevel = 1;
let sessionCorrectCount = 0;

let savedQuizPositions = {}; // Format: { "CIV_L1": 20, "PEN_L2": 5, ... }

// ── Module d'Interaction Vocale (TTS & STT ultra-rapide) ─────────────────────
let isVoiceSpeechActive = true;       // Synthèse vocale auto
let isVoiceListeningActive = false;   // Reconnaissance vocale micro
let speechRecognitionInstance = null;
let synthVoiceInstance = null;
let activeUtterance = null;
let isRecognizingSpeech = false;



function loadStoredProgress() {
  try {
    const savedLevels = localStorage.getItem(STORAGE_KEY_LEVELS);
    if (savedLevels) {
      userModuleLevels = Object.assign(userModuleLevels, JSON.parse(savedLevels));
    }
    const savedStats = localStorage.getItem(STORAGE_KEY_STATS);
    if (savedStats) {
      userStats = Object.assign(userStats, JSON.parse(savedStats));
    }
    const savedCommunity = localStorage.getItem(STORAGE_KEY_COMMUNITY);
    if (savedCommunity) {
      communityPosts = JSON.parse(savedCommunity);
    }
    const savedPos = localStorage.getItem(STORAGE_KEY_POSITIONS);
    if (savedPos) {
      savedQuizPositions = Object.assign(savedQuizPositions, JSON.parse(savedPos));
    }
  } catch (e) {
    console.warn("Impossible d'accéder au localStorage :", e);
  }
}

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY_LEVELS, JSON.stringify(userModuleLevels));
    localStorage.setItem(STORAGE_KEY_STATS,  JSON.stringify(userStats));
    localStorage.setItem(STORAGE_KEY_POSITIONS, JSON.stringify(savedQuizPositions));
  } catch (e) {
    console.warn("Échec de la sauvegarde localStorage :", e);
  }

  // Synchronisation Supabase en arrière-plan si connecté
  if (currentUser && supabaseClient) {
    supabaseClient
      .from('profiles')
      .update({
        module_levels: userModuleLevels,
        user_stats: userStats,
        saved_quiz_positions: savedQuizPositions
      })
      .eq('id', currentUser.id)
      .then(({ error }) => {
        if (error) console.warn("[Supabase] Sauvegarde progression :", error);
      });
  }
}

/**
 * Enregistre en temps réel l'index de la question courante pour un module et un niveau donnés.
 * Persiste immédiatement dans le localStorage et dans Supabase.
 */
function saveQuizPosition(subjectId, level, questionIndex) {
  if (!subjectId) return;
  const key = `${subjectId}_L${level}`;
  savedQuizPositions[key] = questionIndex;

  // 1. Sauvegarde instantanée en LocalStorage
  try {
    localStorage.setItem(STORAGE_KEY_POSITIONS, JSON.stringify(savedQuizPositions));
  } catch (e) {
    console.warn("Erreur stockage position quiz :", e);
  }

  // 2. Synchronisation Supabase immédiate en temps réel si connecté
  if (currentUser && supabaseClient) {
    supabaseClient
      .from('profiles')
      .update({ saved_quiz_positions: savedQuizPositions })
      .eq('id', currentUser.id)
      .then(({ error }) => {
        if (error) console.warn("[Supabase] Erreur synchronisation position quiz :", error);
      });
  }
}


// ── Gestion de l'authentification & Profils Supabase ───────────────────────

let authCurrentMode = 'login'; // 'login' ou 'signup'

function openAuthModal(mode = 'login') {
  authCurrentMode = mode;
  switchAuthTab(mode);
  openModal('modal-auth');
}

function switchAuthTab(mode) {
  authCurrentMode = mode;
  const loginTab = document.getElementById('auth-tab-login');
  const signupTab = document.getElementById('auth-tab-signup');
  const submitText = document.getElementById('auth-submit-text');
  const errorMsg = document.getElementById('auth-error-msg');
  const successMsg = document.getElementById('auth-success-msg');

  if (errorMsg) errorMsg.classList.add('hidden');
  if (successMsg) successMsg.classList.add('hidden');

  if (mode === 'login') {
    if (loginTab) {
      loginTab.className = "py-2 text-xs font-bold rounded-lg bg-amber-500 text-slate-950 transition";
    }
    if (signupTab) {
      signupTab.className = "py-2 text-xs font-bold rounded-lg text-slate-400 hover:text-white transition";
    }
    if (submitText) submitText.innerText = "Se connecter";
  } else {
    if (signupTab) {
      signupTab.className = "py-2 text-xs font-bold rounded-lg bg-amber-500 text-slate-950 transition";
    }
    if (loginTab) {
      loginTab.className = "py-2 text-xs font-bold rounded-lg text-slate-400 hover:text-white transition";
    }
    if (submitText) submitText.innerText = "Créer mon compte";
  }
}

async function handleAuthSubmit(event) {
  event.preventDefault();
  const emailInput = document.getElementById('auth-email');
  const passInput  = document.getElementById('auth-password');
  const errorMsg   = document.getElementById('auth-error-msg');
  const successMsg = document.getElementById('auth-success-msg');
  const submitBtn  = document.getElementById('auth-submit-btn');

  if (errorMsg) errorMsg.classList.add('hidden');
  if (successMsg) successMsg.classList.add('hidden');

  const email = emailInput ? emailInput.value.trim() : "";
  const password = passInput ? passInput.value : "";

  if (!email || !password) return;

  // Fallback si Supabase n'est pas encore lié à de vraies clés
  if (!supabaseClient) {
    if (errorMsg) {
      errorMsg.innerHTML = "<strong>Configuration requise :</strong> Veuillez renseigner <code>SUPABASE_URL</code> et <code>SUPABASE_ANON_KEY</code> dans <code>app.js</code> pour utiliser l'authentification en ligne.";
      errorMsg.classList.remove('hidden');
    }
    return;
  }

  submitBtn.disabled = true;
  submitBtn.classList.add('opacity-70');

  try {
    if (authCurrentMode === 'signup') {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password
      });
      if (error) throw error;

      if (successMsg) {
        successMsg.innerText = "Compte créé avec succès ! " + (data.user?.identities?.length === 0 ? "Cet e-mail existe déjà." : "Connexion en cours...");
        successMsg.classList.remove('hidden');
      }

      await checkSupabaseSession();
      setTimeout(() => closeModal('modal-auth'), 1200);
    } else {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;

      if (successMsg) {
        successMsg.innerText = "Connexion réussie !";
        successMsg.classList.remove('hidden');
      }

      await checkSupabaseSession();
      setTimeout(() => closeModal('modal-auth'), 800);
    }
  } catch (err) {
    console.error("[Auth Error]", err);
    if (errorMsg) {
      errorMsg.innerText = err.message || "Une erreur est survenue lors de l'authentification.";
      errorMsg.classList.remove('hidden');
    }
  } finally {
    submitBtn.disabled = false;
    submitBtn.classList.remove('opacity-70');
  }
}

async function handleSignOut() {
  if (supabaseClient) {
    await supabaseClient.auth.signOut();
  }
  currentUser = null;
  currentProfile = null;
  updateAuthUI();
  alert("Vous êtes maintenant déconnecté.");
}

async function checkSupabaseSession() {
  if (!supabaseClient) return;

  try {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session?.user) {
      currentUser = session.user;
      await fetchUserProfile(currentUser.id, currentUser.email);
    } else {
      currentUser = null;
      currentProfile = null;
    }
    updateAuthUI();
  } catch (err) {
    console.warn("[Supabase] Vérification de session impossible :", err);
  }
}

async function fetchUserProfile(userId, userEmail) {
  if (!supabaseClient || !userId) return;

  try {
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('id, email, subscription_expires_at, module_levels, saved_quiz_positions, user_stats')
      .eq('id', userId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.warn("[Supabase] Erreur lecture profil :", error);
    }

    if (data) {
      currentProfile = data;
      // Fusionner les données distantes Supabase avec les données locales
      if (data.module_levels && Object.keys(data.module_levels).length > 0) {
        userModuleLevels = Object.assign({}, userModuleLevels, data.module_levels);
      }
      if (data.saved_quiz_positions && Object.keys(data.saved_quiz_positions).length > 0) {
        savedQuizPositions = Object.assign({}, savedQuizPositions, data.saved_quiz_positions);
      }
      if (data.user_stats) {
        userStats = Object.assign({}, userStats, data.user_stats);
      }
      // Sauvegarder localement pour la continuité hors-ligne
      saveProgress();
      renderDashboardModules();
      updateStatsDisplay();
    } else {
      // Si la table profiles n'a pas de ligne pour l'utilisateur, on l'initialise
      const { data: inserted, error: insertErr } = await supabaseClient
        .from('profiles')
        .insert([{
          id: userId,
          email: userEmail,
          subscription_expires_at: null,
          module_levels: userModuleLevels,
          saved_quiz_positions: savedQuizPositions,
          user_stats: userStats
        }])
        .select()
        .single();
      if (!insertErr) {
        currentProfile = inserted;
      }
    }
  } catch (e) {
    console.warn("[Supabase] Erreur fetchUserProfile :", e);
  }
}


function updateAuthUI() {
  const btnOpenAuth = document.getElementById('btn-open-auth');
  const userLoggedBox = document.getElementById('user-logged-box');
  const userDisplayEmail = document.getElementById('user-display-email');
  const userSubBadge = document.getElementById('user-sub-badge');

  if (currentUser) {
    if (btnOpenAuth) btnOpenAuth.classList.add('hidden');
    if (userLoggedBox) {
      userLoggedBox.classList.remove('hidden');
      userLoggedBox.classList.add('flex');
    }
    if (userDisplayEmail) {
      userDisplayEmail.innerText = currentUser.email;
    }
    if (userSubBadge) {
      const active = isSubscribedSync();
      if (active) {
        userSubBadge.innerText = "PRO (Actif)";
        userSubBadge.className = "text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40";
      } else {
        userSubBadge.innerText = "Gratuit";
        userSubBadge.className = "text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700";
      }
    }
  } else {
    if (btnOpenAuth) btnOpenAuth.classList.remove('hidden');
    if (userLoggedBox) {
      userLoggedBox.classList.add('hidden');
      userLoggedBox.classList.remove('flex');
    }
  }
}

// ── Gestion de l'abonnement & Vérification Supabase ─────────────────────────

/**
 * Vérification synchrone rapide (mémoire ou localStorage de secours)
 */
function isSubscribedSync() {
  if (currentProfile && currentProfile.subscription_expires_at) {
    const expTime = new Date(currentProfile.subscription_expires_at).getTime();
    if (Date.now() < expTime) return true;
  }
  // Secours si Supabase non configuré ou hors-ligne
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY_SUBSCRIPTION));
    if (data && data.expiry && Date.now() < data.expiry) return true;
  } catch (e) {}
  return false;
}

/**
 * Interroge Supabase pour vérifier en temps réel si l'abonnement est actif.
 */
async function isUserSubscribedAsync() {
  if (currentUser && supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('profiles')
        .select('subscription_expires_at')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (!error && data && data.subscription_expires_at) {
        const expTime = new Date(data.subscription_expires_at).getTime();
        currentProfile = currentProfile || {};
        currentProfile.subscription_expires_at = data.subscription_expires_at;
        updateAuthUI();
        return Date.now() < expTime;
      }
    } catch (err) {
      console.warn("[Supabase] Erreur de vérification abonnement :", err);
    }
  }
  return isSubscribedSync();
}

/**
 * Alias synchrone
 */
function isUserSubscribed() {
  return isSubscribedSync();
}

/**
 * Active l'abonnement pour `durationDays` jours et met à jour la table Supabase `profiles`.
 */
async function activateSubscription(durationDays = 30) {
  const expiryDate = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);
  const expiryIso  = expiryDate.toISOString();

  // 1. Sauvegarde locale immédiate de sécurité
  try {
    localStorage.setItem(STORAGE_KEY_SUBSCRIPTION, JSON.stringify({ expiry: expiryDate.getTime() }));
  } catch (e) {
    console.warn("Échec de l'enregistrement de l'abonnement en local :", e);
  }

  // 2. Mise à jour de la table Supabase `profiles`
  if (currentUser && supabaseClient) {
    try {
      const { error } = await supabaseClient
        .from('profiles')
        .update({ subscription_expires_at: expiryIso })
        .eq('id', currentUser.id);

      if (error) {
        console.error("[Supabase] Erreur mise à jour subscription_expires_at :", error);
      } else {
        console.log("[Supabase] Abonnement prolongé de 30 jours pour :", currentUser.email);
        if (currentProfile) currentProfile.subscription_expires_at = expiryIso;
      }
    } catch (err) {
      console.warn("[Supabase] Erreur lors de l'enregistrement de l'abonnement :", err);
    }
  }

  updateAuthUI();
}


/**
 * Affiche la modale paywall avec titre et message personnalisés.
 * Crée dynamiquement la modale si elle n'existe pas encore dans le DOM.
 */
function showPaywallModal(titre, message) {
  // Réutiliser ou créer la modale
  let modal = document.getElementById('modal-paywall');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-paywall';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm';
    modal.innerHTML = `
      <div class="bg-slate-900 border border-amber-500/30 rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl text-center animate-fade-in">
        <!-- Icône -->
        <div class="w-16 h-16 mx-auto mb-5 rounded-2xl bg-amber-500/15 border border-amber-500/30
                    flex items-center justify-center text-3xl text-amber-400">
          <i class="fa-solid fa-crown"></i>
        </div>
        <!-- Titre -->
        <h2 id="paywall-title" class="text-xl font-bold font-serif-title text-amber-300 mb-2"></h2>
        <!-- Message -->
        <p  id="paywall-message" class="text-sm text-slate-300 leading-relaxed mb-6"></p>
        <!-- Prix -->
        <div class="inline-flex items-baseline gap-1 bg-amber-500/10 border border-amber-500/20
                    rounded-2xl px-5 py-2 mb-6">
          <span class="text-3xl font-black text-amber-400">${MONTANT_MENSUEL.toLocaleString()}</span>
          <span class="text-sm font-bold text-amber-300">FCFA</span>
          <span class="text-xs text-slate-400 ml-1">/ mois</span>
        </div>
        <!-- Avantages -->
        <ul class="text-left text-xs text-slate-300 space-y-1.5 mb-6 bg-slate-800/60 rounded-xl p-4">
          <li><i class="fa-solid fa-check text-emerald-400 mr-2"></i>Accès illimité à tous les QCM</li>
          <li><i class="fa-solid fa-check text-emerald-400 mr-2"></i>Toutes les matières & tous les niveaux</li>
          <li><i class="fa-solid fa-check text-emerald-400 mr-2"></i>Examens blancs complets</li>
          <li><i class="fa-solid fa-check text-emerald-400 mr-2"></i>Fiches de synthèse & codes annotés</li>
        </ul>
        <!-- Boutons -->
        <button onclick="openSubscriptionCheckout()"
                class="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold
                       py-3.5 rounded-2xl transition mb-3 flex items-center justify-center gap-2">
          <i class="fa-solid fa-lock-open"></i>
          S'abonner maintenant — ${MONTANT_MENSUEL.toLocaleString()} FCFA/mois
        </button>
        <button onclick="document.getElementById('modal-paywall').classList.add('hidden')"
                class="w-full text-slate-400 hover:text-slate-200 text-sm py-2 transition">
          Continuer plus tard
        </button>
      </div>
    `;
    document.body.appendChild(modal);
  }

  // Injecter le contenu dynamique
  document.getElementById('paywall-title').textContent   = titre;
  document.getElementById('paywall-message').textContent = message;
  modal.classList.remove('hidden');
}

function updateStatsDisplay() {
  const statBox = document.getElementById("stat-answered-display");
  if (statBox) {
    const accuracy = userStats.totalAnswered > 0 
      ? Math.round((userStats.correctAnswered / userStats.totalAnswered) * 100) 
      : 0;
    statBox.innerText = `${userStats.correctAnswered}/${userStats.totalAnswered} (${accuracy}%)`;
  }
}

// Configuration du chronomètre
function setTimerSetting(seconds) {
  perQuestionTimerLimit = seconds;

  [45, 30, 10, 0].forEach(val => {
    const btn = document.getElementById(`timer-opt-${val}`);
    if (btn) {
      if (val === seconds) {
        btn.className = "px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition bg-amber-500 text-slate-950 shadow";
      } else {
        btn.className = "px-3.5 py-1.5 rounded-lg text-xs font-extrabold text-slate-400 hover:text-white transition";
      }
    }
  });

  const desc = document.getElementById("lbl-timer-setting-desc");
  if (desc) {
    desc.innerText = seconds === 0 ? "Illimité" : `${seconds} secondes`;
  }

  const statDisplay = document.getElementById("stat-timer-display");
  if (statDisplay) {
    statDisplay.innerText = seconds === 0 ? "Illimité" : `${seconds} Secs`;
  }
}

// Affichage de la grille des matières
function renderDashboardModules() {
  const container = document.getElementById("modules-matrix");
  if (!container) return;

  container.innerHTML = MODULES_DATA.map(m => {
    const maxLevel = Math.ceil(m.quota / 50);
    const userLevel = userModuleLevels[m.id] || 1;

    return `
      <div onclick="startSubjectTraining('${m.id}')" class="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-400 hover:shadow-md cursor-pointer transition gap-4 group">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl ${m.color} text-white flex items-center justify-center font-bold shadow-sm">
            <i class="fa-solid ${m.icon}"></i>
          </div>
          <div>
            <span class="font-bold text-slate-900 text-sm md:text-base group-hover:text-amber-700 transition">${m.name}</span>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-xs text-slate-500 font-semibold">${m.quota.toLocaleString()} Questions</span>
              <span class="text-[10px] font-extrabold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                Niveau actuel : ${userLevel} / ${maxLevel} (50 QCM/Niveau)
              </span>
            </div>
          </div>
        </div>

        <div class="flex items-center space-x-4 self-end md:self-center">
          <button class="bg-indigo-950 group-hover:bg-amber-500 group-hover:text-slate-950 text-amber-300 font-bold text-xs px-4 py-2 rounded-xl transition flex items-center space-x-2">
            <span>Lancer Niveau ${userLevel} (50 QCM)</span>
            <i class="fa-solid fa-play text-[10px]"></i>
          </button>
        </div>
      </div>
    `;
  }).join("");
}

// Rendu des Fiches de Synthèse
function renderFichesSynthese() {
  const container = document.getElementById("fiches-container");
  if (!container || typeof FICHES_SYNTHESE === "undefined") return;

  container.innerHTML = FICHES_SYNTHESE.map(f => `
    <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-amber-400 hover:shadow-md transition flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300">
            ${f.matiere}
          </span>
          <span class="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
            ${f.badge}
          </span>
        </div>
        <h4 class="font-bold text-slate-900 text-base mb-2 font-serif-title">${f.titre}</h4>
        <p class="text-xs text-slate-600 mb-3 leading-relaxed">${f.description}</p>
        <ul class="text-xs text-slate-700 space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80 mb-3">
          ${f.pointsCles.map(pt => `<li class="flex items-start gap-1.5"><i class="fa-solid fa-check text-emerald-600 mt-0.5 text-[10px]"></i><span>${pt}</span></li>`).join('')}
        </ul>
      </div>
      <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
        <span><i class="fa-solid fa-gavel text-amber-600 mr-1"></i>${f.fondement}</span>
      </div>
    </div>
  `).join("");
}

// Rendu du Répertoire "Loi d'ici"
function renderLoisDIci() {
  const container = document.getElementById("loi-dici-container");
  if (!container || typeof LOIS_D_ICI_REPERTOIRE === "undefined") return;

  container.innerHTML = LOIS_D_ICI_REPERTOIRE.map(t => `
    <a href="${t.url}" target="_blank" rel="noopener noreferrer" class="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition flex items-start space-x-3 group text-left">
      <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-lg group-hover:bg-emerald-600 group-hover:text-white transition shrink-0">
        <i class="fa-solid fa-scale-balanced"></i>
      </div>
      <div class="flex-grow">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-emerald-700 uppercase tracking-wider">${t.categorie}</span>
          <i class="fa-solid fa-arrow-up-right-from-square text-xs text-slate-400 group-hover:text-emerald-600 transition"></i>
        </div>
        <h4 class="font-bold text-slate-900 text-sm mt-0.5 group-hover:text-emerald-800 transition">${t.titre}</h4>
        <p class="text-xs text-slate-500 mt-1 line-clamp-2">${t.description}</p>
        <div class="mt-2 text-[10px] text-slate-400 font-mono">${t.ref} • Source : Loi d'ici</div>
      </div>
    </a>
  `).join("");
}

// Rendu et Gestion du Forum Communautaire
function renderCommunityPosts() {
  const container = document.getElementById("community-posts-container");
  if (!container) return;

  container.innerHTML = communityPosts.map(p => `
    <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 text-left">
      <div class="flex items-center justify-between text-xs">
        <div class="flex items-center space-x-2">
          <div class="w-7 h-7 rounded-full bg-indigo-950 text-amber-300 flex items-center justify-center font-bold text-xs">
            ${p.auteur.charAt(0)}
          </div>
          <span class="font-bold text-slate-900">${p.auteur}</span>
        </div>
        <span class="text-slate-400 font-medium">${p.date}</span>
      </div>
      <h5 class="text-sm font-bold text-indigo-950 pt-1">${p.sujet}</h5>
      <p class="text-xs text-slate-700 leading-relaxed">${p.message}</p>
      <div class="pt-2 flex items-center justify-between border-t border-slate-100 text-xs text-slate-500">
        <button onclick="likeCommunityPost(${p.id})" class="hover:text-amber-600 font-semibold flex items-center space-x-1.5 transition">
          <i class="fa-solid fa-thumbs-up text-amber-500"></i>
          <span>${p.likes} Utile</span>
        </button>
        <span class="text-[11px] text-emerald-600 font-bold"><i class="fa-solid fa-circle-check mr-1"></i>Vérifié par la communauté</span>
      </div>
    </div>
  `).join("");
}

function likeCommunityPost(id) {
  const post = communityPosts.find(p => p.id === id);
  if (post) {
    post.likes++;
    localStorage.setItem(STORAGE_KEY_COMMUNITY, JSON.stringify(communityPosts));
    renderCommunityPosts();
  }
}

function publishCommunityPost() {
  const auteurInput = document.getElementById("community-author");
  const sujetInput = document.getElementById("community-title");
  const messageInput = document.getElementById("community-message");

  const auteur = auteurInput ? auteurInput.value.trim() : "";
  const sujet = sujetInput ? sujetInput.value.trim() : "";
  const message = messageInput ? messageInput.value.trim() : "";

  if (!auteur || !sujet || !message) {
    alert("Veuillez renseigner votre nom, le sujet et votre message avant de publier.");
    return;
  }

  const newPost = {
    id: Date.now(),
    auteur: auteur,
    date: "À l'instant",
    sujet: sujet,
    message: message,
    likes: 1
  };

  communityPosts.unshift(newPost);
  localStorage.setItem(STORAGE_KEY_COMMUNITY, JSON.stringify(communityPosts));
  renderCommunityPosts();

  if (auteurInput) auteurInput.value = "";
  if (sujetInput) sujetInput.value = "";
  if (messageInput) messageInput.value = "";
  closeModal("modal-community-new");
  alert("Votre contribution a été publiée avec succès dans le forum d'entraide !");
}

// Système de Notifications de Révision Programmées
function initNotificationSystem() {
  const reminderInput = document.getElementById("input-reminder-time");
  const savedTime = localStorage.getItem(STORAGE_KEY_REMINDER);
  if (reminderInput && savedTime) {
    reminderInput.value = savedTime;
  }

  // Vérification périodique toutes les 60 secondes
  setInterval(checkScheduledReminder, 60000);
}

function scheduleReminder() {
  const reminderInput = document.getElementById("input-reminder-time");
  if (!reminderInput || !reminderInput.value) {
    alert("Veuillez sélectionner une heure pour votre rappel quotidien.");
    return;
  }

  const chosenTime = reminderInput.value;
  localStorage.setItem(STORAGE_KEY_REMINDER, chosenTime);

  if ("Notification" in window) {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification("Le Juriste Pro — Rappel Activé", {
          body: `Votre rappel de révision quotidien est programmé pour ${chosenTime}. Ne lâchez rien !`,
          icon: "./icon.svg"
        });
        alert(`Rappel quotidien programmé à ${chosenTime} avec succès !`);
      } else {
        alert(`Rappel enregistré pour ${chosenTime}. Activez les notifications de votre navigateur pour recevoir les alertes.`);
      }
    });
  } else {
    alert(`Rappel enregistré pour ${chosenTime}.`);
  }
}

function checkScheduledReminder() {
  const savedTime = localStorage.getItem(STORAGE_KEY_REMINDER);
  if (!savedTime) return;

  const now = new Date();
  const currentHours = String(now.getHours()).padStart(2, '0');
  const currentMins = String(now.getMinutes()).padStart(2, '0');
  const nowFormatted = `${currentHours}:${currentMins}`;

  if (nowFormatted === savedTime) {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Le Juriste Pro — Heure de Révision !", {
        body: "C'est l'heure de votre session de QCM ! « Tout est possible à celui qui croit » (Marc 9:23).",
        icon: "./icon.svg"
      });
    }
  }
}

// Générateur de questions
function generateQuestionsForSubject(subjectId, level, count = 50) {
  const moduleObj = MODULES_DATA.find(m => m.id === subjectId) || MODULES_DATA[0];
  const questions = [];
  const baseMatches = QUESTIONS_DATABASE.filter(q => q.moduleId === subjectId);

  // Mélange aléatoire des questions de base réelles
  const shuffledBase = [...baseMatches].sort(() => 0.5 - Math.random());

  for (let i = 0; i < count; i++) {
    const qNum = (level - 1) * count + i + 1;
    if (i < shuffledBase.length) {
      questions.push({ ...shuffledBase[i], displayNum: qNum });
    } else {
      questions.push(createSyntheticVariation(subjectId, moduleObj.name, level, qNum, i));
    }
  }
  return questions;
}

// Générateur de déclinaisons juridiques
function createSyntheticVariation(subjectId, moduleName, level, qNum, index) {
  const bank = [
    {
      q: "Dans l'appréciation des preuves en procédure ivoirienne, quelle est la portée du principe de l'intime conviction du juge ?",
      opt: [
        "A) Il ne s'applique qu'en matière correctionnelle et criminelle",
        "B) Il autorise le juge à fonder sa décision sur des preuves apportées au débat et contradictoirement discutées",
        "C) Il dispense le juge de toute motivation en fait et en droit",
        "D) Il interdit le recours aux expertises médico-légales"
      ],
      correct: 1,
      sub: "Principes Directeurs du Procès",
      exp: "L'intime conviction n'est pas synonyme d'arbitraire : elle doit se forger exclusivement à partir des éléments de preuve régulièrement versés aux débats et contradictoirement discutés.",
      law: "Code de Procédure Pénale ivoirien, Principes Généraux de la Preuve."
    },
    {
      q: "En droit des obligations (Code Civil), quelle sanction frappe une convention dont la cause ou l'objet est contraire à l'ordre public ou aux bonnes mœurs ?",
      opt: [
        "A) La nullité relative prescriptive par 5 ans",
        "B) La caducité rétroactive de plein droit",
        "C) La nullité absolue pouvant être invoquée par tout intéressé",
        "D) Une simple amende civile prononcée d'office"
      ],
      correct: 2,
      sub: "Théorie Générale des Contrats",
      exp: "La violation d'une règle protectrice de l'intérêt général (ordre public) est sanctionnée par la nullité absolue, que le juge peut et doit soulever d'office.",
      law: "Code Civil ivoirien, Articles 1108 et 1131."
    },
    {
      q: "Conformément à la déontologie des magistrats en Côte d'Ivoire, l'obligation de réserve interdit au magistrat de :",
      opt: [
        "A) Exercer des activités d'enseignement universitaire",
        "B) Manifester publiquement son hostilité au principe de la forme républicaine de l'État ou violer le secret du délibéré",
        "C) Publier des ouvrages doctrinaux de recherche",
        "D) Adhérer à une mutuelle de santé professionnelle"
      ],
      correct: 1,
      sub: "Déontologie et Statut de la Magistrature",
      exp: "L'obligation de réserve et le secret du délibéré sont des piliers constitutionnels garantissant l'impartialité et la dignité de la fonction judiciaire.",
      law: "Loi organique portant statut de la magistrature ivoirienne."
    }
  ];

  const pick = bank[index % bank.length];
  return {
    id: `${subjectId}_L${level}_Q${qNum}`,
    module: moduleName,
    moduleId: subjectId,
    sous_domaine: `${pick.sub} (Niveau ${level})`,
    niveau_difficulte: Math.min(3, Math.ceil(level / 5) + 1),
    question: `[Niveau ${level} - Q${qNum}] ${pick.q}`,
    options: pick.opt,
    reponses_correctes: [pick.correct],
    explication_detaillee: pick.exp,
    fondement_legal: pick.law,
    displayNum: qNum
  };
}

// Animation de chargement discrète et moderne (Slow in & Slow out)
function triggerLoaderAnimation(callback) {
  const bar = document.getElementById("global-progress-bar");
  if (!bar) {
    if (callback) callback();
    return;
  }

  bar.style.opacity = "1";
  bar.style.width = "25%";

  setTimeout(() => {
    bar.style.width = "75%";
  }, 100);

  setTimeout(() => {
    bar.style.width = "100%";
    if (callback) callback();
    setTimeout(() => {
      bar.style.opacity = "0";
      setTimeout(() => {
        bar.style.width = "0%";
      }, 250);
    }, 180);
  }, 220);
}

// Navigation & Écrans avec Transitions Fluides Naturelles
function switchTab(screen) {
  triggerLoaderAnimation(() => {
    const screens = ["dashboard", "quiz", "fiches", "codes", "community", "author"];
    screens.forEach(s => {
      const el = document.getElementById(`screen-${s}`);
      if (el) {
        el.classList.add("hidden");
        el.classList.remove("screen-animate");
      }
    });

    const modalSummary = document.getElementById("modal-summary");
    if (modalSummary) modalSummary.classList.add("hidden");

    stopTimers();

    const target = document.getElementById(`screen-${screen}`);
    if (target) {
      target.classList.remove("hidden");
      // Déclencher la transition d'apparition douce
      void target.offsetWidth; // Reflow pour redémarrer l'animation
      target.classList.add("screen-animate");
    } else {
      const dash = document.getElementById("screen-dashboard");
      dash.classList.remove("hidden");
      dash.classList.add("screen-animate");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function stopTimers() {
  if (examTimerInterval) clearInterval(examTimerInterval);
  if (questionTimerInterval) clearInterval(questionTimerInterval);
  stopVoiceAudio();
}


function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove("hidden");
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add("hidden");
}

function openReportModal() {
  openModal("modal-report");
}

function sendReport() {
  const msgEl = document.getElementById("report-message");
  const msg = msgEl ? msgEl.value.trim() : "";
  if (!msg) return alert("Veuillez écrire votre message de signalement.");

  const currentQ = currentQuestions[activeQuestionIndex];
  const mailtoUrl = `mailto:metushelahdepie@gmail.com?subject=Signalement Le Juriste Pro [${currentQ ? currentQ.id : 'Général'}]&body=${encodeURIComponent(msg)}`;
  window.location.href = mailtoUrl;

  alert("Merci ! Votre client e-mail a été préparé pour transmission au concepteur.");
  closeModal("modal-report");
  if (msgEl) msgEl.value = "";
}

// Lancement des sessions
function startSubjectTraining(subjectId) {
  isExamMode = false;
  currentSubject = subjectId;
  currentLevel = userModuleLevels[subjectId] || 1;
  sessionCorrectCount = 0;

  currentQuestions = generateQuestionsForSubject(subjectId, currentLevel, 50);

  // Reprendre exactement à l'index de question mémorisé pour ce module et ce niveau
  const posKey = `${subjectId}_L${currentLevel}`;
  const savedIndex = savedQuizPositions[posKey];
  if (typeof savedIndex === 'number' && savedIndex > 0 && savedIndex < currentQuestions.length) {
    activeQuestionIndex = savedIndex;
    console.log(`[Quiz Resume] Reprise de ${subjectId} Niveau ${currentLevel} au QCM ${activeQuestionIndex + 1}/${currentQuestions.length}`);
  } else {
    activeQuestionIndex = 0;
  }

  const moduleObj = MODULES_DATA.find(m => m.id === subjectId);
  document.getElementById("quiz-module-badge").innerText = moduleObj ? moduleObj.name : subjectId;
  const levelBadge = document.getElementById("quiz-level-badge");
  const resumedText = activeQuestionIndex > 0 ? ` (Reprise QCM ${activeQuestionIndex + 1})` : "";
  levelBadge.innerText = `Niveau ${currentLevel}${resumedText} (50 QCM)`;
  levelBadge.classList.remove("hidden");

  switchTab("quiz");
  loadQuestion();
}


function startTraining() {
  isExamMode = false;
  currentSubject = null;
  sessionCorrectCount = 0;

  let generatedMix = [];
  MODULES_DATA.forEach(m => {
    const subQ = generateQuestionsForSubject(m.id, 1, 10);
    generatedMix = generatedMix.concat(subQ);
  });
  // Mélanger les 60 questions transversales
  currentQuestions = generatedMix.sort(() => 0.5 - Math.random());
  activeQuestionIndex = 0;

  document.getElementById("quiz-module-badge").innerText = "Entraînement Mixte";
  document.getElementById("quiz-level-badge").classList.add("hidden");

  switchTab("quiz");
  loadQuestion();
}

function startExam() {
  isExamMode = true;
  currentSubject = null;
  sessionCorrectCount = 0;

  let examQuestions = [];
  MODULES_DATA.forEach(m => {
    const countForModule = Math.round((m.quota / 20000) * 100);
    const subQ = generateQuestionsForSubject(m.id, 1, countForModule);
    examQuestions = examQuestions.concat(subQ);
  });

  currentQuestions = examQuestions.sort(() => 0.5 - Math.random()).slice(0, 100);
  activeQuestionIndex = 0;

  document.getElementById("quiz-module-badge").innerText = "Examen Blanc Officiel (100 QCM)";
  document.getElementById("quiz-level-badge").classList.add("hidden");

  startExamTimer(2 * 60 * 60); // 2 heures
  switchTab("quiz");
  loadQuestion();
}

function startExamTimer(seconds) {
  let remaining = seconds;
  const display = document.getElementById("timer-display");
  stopTimers();

  examTimerInterval = setInterval(() => {
    const hrs = Math.floor(remaining / 3600);
    const mins = Math.floor((remaining % 3600) / 60);
    const secs = remaining % 60;
    if (display) {
      display.innerText = `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }
    if (--remaining < 0) {
      clearInterval(examTimerInterval);
      alert("Le temps imparti pour l'Examen Blanc (2h00) est écoulé !");
      finishSession();
    }
  }, 1000);
}

function startPerQuestionTimer() {
  if (isExamMode || perQuestionTimerLimit <= 0) {
    if (!isExamMode) {
      document.getElementById("quiz-timer").classList.add("hidden");
    }
    return;
  }

  document.getElementById("quiz-timer").classList.remove("hidden");
  perQuestionTimeRemaining = perQuestionTimerLimit;
  const display = document.getElementById("timer-display");
  if (display) display.innerText = `${perQuestionTimeRemaining}s`;

  if (questionTimerInterval) clearInterval(questionTimerInterval);

  questionTimerInterval = setInterval(() => {
    perQuestionTimeRemaining--;
    if (display) display.innerText = `${perQuestionTimeRemaining}s`;

    if (perQuestionTimeRemaining <= 0) {
      clearInterval(questionTimerInterval);
      if (selectedOption === null) {
        selectedOption = -1;
      }
      validateAnswer(true);
    }
  }, 1000);
}

// Chargement de la question active
function loadQuestion() {
  if (questionTimerInterval) clearInterval(questionTimerInterval);

  const q = currentQuestions[activeQuestionIndex];
  selectedOption = null;

  if (!isExamMode) {
    document.getElementById("quiz-module-badge").innerText = q.module;
  }
  document.getElementById("quiz-subdomain").innerText = q.sous_domaine;
  document.getElementById("quiz-question-text").innerText = q.question;
  document.getElementById("current-q-num").innerText = activeQuestionIndex + 1;
  document.getElementById("total-q-num").innerText = currentQuestions.length;

  const optionsContainer = document.getElementById("quiz-options-container");
  optionsContainer.innerHTML = q.options.map((opt, idx) => `
    <div onclick="selectOption(${idx})" id="opt-${idx}" class="qcm-option-card">
      <span class="text-sm font-semibold">${opt}</span>
      <div id="check-${idx}" class="check-indicator"></div>
    </div>
  `).join("");

  document.getElementById("correction-box").classList.add("hidden");
  document.getElementById("btn-validate").classList.remove("hidden");
  document.getElementById("btn-next").classList.add("hidden");

  startPerQuestionTimer();

  // Déclenchement immédiat de l'interaction vocale optimisée (faible latence)
  triggerVoiceCycleForQuestion(q);
}


// Sélection d'une option
function selectOption(index) {
  selectedOption = index;
  const q = currentQuestions[activeQuestionIndex];
  q.options.forEach((_, idx) => {
    const el = document.getElementById(`opt-${idx}`);
    const check = document.getElementById(`check-${idx}`);
    if (!el || !check) return;

    if (idx === index) {
      el.classList.add("selected");
      check.innerHTML = '<i class="fa-solid fa-check"></i>';
    } else {
      el.classList.remove("selected");
      check.innerHTML = "";
    }
  });
}

// Validation de la réponse
function validateAnswer(isTimeout = false) {
  if (questionTimerInterval) clearInterval(questionTimerInterval);

  if (selectedOption === null && !isTimeout) {
    return alert("Veuillez sélectionner une option avant de valider votre réponse.");
  }

  const q = currentQuestions[activeQuestionIndex];
  const isCorrect = selectedOption !== null && selectedOption >= 0 && q.reponses_correctes.includes(selectedOption);

  // Mettre à jour les statistiques
  userStats.totalAnswered++;
  if (isCorrect) {
    userStats.correctAnswered++;
    sessionCorrectCount++;
  }
  saveProgress();
  updateStatsDisplay();

  // Coloration visuelle des options
  q.options.forEach((_, idx) => {
    const el = document.getElementById(`opt-${idx}`);
    const check = document.getElementById(`check-${idx}`);
    if (!el || !check) return;

    el.classList.add("locked");
    if (q.reponses_correctes.includes(idx)) {
      el.classList.remove("selected");
      el.classList.add("correct");
      check.innerHTML = '<i class="fa-solid fa-check"></i>';
    } else if (idx === selectedOption) {
      el.classList.remove("selected");
      el.classList.add("incorrect");
      check.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    } else {
      el.classList.add("dimmed");
    }
  });

  // Affichage de la boîte d'explication juridique avec animation fluide
  const box = document.getElementById("correction-box");
  box.className = `mt-4 p-4 md:p-5 rounded-2xl border correction-animate ${isCorrect ? "bg-emerald-50 border-emerald-300 text-emerald-950" : "bg-rose-50 border-rose-300 text-rose-950"}`;
  box.innerHTML = `
    <div class="flex items-center space-x-2 font-bold mb-1.5 ${isCorrect ? "text-emerald-700" : "text-rose-700"}">
      <i class="fa-solid ${isCorrect ? "fa-circle-check" : "fa-circle-xmark"} text-lg"></i>
      <span>${isTimeout ? "⏱️ Temps écoulé ! " : ""}${isCorrect ? "Excellente réponse !" : "Réponse incorrecte"}</span>
    </div>
    <p class="text-xs font-bold text-indigo-900 mb-1">⚖️ Fondement Légal : ${q.fondement_legal || "Textes en vigueur"}</p>
    <p class="text-xs md:text-sm text-slate-800 leading-relaxed">${q.explication_detaillee}</p>
  `;
  box.classList.remove("hidden");

  document.getElementById("btn-validate").classList.add("hidden");
  document.getElementById("btn-next").classList.remove("hidden");

  // Feedback vocal instantané ultra-court
  speakValidationFeedback(isCorrect);
}


// Question suivante — avec vérification paywall après la 5e question gratuite
async function nextQuestion() {
  // ── Paywall : bloquer à partir de la 6e question (activeQuestionIndex === 4) hors mode examen ──
  if (activeQuestionIndex === FREE_QUESTIONS_LIMIT - 1 && !isExamMode) {
    // Interrogation temps réel de la table profiles de Supabase
    const isSubscribed = await isUserSubscribedAsync();
    
    if (!isSubscribed) {
      showPaywallModal(
        "Abonnement requis",
        `Vous avez complété vos ${FREE_QUESTIONS_LIMIT} questions gratuites. ` +
        `Pour poursuivre votre entraînement au-delà de la 5ème question, souscrivez à l'abonnement mensuel à ${MONTANT_MENSUEL.toLocaleString()} FCFA.`
      );
      return;
    }
  }

  if (activeQuestionIndex + 1 < currentQuestions.length) {
    activeQuestionIndex++;

    // ── Sauvegarde en temps réel de la progression pour ce module & niveau ──
    if (currentSubject && !isExamMode) {
      saveQuizPosition(currentSubject, currentLevel, activeQuestionIndex);
    }

    loadQuestion();
  } else {
    finishSession();
  }
}


// Bilan et validation de niveau
function finishSession() {
  stopTimers();
  const total = currentQuestions.length;
  const scorePercent = Math.round((sessionCorrectCount / total) * 100);
  const isPassed = scorePercent >= 60; // 60% requis pour débloquer le palier suivant

  if (isExamMode) {
    userStats.examsCompleted++;
    saveProgress();
  }

  let levelUnlocked = false;
  if (currentSubject && isPassed) {
    const curLevel = userModuleLevels[currentSubject] || 1;
    userModuleLevels[currentSubject] = curLevel + 1;
    // Réinitialiser la position de quiz mémorisée pour ce palier réussi
    delete savedQuizPositions[`${currentSubject}_L${curLevel}`];
    saveProgress();
    renderDashboardModules();
    levelUnlocked = true;
  } else if (currentSubject) {
    // Si la session est terminée mais non validée, réinitialiser la position pour recommencer à 1
    delete savedQuizPositions[`${currentSubject}_L${currentLevel}`];
    saveProgress();
  }


  showSummaryScreen(sessionCorrectCount, total, scorePercent, isPassed, levelUnlocked);
}

function showSummaryScreen(score, total, percent, isPassed, levelUnlocked) {
  const summaryModal = document.getElementById("modal-summary");
  if (!summaryModal) {
    alert(`Bilan de session : ${score}/${total} (${percent}% de réussite)`);
    switchTab("dashboard");
    return;
  }

  document.getElementById("sum-score-display").innerText = `${score} / ${total}`;
  document.getElementById("sum-percent-display").innerText = `${percent}%`;

  const titleEl = document.getElementById("sum-title");
  const msgEl = document.getElementById("sum-message");
  const badgeEl = document.getElementById("sum-badge");

  if (isPassed) {
    titleEl.innerText = "Félicitations, Palier Validé !";
    titleEl.className = "text-2xl font-bold font-serif-title text-emerald-400";
    badgeEl.className = "p-4 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30 text-3xl inline-flex items-center justify-center";
    badgeEl.innerHTML = '<i class="fa-solid fa-trophy"></i>';
    msgEl.innerHTML = levelUnlocked 
      ? `Vous avez atteint <strong>${percent}%</strong> de bonnes réponses. Le niveau supérieur est désormais débloqué !`
      : `Excellente maîtrise du sujet avec <strong>${percent}%</strong> de réponses correctes.`;
  } else {
    titleEl.innerText = "Session Terminée - Continuez à Vous Entraîner";
    titleEl.className = "text-2xl font-bold font-serif-title text-amber-300";
    badgeEl.className = "p-4 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30 text-3xl inline-flex items-center justify-center";
    badgeEl.innerHTML = '<i class="fa-solid fa-graduation-cap"></i>';
    msgEl.innerHTML = `Vous avez obtenu <strong>${percent}%</strong>. Un minimum de <strong>60%</strong> est requis pour valider ce palier de 50 questions. Reprenez les notions et retentez votre chance !`;
  }

  openModal("modal-summary");
}
// ── Paiement CinetPay ────────────────────────────────────────────────────────

/**
 * Ouvre le tunnel de paiement CinetPay pour l'abonnement mensuel (1 000 FCFA).
 * Enregistre ensuite l'expiration (+30 jours) dans Supabase (table profiles).
 */
function openSubscriptionCheckout() {
  // Fermer la modale paywall si ouverte
  const paywallModal = document.getElementById('modal-paywall');
  if (paywallModal) paywallModal.classList.add('hidden');

  // MODE SIMULATION : Permet de tester toute l'expérience utilisateur sans clés réelles
  const hasNoKeys = CINETPAY_CONFIG.apikey === 'VOTRE_API_KEY_CINETPAY' || !CINETPAY_CONFIG.apikey;
  if (SIMULATION_MODE || hasNoKeys) {
    const confirmation = confirm(
      "💳 [MODE SIMULATION / TEST]\n\n" +
      "Les clés réelles CinetPay ne sont pas encore configurées.\n\n" +
      "Voulez-vous simuler un paiement Mobile Money réussi de 1 000 FCFA (Orange, MTN, Moov, Wave) pour débloquer l'accès 30 jours (Supabase & Local) ?"
    );

    if (confirmation) {
      activateSubscription(30).then(() => {
        alert("🎉 [SIMULATION RÉUSSIE]\nAbonnement test activé pour 30 jours ! La suite des questions est débloquée.");
        activeQuestionIndex++;
        if (activeQuestionIndex < currentQuestions.length) {
          loadQuestion();
        } else {
          finishSession();
        }
      });
    } else {
      showPaywallModal(
        "Abonnement requis",
        `Pour continuer, souscrivez à l'abonnement mensuel à ${MONTANT_MENSUEL.toLocaleString()} FCFA.`
      );
    }
    return;
  }

  if (typeof CinetPay === 'undefined') {
    alert("Le module de paiement n'est pas encore chargé. Vérifiez votre connexion et rechargez la page.");
    return;
  }

  const transactionId = "JP_" + Math.floor(Math.random() * 100000000);

  CinetPay.setConfig({
    apikey:         CINETPAY_CONFIG.apikey,
    site_id:        CINETPAY_CONFIG.site_id,
    transaction_id: transactionId,
    amount:         MONTANT_MENSUEL,
    currency:       CINETPAY_CONFIG.currency,
    description:    CINETPAY_CONFIG.description,
    channels:       CINETPAY_CONFIG.channels,
    lang:           CINETPAY_CONFIG.lang,
    return_url:     window.location.href
  });

  CinetPay.getCheckout({
    onSuccess: async function (data) {
      console.log('[CinetPay] Paiement réussi :', data);
      await activateSubscription(30);          // +30 jours dans Supabase & local
      const paywallEl = document.getElementById('modal-paywall');
      if (paywallEl) paywallEl.classList.add('hidden');
      // Continuer la session directement depuis la question courante
      activeQuestionIndex++;
      if (activeQuestionIndex < currentQuestions.length) {
        loadQuestion();
      } else {
        finishSession();
      }
      alert("🎉 Paiement validé avec succès ! Votre abonnement est actif pour 30 jours.");
    },
    onError: function (data) {
      console.error('[CinetPay] Erreur de paiement :', data);
      alert("Le paiement a échoué ou a été annulé. Veuillez réessayer.");
      showPaywallModal(
        "Abonnement requis",
        `Pour continuer, souscrivez à l'abonnement mensuel à ${MONTANT_MENSUEL.toLocaleString()} FCFA.`
      );
    }
  });

  CinetPay.setupCheckout();
  CinetPay.openCheckout();
}

// ── Gestion du rappel discret de don / soutien ──────────────────────────────
function initSupportReminder() {
  const banner = document.getElementById("banner-support-reminder");
  if (!banner) return;

  try {
    const dismissedUntil = localStorage.getItem(STORAGE_KEY_SUPPORT_DISMISS);
    if (dismissedUntil && Date.now() < parseInt(dismissedUntil, 10)) {
      banner.classList.add("hidden");
    } else {
      banner.classList.remove("hidden");
    }
  } catch (e) {
    banner.classList.remove("hidden");
  }
}

function dismissSupportReminder() {
  const banner = document.getElementById("banner-support-reminder");
  if (banner) banner.classList.add("hidden");

  // Masquer discrètement pour 7 jours pour ne pas surcharger l'utilisateur
  const nextReminder = Date.now() + 7 * 24 * 60 * 60 * 1000;
  try {
    localStorage.setItem(STORAGE_KEY_SUPPORT_DISMISS, nextReminder.toString());
  } catch (e) {}
}

// ==============================================================================
// MODULE D'INTERACTION VOCALE : SYNTHÈSE (TTS) & RECONNAISSANCE VOCALE (STT)
// Lecture optimisée à vitesse 1.1x & Sélection/Validation orale sans latence
// ==============================================================================

/**
 * Initialise le système vocal au chargement (sélection voix française).
 */
function initVoiceModule() {
  if ("speechSynthesis" in window) {
    // Précharger les voix disponibles
    window.speechSynthesis.onvoiceschanged = () => {
      selectBestFrenchVoice();
    };
    selectBestFrenchVoice();
  } else {
    console.warn("Synthèse vocale non supportée par ce navigateur.");
  }

  // Initialiser l'API de reconnaissance vocale (SpeechRecognition / webkitSpeechRecognition)
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    try {
      speechRecognitionInstance = new SpeechRecognition();
      speechRecognitionInstance.continuous = true;
      speechRecognitionInstance.interimResults = false;
      speechRecognitionInstance.lang = "fr-FR";
      speechRecognitionInstance.maxAlternatives = 3;

      speechRecognitionInstance.onresult = handleSpeechRecognitionResult;
      speechRecognitionInstance.onerror = (e) => {
        if (e.error !== "no-speech") {
          console.warn("[Voice Recognition] Info/Error :", e.error);
        }
      };
      speechRecognitionInstance.onend = () => {
        // Redémarrer automatiquement si l'utilisateur souhaite garder le micro actif
        if (isVoiceListeningActive && isScreenActive("quiz")) {
          try {
            speechRecognitionInstance.start();
          } catch (err) {}
        } else {
          isRecognizingSpeech = false;
          updateVoiceUI();
        }
      };
    } catch (e) {
      console.warn("Erreur initialisation SpeechRecognition :", e);
    }
  }

  updateVoiceUI();
}

function isScreenActive(screenId) {
  const el = document.getElementById(`screen-${screenId}`);
  return el && !el.classList.contains("hidden");
}

function selectBestFrenchVoice() {
  if (!("speechSynthesis" in window)) return;
  const voices = window.speechSynthesis.getVoices();
  synthVoiceInstance = voices.find(v => v.lang === "fr-FR" || v.lang === "fr_FR" || v.lang.startsWith("fr")) || null;
}

/**
 * Arrête immédiatement tout flux audio ou écoute vocale en cours.
 */
function stopVoiceAudio() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
  activeUtterance = null;
}

/**
 * Lit la question actuelle avec structure stricte :
 * 1. Numéro de la question
 * 2. Énoncé complet
 * 3. Options A, B, C, D distinctes à vitesse 1.1x
 */
function readCurrentQuestionSpeech() {
  if (!currentQuestions || !currentQuestions[activeQuestionIndex]) return;
  const q = currentQuestions[activeQuestionIndex];

  stopVoiceAudio();

  const qNum = activeQuestionIndex + 1;
  // Nettoyage de l'énoncé si préfixé par [Niveau X - QY]
  const cleanQuestion = q.question.replace(/^\[[^\]]+\]\s*/, "");

  // Options formulées avec prononciation claire
  const optionLetters = ["A", "B", "C", "D"];
  const formattedOptions = q.options.map((opt, i) => {
    const letter = optionLetters[i] || "";
    const cleanOpt = opt.replace(/^[A-D]\)\s*/i, "");
    return `Option ${letter} : ${cleanOpt}`;
  }).join(". ");

  const textToRead = `Question numéro ${qNum}. ${cleanQuestion}. ${formattedOptions}.`;

  const utterance = new SpeechSynthesisUtterance(textToRead);
  utterance.lang = "fr-FR";
  utterance.rate = 1.1; // Vitesse légèrement accélérée demandée
  utterance.pitch = 1.0; // Tonalité naturelle

  if (synthVoiceInstance) {
    utterance.voice = synthVoiceInstance;
  }

  utterance.onstart = () => {
    updateVoiceStatusBanner("Lecture vocale de la question en cours...");
  };

  utterance.onend = () => {
    activeUtterance = null;
    updateVoiceStatusBanner("À l'écoute... Dites « Option A », « Réponse B », ou « Valider »");
    // Si la reconnaissance vocale est activée, s'assurer qu'elle écoute
    if (isVoiceListeningActive) {
      startSpeechRecognition();
    }
  };

  utterance.onerror = () => {
    activeUtterance = null;
  };

  activeUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

/**
 * Déclenche le cycle vocal dès qu'une question est chargée.
 */
function triggerVoiceCycleForQuestion(q) {
  if (isVoiceSpeechActive) {
    // Petit délai imperceptible de 120ms pour laisser le DOM s'afficher
    setTimeout(() => {
      readCurrentQuestionSpeech();
    }, 120);
  } else if (isVoiceListeningActive) {
    startSpeechRecognition();
  }
}

/**
 * Traite les commandes vocales de l'utilisateur avec très faible latence :
 * - « A », « Option A », « Réponse A »
 * - « B », « Option B », « Réponse B »
 * - « C », « Option C », « Réponse C »
 * - « D », « Option D », « Réponse D »
 * - « Valider », « Confirmer », « OK »
 * - « Suivant », « Question suivante », « Continuer »
 * - « Répéter », « Relire »
 */
function handleSpeechRecognitionResult(event) {
  const results = event.results;
  const lastResult = results[results.length - 1];
  if (!lastResult) return;

  const spokenText = lastResult[0].transcript.trim().toLowerCase();
  console.log("[Voice Command Detected] :", spokenText);
  updateVoiceStatusBanner(`Entendu : « ${spokenText} »`);

  // 1. Commande de Répétition
  if (spokenText.includes("répéter") || spokenText.includes("relire") || spokenText.includes("réécoute")) {
    readCurrentQuestionSpeech();
    return;
  }

  // 2. Commande Question Suivante
  if (spokenText.includes("suivant") || spokenText.includes("suivante") || spokenText.includes("continuer") || spokenText.includes("après")) {
    const btnNext = document.getElementById("btn-next");
    if (btnNext && !btnNext.classList.contains("hidden")) {
      nextQuestion();
      return;
    }
  }

  // 3. Commande de Validation
  if (spokenText.includes("valider") || spokenText.includes("confirmer") || spokenText.includes("c'est mon choix") || spokenText.includes("valide")) {
    const btnValidate = document.getElementById("btn-validate");
    if (btnValidate && !btnValidate.classList.contains("hidden")) {
      validateAnswer();
      return;
    }
  }

  // 4. Sélection des options A, B, C, D
  let matchedOption = -1;

  // Reconnaissance Option A (y compris phonétique française "ah")
  if (/\b(option\s*a|réponse\s*a|choix\s*a|lettre\s*a|\ba\b)\b/i.test(spokenText) || spokenText === "a") {
    matchedOption = 0;
  }
  // Reconnaissance Option B (bé, béh)
  else if (/\b(option\s*b|réponse\s*b|choix\s*b|lettre\s*b|\bb\b|bé)\b/i.test(spokenText) || spokenText === "b") {
    matchedOption = 1;
  }
  // Reconnaissance Option C (cé, cey)
  else if (/\b(option\s*c|réponse\s*c|choix\s*c|lettre\s*c|\bc\b|cé)\b/i.test(spokenText) || spokenText === "c") {
    matchedOption = 2;
  }
  // Reconnaissance Option D (dé)
  else if (/\b(option\s*d|réponse\s*d|choix\s*d|lettre\s*d|\bd\b|dé)\b/i.test(spokenText) || spokenText === "d") {
    matchedOption = 3;
  }

  if (matchedOption >= 0) {
    selectOption(matchedOption);
    const letters = ["A", "B", "C", "D"];
    updateVoiceStatusBanner(`Option ${letters[matchedOption]} sélectionnée ! Dites « Valider » pour confirmer.`);
    
    // Bip ou retour sonore ultra-court (synthèse 0.3s)
    speakInstantFeedback(`Option ${letters[matchedOption]}`);
  }
}

/**
 * Feedback vocal instantané pour guider l'utilisateur.
 */
function speakInstantFeedback(text) {
  if (!("speechSynthesis" in window)) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "fr-FR";
  utter.rate = 1.3;
  utter.pitch = 1.0;
  if (synthVoiceInstance) utter.voice = synthVoiceInstance;
  window.speechSynthesis.speak(utter);
}

/**
 * Feedback vocal après validation
 */
function speakValidationFeedback(isCorrect) {
  if (!isVoiceSpeechActive) return;
  const phrase = isCorrect ? "Excellente réponse !" : "Réponse incorrecte.";
  speakInstantFeedback(phrase);
}

/**
 * Active / Désactive la synthèse vocale automatique
 */
function toggleAutoSpeech() {
  isVoiceSpeechActive = !isVoiceSpeechActive;
  if (!isVoiceSpeechActive) {
    stopVoiceAudio();
  } else {
    readCurrentQuestionSpeech();
  }
  updateVoiceUI();
}

/**
 * Active / Désactive la reconnaissance vocale
 */
function toggleVoiceRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("La reconnaissance vocale n'est pas supportée par ce navigateur (veuillez utiliser Google Chrome, Edge ou Safari).");
    return;
  }

  isVoiceListeningActive = !isVoiceListeningActive;

  if (isVoiceListeningActive) {
    startSpeechRecognition();
  } else {
    stopSpeechRecognition();
  }

  updateVoiceUI();
}

function startSpeechRecognition() {
  if (!speechRecognitionInstance) return;
  try {
    speechRecognitionInstance.start();
    isRecognizingSpeech = true;
    updateVoiceUI();
  } catch (err) {
    // Déjà démarré
  }
}

function stopSpeechRecognition() {
  if (!speechRecognitionInstance) return;
  try {
    speechRecognitionInstance.stop();
    isRecognizingSpeech = false;
    updateVoiceUI();
  } catch (err) {}
}

function updateVoiceUI() {
  // 1. Bouton Synthèse
  const btnSpeak = document.getElementById("btn-voice-speak");
  const iconSpeak = document.getElementById("voice-speak-icon");
  const labelSpeak = document.getElementById("voice-speak-label");
  if (btnSpeak && iconSpeak && labelSpeak) {
    if (isVoiceSpeechActive) {
      btnSpeak.className = "text-xs px-2 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold transition flex items-center gap-1.5";
      iconSpeak.className = "fa-solid fa-volume-high text-amber-400";
      labelSpeak.innerText = "Audio : ON";
    } else {
      btnSpeak.className = "text-xs px-2 py-1 rounded-md bg-slate-800 text-slate-400 border border-slate-700 font-semibold transition flex items-center gap-1.5";
      iconSpeak.className = "fa-solid fa-volume-xmark text-slate-400";
      labelSpeak.innerText = "Audio : OFF";
    }
  }

  // 2. Bouton Micro
  const btnListen = document.getElementById("btn-voice-listen");
  const iconListen = document.getElementById("voice-listen-icon");
  const labelListen = document.getElementById("voice-listen-label");
  const statusBanner = document.getElementById("voice-status-banner");

  if (btnListen && iconListen && labelListen) {
    if (isVoiceListeningActive) {
      btnListen.className = "text-xs px-2.5 py-1 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition flex items-center gap-1.5 shadow animate-pulse";
      iconListen.className = "fa-solid fa-microphone";
      labelListen.innerText = "Micro : Actif";
      if (statusBanner) statusBanner.classList.remove("hidden");
    } else {
      btnListen.className = "text-xs px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition flex items-center gap-1.5 border border-slate-700";
      iconListen.className = "fa-solid fa-microphone-slash text-slate-400";
      labelListen.innerText = "Micro : OFF";
      if (statusBanner) statusBanner.classList.add("hidden");
    }
  }
}

function updateVoiceStatusBanner(text) {
  const textEl = document.getElementById("voice-status-text");
  if (textEl) textEl.innerText = text;
}

// ── Initialisation au chargement du document ────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
  // 1. Charger les progrès et modules
  loadStoredProgress();
  updateStatsDisplay();
  renderDashboardModules();
  renderFichesSynthese();
  renderCodesOfficiels();
  renderCommunityPosts();
  initNotificationSystem();
  initSupportReminder();
  initVoiceModule();

  // 2. Synchroniser la session Supabase
  await checkSupabaseSession();
});


