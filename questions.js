// ==========================================================================
// BANQUE OFFICIELLE DE QUESTIONS JURIDIQUES - LE JURISTE PRO
// Concours de la Magistrature INFJ CI & Culture Juridique Universitaire
// Conforme au droit positif ivoirien et aux Actes Uniformes OHADA
// ==========================================================================

const QUESTIONS_DATABASE = [
  // --- 1. ORGANISATION ET SYSTÈME JUDICIAIRE IVOIRIEN (ORG) ---
  {
    id: "ORG_001",
    module: "Organisation & Système Judiciaire Ivoirien",
    moduleId: "ORG",
    sous_domaine: "Juridictions Suprêmes - Ordre Judiciaire",
    niveau_difficulte: 2,
    question: "Depuis la révision constitutionnelle issue de la loi n° 2020-348, quelle est la plus haute juridiction de l'ordre judiciaire en Côte d'Ivoire ?",
    options: [
      "A) La Chambre Judiciaire de la Cour Suprême",
      "B) La Cour de Cassation",
      "C) Le Conseil d'État",
      "D) Le Conseil Supérieur de la Magistrature"
    ],
    reponses_correctes: [1],
    explication_detaillee: "La révision constitutionnelle de 2020 a parachevé l'éclatement de l'ancienne Cour Suprême unifiée en trois ordres distincts : Cour de Cassation (ordre judiciaire), Conseil d'État (ordre administratif) et Cour des Comptes (ordre financier).",
    fondement_legal: "Constitution ivoirienne de 2016 révisée en 2020 (Art. 143 et suiv.) & Loi organique n° 2020-967."
  },
  {
    id: "ORG_002",
    module: "Organisation & Système Judiciaire Ivoirien",
    moduleId: "ORG",
    sous_domaine: "Juridictions Spécialisées - Criminalité Financière",
    niveau_difficulte: 2,
    question: "Quelle juridiction spécialisée est spécifiquement compétente pour la poursuite et l'instruction des infractions économiques, financières et de blanchiment en Côte d'Ivoire ?",
    options: [
      "A) La Chambre Correctionnelle du Tribunal du Commerce",
      "B) Le Pôle Pénal Économique et Financier (PPEF)",
      "C) La Cour d'Arbitrage de Côte d'Ivoire (CACI)",
      "D) La Haute Autorité pour la Bonne Gouvernance (HABG)"
    ],
    reponses_correctes: [1],
    explication_detaillee: "Le Pôle Pénal Économique et Financier (PPEF), créé auprès du Tribunal de Première Instance d'Abidjan, a une compétence nationale exclusive pour les crimes et délits financiers d'une complexité particulière.",
    fondement_legal: "Loi n° 2019-1080 du 18 décembre 2019 relative au Pôle Pénal Économique et Financier."
  },
  {
    id: "ORG_003",
    module: "Organisation & Système Judiciaire Ivoirien",
    moduleId: "ORG",
    sous_domaine: "Conseil Supérieur de la Magistrature",
    niveau_difficulte: 2,
    question: "Conformément à la Constitution ivoirienne de 2016, qui assure la présidence effective du Conseil Supérieur de la Magistrature ?",
    options: [
      "A) Le Garde des Sceaux, Ministre de la Justice",
      "B) Le Président de la République",
      "C) Une personnalité désignée par le Président de la République parmi les hauts magistrats",
      "D) Le doyen des Présidents de la Cour de Cassation"
    ],
    reponses_correctes: [2],
    explication_detaillee: "La Constitution de 2016 a supprimé la présidence directe du CSM par le Président de la République pour renforcer l'indépendance de la magistrature ; le CSM est désormais présidé par une personnalité désignée à cet effet.",
    fondement_legal: "Constitution ivoirienne du 8 novembre 2016, Article 145."
  },
  {
    id: "ORG_004",
    module: "Organisation & Système Judiciaire Ivoirien",
    moduleId: "ORG",
    sous_domaine: "Principe de dualité de juridiction",
    niveau_difficulte: 2,
    question: "En cas de conflit de compétence positif ou négatif entre l'ordre judiciaire et l'ordre administratif, quel organe constitutionnel est habilité à trancher ?",
    options: [
      "A) Le Conseil Constitutionnel",
      "B) Le Tribunal des Conflits",
      "C) L'Assemblée Nationale",
      "D) Le Ministre de la Justice"
    ],
    reponses_correctes: [1],
    explication_detaillee: "Le Tribunal des Conflits ivoirien, composé à parité de magistrats de la Cour de Cassation et du Conseil d'État, règle les contestations d'attribution entre les deux ordres.",
    fondement_legal: "Loi organique n° 2020-969 du 17 décembre 2020 portant organisation et fonctionnement du Tribunal des Conflits."
  },
  {
    id: "ORG_005",
    module: "Organisation & Système Judiciaire Ivoirien",
    moduleId: "ORG",
    sous_domaine: "Magistrature - Statut et principes fondamentaux",
    niveau_difficulte: 2,
    question: "La règle de l'inamovibilité des magistrats s'applique :",
    options: [
      "A) À tous les magistrats indistinctement (siège et parquet)",
      "B) Exclusivement aux magistrats du siège",
      "C) Exclusivement aux magistrats du parquet sous l'autorité du Procureur Général",
      "D) Uniquement aux magistrats de grade hors-hiérarchie"
    ],
    reponses_correctes: [1],
    explication_detaillee: "L'inamovibilité est une garantie fondamentale accordée aux seuls magistrats du siège. Les magistrats du ministère public (parquet) sont soumis au principe de subordination hiérarchique.",
    fondement_legal: "Loi organique n° 2020-967 et Statut de la magistrature ivoirienne."
  },

  // --- 2. DROIT CIVIL & PERSONNES (CIV) ---
  {
    id: "CIV_001",
    module: "Droit Civil & Personnes",
    moduleId: "CIV",
    sous_domaine: "Droit de la Famille - Divorce",
    niveau_difficulte: 2,
    question: "Sous le régime de la loi n° 2022-793 du 13 octobre 2022, quelle est la durée minimale requise de cessation de communauté de vie pour invoquer l'altération définitive du lien conjugal ?",
    options: [
      "A) 6 mois",
      "B) 1 an",
      "C) 2 ans",
      "D) 3 ans"
    ],
    reponses_correctes: [1],
    explication_detaillee: "La réforme du divorce de 2022 en Côte d'Ivoire fixe à un (1) an de cessation de communauté de vie la condition pour caractériser l'altération définitive du lien conjugal comme cause péremptoire de divorce.",
    fondement_legal: "Loi n° 2022-793 du 13 octobre 2022 relative au divorce et à la séparation de corps, Art. 21."
  },
  {
    id: "CIV_002",
    module: "Droit Civil & Personnes",
    moduleId: "CIV",
    sous_domaine: "Droit du Mariage - Régime Légal Supplétif",
    niveau_difficulte: 2,
    question: "En droit civil ivoirien, à défaut de choix exprès formulé par les époux lors de la célébration du mariage, quel est le régime matrimonial légalement applicable ?",
    options: [
      "A) La séparation de biens",
      "B) La communauté universelle",
      "C) La communauté de biens réduite aux acquêts",
      "D) La participation aux acquêts"
    ],
    reponses_correctes: [2],
    explication_detaillee: "La loi ivoirienne n° 2019-570 retient comme régime de droit commun (supplétif de volonté) le régime de la communauté de biens réduite aux acquêts.",
    fondement_legal: "Loi n° 2019-570 du 26 juin 2019 relative au mariage, Art. 47."
  },
  {
    id: "CIV_003",
    module: "Droit Civil & Personnes",
    moduleId: "CIV",
    sous_domaine: "Droit des Successions - Réserve Héréditaire",
    niveau_difficulte: 2,
    question: "Selon la loi n° 2019-573 relative aux successions, quelle est la vocation successorale du conjoint survivant non divorcé ?",
    options: [
      "A) Il ne bénéficie que d'un droit d'usufruit viager limité à 1/8",
      "B) Il est héritier réservataire de premier ordre venant en concours direct avec les descendants",
      "C) Il est totalement exclu de la succession dès lors qu'il existe des collatéraux privilégiés",
      "D) Il ne reçoit qu'une créance alimentaire contre la succession"
    ],
    reponses_correctes: [1],
    explication_detaillee: "La loi de 2019 renforce considérablement les droits du conjoint survivant en en faisant un héritier à part entière avec une part réservataire en pleine propriété.",
    fondement_legal: "Loi n° 2019-573 du 26 juin 2019 relative aux successions, Art. 26 et suiv."
  },
  {
    id: "CIV_004",
    module: "Droit Civil & Personnes",
    moduleId: "CIV",
    sous_domaine: "Filiation - Reconnaissance d'enfant",
    niveau_difficulte: 2,
    question: "En droit ivoirien, l'établissement de la filiation maternelle hors mariage résulte obligatoirement de :",
    options: [
      "A) Un jugement déclaratif du tribunal civil",
      "B) L'indication du nom de la mère dans l'acte de naissance de l'enfant",
      "C) Une expertise biologique génétique ordonnée d'office",
      "D) L'autorisation préalable du Procureur de la République"
    ],
    reponses_correctes: [1],
    explication_detaillee: "La loi n° 2019-571 pose le principe moderne selon lequel la filiation à l'égard de la mère s'établit simplement par l'indication de son nom dans l'acte de naissance ('mater semper certa est').",
    fondement_legal: "Loi n° 2019-571 du 26 juin 2019 relative à la filiation, Art. 6."
  },
  {
    id: "CIV_005",
    module: "Droit Civil & Personnes",
    moduleId: "CIV",
    sous_domaine: "Droit des Obligations - Responsabilité du fait d'autrui",
    niveau_difficulte: 2,
    question: "Pour que la responsabilité civile des commettants du fait de leurs préposés soit engagée, quelle condition indispensable doit être réunie ?",
    options: [
      "A) Une faute intentionnelle grave du préposé uniquement",
      "B) Un lien de subordination et un acte commis dans l'exercice ou à l'occasion des fonctions",
      "C) L'absence d'assurance civile souscrite par le commettant",
      "D) Une mise en demeure préalable notifiée par commissaire de justice"
    ],
    reponses_correctes: [1],
    explication_detaillee: "L'engagement de la responsabilité de plein droit du commettant requiert la preuve d'un lien de préposition (subordination) et la commission d'un fait dommageable rattaché aux fonctions confiées.",
    fondement_legal: "Code Civil ivoirien / Principes généraux de la responsabilité civile quasi-délictuelle (Art. 1384 al. 5)."
  },

  // --- 3. DROIT PÉNAL GÉNÉRAL & SPÉCIAL (PEN) ---
  {
    id: "PEN_001",
    module: "Droit Pénal Général & Spécial",
    moduleId: "PEN",
    sous_domaine: "Procédure Pénale - Garde à Vue",
    niveau_difficulte: 2,
    question: "Conformément au Code de Procédure Pénale ivoirien, quelle est la durée légale initiale d'une mesure de garde à vue de droit commun avant toute prorogation ?",
    options: [
      "A) 24 heures",
      "B) 48 heures",
      "C) 72 heures",
      "D) 96 heures"
    ],
    reponses_correctes: [1],
    explication_detaillee: "La durée de la garde à vue de droit commun ne peut excéder quarante-huit (48) heures. Elle peut faire l'objet d'une prolongation d'égale durée sur autorisation écrite du Procureur.",
    fondement_legal: "Code de Procédure Pénale ivoirien, Article 63."
  },
  {
    id: "PEN_002",
    module: "Droit Pénal Général & Spécial",
    moduleId: "PEN",
    sous_domaine: "Classification des Infractions & Peines",
    niveau_difficulte: 2,
    question: "Selon le Code Pénal ivoirien (Loi n° 2019-574), comment se définit la peine privative de liberté maximale encourue pour un délit ?",
    options: [
      "A) Un emprisonnement supérieur à 2 ans et n'excédant pas 5 ans",
      "B) Un emprisonnement supérieur à 30 jours et n'excédant pas 10 ans",
      "C) La réclusion criminelle à perpétuité",
      "D) Une détention militaire de 1 an"
    ],
    reponses_correctes: [1],
    explication_detaillee: "En droit pénal ivoirien, les délits sont les infractions que la loi punit d'une peine d'emprisonnement supérieure à un mois (30 jours) et ne dépassant pas dix ans.",
    fondement_legal: "Loi n° 2019-574 du 26 juin 2019 portant Code Pénal, Art. 8."
  },
  {
    id: "PEN_003",
    module: "Droit Pénal Général & Spécial",
    moduleId: "PEN",
    sous_domaine: "Détention Préventive - Contrôle de la liberté",
    niveau_difficulte: 2,
    question: "En matière correctionnelle, quelle est la durée maximale de validité du mandat de dépôt initial décerné par le juge d'instruction ?",
    options: [
      "A) 1 mois",
      "B) 3 mois",
      "C) 6 mois",
      "D) 1 an"
    ],
    reponses_correctes: [2],
    explication_detaillee: "En matière correctionnelle, la détention préventive ne peut initialement excéder six (6) mois. Toute prolongation exige une ordonnance motivée du juge d'instruction après réquisitions du ministère public.",
    fondement_legal: "Code de Procédure Pénale ivoirien, Article 138."
  },
  {
    id: "PEN_004",
    module: "Droit Pénal Général & Spécial",
    moduleId: "PEN",
    sous_domaine: "Droit Pénal Spécial - Infractions Financières",
    niveau_difficulte: 2,
    question: "L'infraction de corruption passive d'agent public national est constituée dès lors que l'agent :",
    options: [
      "A) A accompli effectivement l'acte frauduleux avant d'avoir perçu le don",
      "B) Sollicite ou agrée, sans droit, à tout moment, des dons ou avantages pour accomplir un acte de sa fonction",
      "C) Agit uniquement sous la menace avérée d'un supérieur hiérarchique",
      "D) A restitué l'avantage reçu dans un délai de 48 heures"
    ],
    reponses_correctes: [1],
    explication_detaillee: "La corruption passive est une infraction formelle consommée dès l'agrément ou la sollicitation illicite, sans qu'il soit nécessaire que l'acte attendu ait été effectivement réalisé.",
    fondement_legal: "Loi n° 2019-574 portant Code Pénal & Ordonnance n° 2013-660 relative à la prévention et à la lutte contre la corruption."
  },

  // --- 4. DROIT COMMERCIAL & OHADA (OHA) ---
  {
    id: "OHA_001",
    module: "Droit Commercial / OHADA",
    moduleId: "OHA",
    sous_domaine: "Bail à usage professionnel (AUDCG)",
    niveau_difficulte: 2,
    question: "Dans le cadre d'un bail professionnel à durée indéterminée sous l'empire de l'AUDCG révisé, quel est le délai minimum de préavis à respecter pour notifier le congé ?",
    options: [
      "A) 1 mois",
      "B) 3 mois",
      "C) 6 mois",
      "D) 12 mois"
    ],
    reponses_correctes: [2],
    explication_detaillee: "L'article 125 de l'Acte Uniforme OHADA portant Droit Commercial Général (AUDCG) impose un préavis impératif d'au moins six (6) mois délivré par voie d'huissier (commissaire de justice).",
    fondement_legal: "Acte Uniforme OHADA portant Droit Commercial Général (AUDCG), Art. 125."
  },
  {
    id: "OHA_002",
    module: "Droit Commercial / OHADA",
    moduleId: "OHA",
    sous_domaine: "Prescription Commerciale (AUDCG)",
    niveau_difficulte: 2,
    question: "En droit commercial OHADA, quel est le délai de prescription de droit commun des obligations commerciales ?",
    options: [
      "A) 2 ans",
      "B) 5 ans",
      "C) 10 ans",
      "D) 30 ans"
    ],
    reponses_correctes: [1],
    explication_detaillee: "Les obligations nées à l'occasion de leur commerce entre commerçants ou entre commerçants et non-commerçants se prescrivent par cinq (5) ans à défaut de délais plus courts fixés par des textes particuliers.",
    fondement_legal: "AUDCG révisé en 2010, Article 33."
  },
  {
    id: "OHA_003",
    module: "Droit Commercial / OHADA",
    moduleId: "OHA",
    sous_domaine: "Sociétés Commerciales (AUSCGIE)",
    niveau_difficulte: 2,
    question: "Quel est le capital social minimum exigé par l'OHADA pour la constitution d'une Société Anonyme (SA) ne faisant pas offre publique de titres ?",
    options: [
      "A) 1 000 000 FCFA",
      "B) 5 000 000 FCFA",
      "C) 10 000 000 FCFA",
      "D) 50 000 000 FCFA"
    ],
    reponses_correctes: [2],
    explication_detaillee: "L'Acte Uniforme relatif aux Sociétés Commerciales et au GIE (AUSCGIE) fixe à 10 000 000 FCFA le montant minimum du capital social pour une SA fermée.",
    fondement_legal: "AUSCGIE, Article 387."
  },
  {
    id: "OHA_004",
    module: "Droit Commercial / OHADA",
    moduleId: "OHA",
    sous_domaine: "Recouvrement & Voies d'exécution (AUVE)",
    niveau_difficulte: 2,
    question: "Sous le régime de l'Acte Uniforme portant organisation des voies d'exécution (AUVE révisé en 2023), quel est le délai légal imparti au débiteur pour former opposition à une ordonnance d'injonction de payer ?",
    options: [
      "A) 8 jours",
      "B) 15 jours",
      "C) 30 jours",
      "D) 3 mois"
    ],
    reponses_correctes: [1],
    explication_detaillee: "L'opposition à l'ordonnance d'injonction de payer doit être formée dans un délai de quinze (15) jours à compter de la signification de la décision au débiteur.",
    fondement_legal: "Acte Uniforme OHADA portant voies d'exécution, Art. 10 et 11."
  },

  // --- 5. DROIT ADMINISTRATIF & CONTENTIEUX (ADM) ---
  {
    id: "ADM_001",
    module: "Droit Administratif & Contentieux",
    moduleId: "ADM",
    sous_domaine: "Recours pour Excès de Pouvoir (REP)",
    niveau_difficulte: 2,
    question: "En contentieux administratif ivoirien, quel est le délai impératif pour introduire le recours administratif préalable (gracieux ou hiérarchique) ?",
    options: [
      "A) 15 jours",
      "B) 1 mois",
      "C) 2 mois",
      "D) 6 mois"
    ],
    reponses_correctes: [2],
    explication_detaillee: "Le recours administratif préalable est obligatoire en Côte d'Ivoire et doit être formulé dans le délai de deux (2) mois à compter de la publication ou de la notification de la décision litigieuse.",
    fondement_legal: "Loi n° 2020-968 du 17 décembre 2020 déterminant les attributions, la composition et le fonctionnement du Conseil d'État."
  },
  {
    id: "ADM_002",
    module: "Droit Administratif & Contentieux",
    moduleId: "ADM",
    sous_domaine: "Privilèges de l'Administration",
    niveau_difficulte: 2,
    question: "Le principe en vertu duquel les actes administratifs unilatéraux bénéficient d'une présomption de légalité et s'imposent sans autorisation préalable du juge se nomme :",
    options: [
      "A) Le privilège d'immunité juridictionnelle",
      "B) Le privilège du préalable",
      "C) Le bénéfice de discussion",
      "D) La réserve de souveraineté"
    ],
    reponses_correctes: [1],
    explication_detaillee: "Le 'privilège du préalable' ou règle de la décision préalable permet à l'administration d'obliger les administrés sans avoir à saisir préalablement une juridiction pour constater son droit.",
    fondement_legal: "Grands arrêts du Conseil d'État & Jurisprudence administrative ivoirienne."
  },
  {
    id: "ADM_003",
    module: "Droit Administratif & Contentieux",
    moduleId: "ADM",
    sous_domaine: "Responsabilité de la Puissance Publique",
    niveau_difficulte: 2,
    question: "Lorsque la faute commise par un agent public est détachable de l'exercice de ses fonctions et témoigne de passions personnelles ou d'une malveillance évidente, il s'agit d'une :",
    options: [
      "A) Faute de service exclusive",
      "B) Faute personnelle engageant la responsabilité de l'agent devant les tribunaux judiciaires",
      "C) Faute administrative exonératoire de plein droit",
      "D) Circonstance atténuante couverte par le statut de fonctionnaire"
    ],
    reponses_correctes: [1],
    explication_detaillee: "La faute personnelle détachable engage la responsabilité pécuniaire propre de l'agent devant les tribunaux judiciaires, contrairement à la faute de service qui incombe à la personne publique.",
    fondement_legal: "Distinction jurisprudentielle Pelletier (1873) reçue en droit ivoirien."
  },

  // --- 6. CULTURE NUMÉRIQUE & E-JUSTICE (NUM) ---
  {
    id: "NUM_001",
    module: "Culture Numérique & E-Justice",
    moduleId: "NUM",
    sous_domaine: "Protection des Données à Caractère Personnel",
    niveau_difficulte: 2,
    question: "En Côte d'Ivoire, quelle autorité indépendante est investie de la mission de veiller au respect de la législation sur la protection des données personnelles ?",
    options: [
      "A) La CNIL ivoirienne",
      "B) L'ARTCI (Autorité de Régulation des Télécommunications/TIC de Côte d'Ivoire)",
      "C) L'ANSSI",
      "D) La Haute Autorité de la Communication Audiovisuelle"
    ],
    reponses_correctes: [1],
    explication_detaillee: "La loi n° 2013-450 confie expressément à l'ARTCI le rôle d'autorité de protection des données à caractère personnel sur tout le territoire ivoirien.",
    fondement_legal: "Loi n° 2013-450 du 19 juin 2013 relative à la protection des données à caractère personnel, Art. 4."
  },
  {
    id: "NUM_002",
    module: "Culture Numérique & E-Justice",
    moduleId: "NUM",
    sous_domaine: "Preuve Numérique & Écrit Électronique",
    niveau_difficulte: 2,
    question: "Sous quelle condition fondamentale l'écrit sous forme électronique a-t-il la même force probante que l'écrit sur support papier en droit ivoirien ?",
    options: [
      "A) S'il est obligatoirement visé par le Greffier en chef",
      "B) Si la personne dont il émane peut être dûment identifiée et qu'il est établi et conservé dans des conditions de nature à en garantir l'intégrité",
      "C) S'il a été préalablement imprimé et légalisé en mairie",
      "D) Uniquement s'il fait l'objet d'un acte notarié physique"
    ],
    reponses_correctes: [1],
    explication_detaillee: "L'écrit électronique a la même force probante que l'écrit papier pourvu que son auteur soit indentifiable et que l'intégrité du document soit garantie de son émission à sa conservation.",
    fondement_legal: "Loi n° 2013-546 du 30 juillet 2013 relative aux transactions électroniques, Art. 24."
  },
  {
    id: "NUM_003",
    module: "Culture Numérique & E-Justice",
    moduleId: "NUM",
    sous_domaine: "Cybersécurité & Incidents Majeurs",
    niveau_difficulte: 2,
    question: "Quelle cellule nationale opérationnelle rattachée à l'ARTCI est chargée de la coordination et du traitement des incidents de sécurité informatique (CERT) en Côte d'Ivoire ?",
    options: [
      "A) Le CI-CERT",
      "B) La DITT (Division de l'Informatique et des Traces Technologiques)",
      "C) La Police Scientifique Judiciaire",
      "D) L'E-Justice Hub"
    ],
    reponses_correctes: [0],
    explication_detaillee: "Le CI-CERT (Computer Emergency Response Team de Côte d'Ivoire) est l'entité étatique dédiée à la prévention et à la réponse aux cyberattaques.",
    fondement_legal: "Loi n° 2013-451 du 19 juin 2013 relative à la lutte contre la cybercriminalité."
  }
];

// Configuration des matières officielles
const MODULES_DATA = [
  { id: "CIV", name: "Droit Civil & Personnes", quota: 4500, color: "bg-blue-500", icon: "fa-book" },
  { id: "PEN", name: "Droit Pénal Général & Spécial", quota: 4000, color: "bg-red-500", icon: "fa-gavel" },
  { id: "OHA", name: "Droit Commercial / OHADA", quota: 3500, color: "bg-amber-500", icon: "fa-briefcase" },
  { id: "ORG", name: "Organisation & Système Judiciaire Ivoirien", quota: 3000, color: "bg-emerald-500", icon: "fa-building-columns" },
  { id: "ADM", name: "Droit Administratif & Contentieux", quota: 3000, color: "bg-purple-500", icon: "fa-scale-balanced" },
  { id: "NUM", name: "Culture Numérique & E-Justice", quota: 2000, color: "bg-cyan-500", icon: "fa-laptop-code" }
];

// Bibliothèque de Fiches de Synthèse Gratuites
const FICHES_SYNTHESE = [
  {
    id: "FICHE_01",
    titre: "La Hiérarchie des Juridictions en Côte d'Ivoire",
    matiere: "Organisation Judiciaire",
    badge: "Réforme 2020",
    description: "Cartographie complète après l'éclatement de la Cour Suprême : Cour de Cassation, Conseil d'État, Cour des Comptes et Tribunal des Conflits.",
    pointsCles: [
      "Cour de Cassation : juge du droit judiciaire (civil, pénal, social, commercial)",
      "Conseil d'État : juge suprême du contentieux administratif et du REP",
      "Cour des Comptes : juridiction financière et contrôle des deniers publics",
      "Tribunal des Conflits : régulation des conflits d'attribution entre ordres"
    ],
    fondement: "Loi Constitutionnelle n° 2020-348 & Lois Organiques n° 2020-967 / 968 / 969."
  },
  {
    id: "FICHE_02",
    titre: "Le Régime Nouveau du Divorce en Droit Ivoirien",
    matiere: "Droit Civil & Personnes",
    badge: "Loi 2022-793",
    description: "Les nouveaux cas de divorce, la fin de la faute exclusive obligatoire et la consécration de l'altération définitive du lien conjugal.",
    pointsCles: [
      "Consentement mutuel : par acte sous signature privée contresigné ou par voie judiciaire",
      "Altération définitive : cessation de la communauté de vie depuis au moins un (1) an",
      "Faute caractérisée : maintien du divorce contentieux pour violation grave et renouvelée des devoirs du mariage",
      "Mesures provisoires : attribution prioritaire du domicile familial dans l'intérêt des enfants"
    ],
    fondement: "Loi n° 2022-793 du 13 octobre 2022 relative au divorce et à la séparation de corps."
  },
  {
    id: "FICHE_03",
    titre: "Garde à Vue & Détention Préventive en Procédure Pénale",
    matiere: "Droit Pénal & Procédure",
    badge: "Garanties Légales",
    description: "Délais stricts, droits de la défense, prolongations légales et contrôle par le juge d'instruction.",
    pointsCles: [
      "Garde à vue initiale : 48 heures au maximum sous contrôle de l'OPJ et du Procureur",
      "Prolongation de garde à vue : autorisation écrite du Procureur (max 48h supplémentaires)",
      "Détention préventive correctionnelle : mandat de dépôt valable 6 mois au maximum",
      "Droit absolu à l'examen médical et à la communication avec un conseil juridique"
    ],
    fondement: "Code de Procédure Pénale ivoirien, Articles 63, 138 et suivants."
  },
  {
    id: "FICHE_04",
    titre: "Le Bail à Usage Professionnel en Droit OHADA",
    matiere: "Droit Commercial / OHADA",
    badge: "AUDCG Révisé",
    description: "Conditions de formation, droit au renouvellement, fixation du loyer et signification impérative du congé.",
    pointsCles: [
      "Champ d'application : tout local affecté à une activité commerciale, industrielle ou artisanale",
      "Préavis de congé : minimum de 6 mois signifié par acte d'huissier de justice",
      "Droit au renouvellement : acquis après 2 années d'exploitation effective",
      "Indemnité d'éviction : due en cas de refus injustifié de renouvellement par le bailleur"
    ],
    fondement: "Acte Uniforme OHADA portant Droit Commercial Général (AUDCG), Articles 101 à 134."
  },
  {
    id: "FICHE_05",
    titre: "Le Recours pour Excès de Pouvoir (REP) devant le Conseil d'État",
    matiere: "Droit Administratif",
    badge: "Contentieux Public",
    description: "Conditions de recevabilité, délai impératif du recours administratif préalable et cas d'ouverture.",
    pointsCles: [
      "Recours gracieux ou hiérarchique obligatoire : formé dans les 2 mois de la publication",
      "Silence de l'administration pendant 4 mois : vaut décision implicite de rejet",
      "Délai de saisine du Conseil d'État : 2 mois à compter du rejet exprès ou implicite",
      "Cas d'ouverture : incompétence, vice de forme, violation de la loi, détournement de pouvoir"
    ],
    fondement: "Loi n° 2020-968 portant organisation du Conseil d'État & Principes Généraux."
  },
  {
    id: "FICHE_06",
    titre: "Protection des Données Personnelles & E-Justice en CI",
    matiere: "Culture Numérique & TIC",
    badge: "Loi 2013-450",
    description: "Attributions de l'ARTCI, formalités préalables de traitement et valeur probante de l'écrit électronique.",
    pointsCles: [
      "Autorité de protection : ARTCI investie de missions de régulation et de sanction",
      "Principes fondamentaux : finalité légitime, proportionnalité, durée limitée et consentement",
      "Preuve électronique : équivalence probante pleine si l'auteur est identifiable et l'intégrité garantie",
      "Cybersécurité : rôle opérationnel centralisé du CI-CERT pour les menaces d'envergure"
    ],
    fondement: "Loi n° 2013-450 sur les données personnelles & Loi n° 2013-546 sur les transactions électroniques."
  }
];

// Répertoire Officiel des Textes Juridiques Ivoiriens & OHADA via "Loi d'ici"
const LOIS_D_ICI_REPERTOIRE = [
  {
    titre: "Code Pénal Ivoirien",
    ref: "Loi n° 2019-574",
    categorie: "Pénal",
    description: "Infractions, peines, responsabilité pénale et infractions spéciales.",
    url: "https://loidici.biz/recherche/?q=code+penal"
  },
  {
    titre: "Code de Procédure Pénale",
    ref: "Loi n° 1960-366 modifiée",
    categorie: "Pénal & Procédure",
    description: "Police judiciaire, garde à vue, instruction, jugement et voies de recours.",
    url: "https://loidici.biz/recherche/?q=code+de+procedure+penale"
  },
  {
    titre: "Code Civil & Droit de la Famille",
    ref: "Lois 2019 et 2022",
    categorie: "Civil",
    description: "Mariage (2019-570), divorce (2022-793), filiation (2019-571), successions (2019-573).",
    url: "https://loidici.biz/recherche/?q=mariage+divorce+successions"
  },
  {
    titre: "Code de Procédure Civile, Commerciale et Administrative",
    ref: "Loi n° 72-833 modifiée",
    categorie: "Procédure",
    description: "Assignation, règles de compétence, instruction civile, exécution des jugements.",
    url: "https://loidici.biz/recherche/?q=code+de+procedure+civile"
  },
  {
    titre: "Actes Uniformes OHADA",
    ref: "Droit des Affaires Harmonisé",
    categorie: "OHADA & Affaires",
    description: "Droit commercial général (AUDCG), sociétés (AUSCGIE), sûretés (AUS), voies d'exécution (AUVE).",
    url: "https://loidici.biz/recherche/?q=ohada"
  },
  {
    titre: "Organisation Judiciaire & Conseil d'État",
    ref: "Lois Organiques 2020",
    categorie: "Institutions",
    description: "Cour de Cassation (2020-967), Conseil d'État (2020-968), Tribunal des Conflits (2020-969).",
    url: "https://loidici.biz/recherche/?q=conseil+d+etat+cour+de+cassation"
  }
];
