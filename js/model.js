const Model = {
    // Liste des images utilisées pour les cartes
    images: [],

    // Références aux deux cartes actuellement retournées
    firstCard: null,
    secondCard: null,

    // Nombre de tentatives de l'utilisateur
    attempts: 0,

    // Nombre de paires trouvées
    matchedPairs: 0,

    // Temps restant pour le jeu
    timer: 25, // Valeur initiale par défaut

    // Temps de base utilisé pour calculer le temps écoulé
    initialTimer: 25,

    // Référence à l'intervalle du minuteur (utilisé pour l'arrêter)
    timerInterval: null,

    // Verrouillage du plateau pour empêcher les clics multiples pendant une animation
    lockBoard: false,

    /**
     * Met à jour la difficulté du jeu.
     * Charge les images, ajuste le temps total en fonction de la difficulté.
     */
    updateDifficulty(difficulty) {
        if (difficulty === 'easy') {
            this.images = this.loadImages('animal'); // Charge les images pour le niveau facile
            this.timer = 25;
            this.initialTimer = 25; // Temps de base pour calculer le temps écoulé
        } else if (difficulty === 'medium') {
            this.images = this.loadImages('fruit'); // Images pour niveau intermédiaire
            this.timer = 35;
            this.initialTimer = 35;
        } else if (difficulty === 'hard') {
            this.images = this.loadImages('object'); // Images pour niveau difficile
            this.timer = 40;
            this.initialTimer = 40;
        }
    },

    /**
     * Charge les images en fonction de la catégorie (animal, fruit, objet).
     * @param {string} category - La catégorie d'images à charger.
     * @returns {array} Un tableau contenant des paires d'images.
     */
    loadImages(category) {
        let imgCount;

        // Définit combien d'images charger selon la catégorie
        if (category === 'animal') {
            imgCount = 4; // 4 paires pour le niveau facile
        } else if (category === 'fruit') {
            imgCount = 8; // 8 paires pour le niveau intermédiaire
        } else if (category === 'object') {
            imgCount = 10; // 10 paires pour le niveau difficile
        }

        const imagesArray = [];
        for (let i = 1; i <= imgCount; i++) {
            imagesArray.push(`images/${category}${i}.jpg`); // Charge les images
        }

        // Retourne un tableau contenant chaque image en double (pour former des paires)
        return [...imagesArray, ...imagesArray];
    },

    /**
     * Mélange un tableau d'images de manière aléatoire.
     * @param {array} images - Le tableau des images à mélanger.
     * @returns {array} Le tableau mélangé.
     */
    shuffleCards(images) {
        for (let i = images.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); // Index aléatoire
            [images[i], images[j]] = [images[j], images[i]]; // Échange les positions
        }
        return images;
    },

    /**
     * Initialise un nouveau jeu.
     * Réinitialise les cartes, les tentatives et mélange les images.
     * @returns {array} Le tableau mélangé des images.
     */
    startNewGame() {
        this.firstCard = null; // Réinitialise la première carte retournée
        this.secondCard = null; // Réinitialise la deuxième carte retournée
        this.attempts = 0; // Réinitialise le compteur de tentatives
        this.matchedPairs = 0; // Réinitialise le compteur de paires trouvées
        this.lockBoard = false; // Déverrouille le plateau

        // Efface l'ancien minuteur
        clearInterval(this.timerInterval);

        // Mélange les images pour un nouveau jeu
        const shuffledImages = this.shuffleCards(this.images);

        // Initialise le minuteur si ce n'est pas déjà fait
        if (!this.timerInterval) {
            this.timerInterval = setInterval(() => {
                if (this.timer > 0) {
                    this.timer--; // Diminue le temps restant
                    View.renderScore(this.attempts, this.timer); // Met à jour l'affichage
                } else {
                    clearInterval(this.timerInterval); // Arrête le minuteur si le temps est écoulé
                    this.timerInterval = null;
                }
            }, 1000); // Diminue le temps toutes les secondes
        }

        return shuffledImages; // Retourne les images mélangées pour les afficher
    },

    /**
     * Réinitialise toutes les variables pour recommencer un jeu.
     */
    reset() {
        this.firstCard = null;
        this.secondCard = null;
        this.attempts = 0;
        this.matchedPairs = 0;
        this.lockBoard = false;
        clearInterval(this.timerInterval); // Arrête le minuteur
    },

    /**
     * Gère le retournement d'une carte.
     * @param {HTMLElement} card - La carte cliquée.
     * @param {function} callback - Une fonction pour signaler un résultat (win/no-match).
     */
    handleCardFlip(card, callback) {
        // Si aucune carte n'est retournée, enregistre la première carte
        if (!this.firstCard) {
            this.firstCard = card;
            return;
        }

        this.secondCard = card; // Enregistre la deuxième carte
        this.lockBoard = true; // Verrouille le plateau pour éviter des clics multiples

        this.attempts++; // Augmente le nombre de tentatives

        // Vérifie si les deux cartes retournées sont identiques
        if (this.firstCard.dataset.image === this.secondCard.dataset.image) {
            this.matchedPairs++; // Augmente le compteur de paires trouvées

            // Ajoute une animation pour les cartes correspondantes
            this.firstCard.classList.add('matched');
            this.secondCard.classList.add('matched');

            this.resetTurn(); // Réinitialise les cartes retournées

            // Si toutes les paires sont trouvées, signale une victoire
            if (this.matchedPairs === this.images.length / 2) {
                setTimeout(() => {
                    callback('win');
                }, 500); // Délai pour permettre de voir la dernière carte
            }
        } else {
            // Si les cartes ne correspondent pas, les retourne face cachée après un délai
            setTimeout(() => {
                callback('no-match');
                this.resetTurn();
            }, 1000);
        }
    },

    /**
     * Réinitialise l'état des cartes après une tentative.
     */
    resetTurn() {
        this.firstCard = null;
        this.secondCard = null;
        this.lockBoard = false; // Déverrouille le plateau
    }
};
