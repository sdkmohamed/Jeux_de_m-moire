const Controller = {
    // Sélection des éléments HTML nécessaires
    startBtn: document.getElementById('start-btn'), // Bouton "Commencer le jeu"
    resetBtn: document.getElementById('reset-btn'), // Bouton "Réinitialiser"
    difficultySelect: document.getElementById('difficulty'), // Menu déroulant pour la difficulté
    modal: document.getElementById('game-message'), // Fenêtre modale pour les messages (gagné/perdu)
    messageText: document.getElementById('message-text'), // Texte affiché dans la modale
    closeBtn: document.getElementById('close-btn'), // Bouton pour fermer la modale

    /**
     * Initialise le jeu en attachant les gestionnaires d'événements.
     */
    init() {
        // Ajoute un gestionnaire d'événement pour chaque bouton ou élément interactif
        this.startBtn.addEventListener('click', this.startGame.bind(this)); // Démarre le jeu
        this.resetBtn.addEventListener('click', this.resetGame.bind(this)); // Réinitialise le jeu
        this.difficultySelect.addEventListener('change', this.updateDifficulty.bind(this)); // Change la difficulté
        this.closeBtn.addEventListener('click', this.closeModal.bind(this)); // Ferme la fenêtre modale

        // Configure l'état initial du jeu
        this.initGame();
    },

    /**
     * Prépare l'interface utilisateur à l'état initial.
     */
    initGame() {
        document.getElementById('score').textContent = null; // Réinitialise l'affichage des tentatives
        document.getElementById('timer').textContent = null; // Réinitialise l'affichage du timer
        this.resetBtn.style.display = 'none'; // Cache le bouton "Réinitialiser"
        this.startBtn.style.display = 'inline-block'; // Affiche le bouton "Commencer le jeu"
        this.difficultySelect.disabled = false; // Permet de choisir la difficulté
    },

    /**
     * Met à jour les paramètres du jeu en fonction de la difficulté choisie.
     */
    updateDifficulty() {
        const difficulty = this.difficultySelect.value; // Récupère la difficulté sélectionnée
        Model.updateDifficulty(difficulty); // Met à jour les paramètres dans le modèle
    },

    /**
     * Démarre le jeu après avoir validé les prérequis (difficulté choisie).
     */
    startGame() {
        if (Model.images.length === 0) { // Si aucune difficulté n'est choisie
            alert('Veuillez sélectionner une difficulté.'); // Alerte utilisateur
            return; // Arrête l'exécution
        }

        // Change l'interface pour indiquer que le jeu est en cours
        this.startBtn.style.display = 'none'; // Cache le bouton "Commencer"
        this.resetBtn.style.display = 'inline-block'; // Affiche le bouton "Réinitialiser"
        this.difficultySelect.disabled = true; // Désactive le menu déroulant

        // Démarre un nouveau jeu
        const shuffledImages = Model.startNewGame();
        View.renderGameBoard(shuffledImages); // Affiche les cartes mélangées
        View.renderScore(Model.attempts, Model.timer); // Affiche le score et le timer

        // Lance le minuteur et gère la fin du temps
        Model.timerInterval = View.startTimer(Model.timer, () => {
            const timeUsed = Model.initialTimer - Model.timer; // Calcule le temps utilisé
            const allCardsFlipped = Array.from(document.querySelectorAll('.card')).every(card => card.classList.contains('flipped'));

            if (!allCardsFlipped) {
                // Affiche une modale si le temps est écoulé et toutes les cartes ne sont pas retournées
                View.showModal(
                    `Temps écoulé !<br>Vous avez effectué ${Model.attempts} tentatives.<br>Temps utilisé : ${timeUsed}s`,
                    'lose'
                );
            }
        });
    },

    /**
     * Réinitialise le jeu après confirmation de l'utilisateur.
     */
    resetGame() {
        // Affiche une alerte de confirmation
        const userConfirmed = confirm('Êtes-vous sûr de vouloir réinitialiser le jeu ?');
        if (!userConfirmed) return; // Si l'utilisateur annule, ne fait rien

        // Recharge la page pour revenir à l'état initial
        location.reload();
    },

    /**
     * Gère le clic sur une carte.
     * @param {HTMLElement} card - La carte cliquée.
     */
    flipCard(card) {
        // Empêche de retourner une carte déjà retournée ou pendant un verrouillage
        if (Model.lockBoard || card.classList.contains('flipped')) return;

        // Retourne visuellement la carte
        View.flipCard(card);

        // Passe la logique de la carte retournée au modèle
        Model.handleCardFlip(card, status => {
            if (status === 'win') {
                const totalTimeUsed = Model.initialTimer - Model.timer; // Temps total utilisé
                const totalAttempts = Model.attempts; // Nombre total de tentatives

                // Affiche une modale de victoire
                View.showModal(
                    `Félicitations, vous avez gagné !<br>Tentatives : ${totalAttempts}<br>Temps utilisé : ${totalTimeUsed}s`,
                    'win'
                );
            } else if (status === 'no-match') {
                // Si les cartes ne correspondent pas, les retourne après un délai
                View.unflipCards([Model.firstCard, Model.secondCard]);
            }
        });

        // Met à jour le score dans l'interface utilisateur
        View.renderScore(Model.attempts, Model.timer);
    },

    /**
     * Affiche une fenêtre modale avec un message personnalisé.
     * @param {string} message - Le message à afficher.
     * @param {string} type - Le type de message (gagné, perdu, réinitialisé).
     */
    showModal(message, type) {
        const modal = document.getElementById('game-message'); // Récupère l'élément modal
        const messageText = document.getElementById('message-text'); // Texte dans la modale

        messageText.innerHTML = message; // Définit le contenu du message
        messageText.className = type; // Ajoute une classe CSS pour styliser (win, lose, reset)
        modal.classList.remove('hidden'); // Rend la modale visible
        modal.classList.add('visible');
    },

    /**
     * Ferme la fenêtre modale et réinitialise la page.
     */
    closeModal() {
        this.modal.classList.remove('visible'); // Cache la modale
        location.reload(); // Recharge la page
    }
};

// Initialise le contrôleur à la fin du script
Controller.init();
