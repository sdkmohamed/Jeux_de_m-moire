const View = {
    /**
     * Met à jour l'affichage des tentatives et du temps restant.
     * @param {number} attempts - Nombre de tentatives effectuées.
     * @param {number} timer - Temps restant en secondes.
     */
    renderScore(attempts, timer) {
        document.getElementById('score').textContent = `Tentatives : ${attempts}`; // Affiche le nombre de tentatives
        document.getElementById('timer').textContent = `Temps : ${timer}s`; // Affiche le temps restant
    },

    /**
     * Génère et affiche le plateau de jeu avec les cartes.
     * @param {string[]} images - Tableau des chemins des images à utiliser pour les cartes.
     */
    renderGameBoard(images) {
        const gameBoard = document.querySelector('.game-board'); // Sélectionne le conteneur du plateau
        gameBoard.innerHTML = ''; // Vide le plateau avant de le remplir

        // Parcourt chaque image et crée une carte correspondante
        images.forEach(image => {
            const card = document.createElement('div'); // Crée l'élément carte
            card.classList.add('card'); // Ajoute la classe CSS 'card'
            card.dataset.image = image; // Associe l'image à la carte via un attribut personnalisé

            // Crée la face avant de la carte
            const frontFace = document.createElement('div');
            frontFace.classList.add('front-face'); // Classe CSS pour la face avant
            frontFace.style.backgroundImage = `url(${image})`; // Définit l'image comme arrière-plan

            // Crée la face arrière de la carte
            const backFace = document.createElement('div');
            backFace.classList.add('back-face'); // Classe CSS pour la face arrière

            // Ajoute les deux faces à la carte
            card.appendChild(frontFace);
            card.appendChild(backFace);

            // Ajoute la carte au plateau
            gameBoard.appendChild(card);

            // Attache un gestionnaire de clic pour retourner la carte
            card.addEventListener('click', () => Controller.flipCard(card));
        });
    },

    /**
     * Applique les classes nécessaires pour retourner une carte.
     * @param {HTMLElement} card - La carte à retourner.
     */
    flipCard(card) {
        card.classList.add('flipped'); // Ajoute une classe pour marquer la carte comme retournée
        card.classList.add('scale-up'); // Animation d'agrandissement
        card.classList.add('rotate'); // Animation de rotation
    },

    /**
     * Retire les classes des cartes pour les remettre face cachée.
     * @param {HTMLElement[]} cards - Tableau des cartes à remettre face cachée.
     */
    unflipCards(cards) {
        cards.forEach(card => card.classList.remove('flipped', 'scale-up', 'rotate')); // Retire les animations et marqueurs
    },

    /**
     * Lance le minuteur et met à jour l'affichage du temps restant.
     * @param {number} timer - Temps initial du minuteur.
     * @param {Function} onTimeUp - Fonction à exécuter lorsque le temps est écoulé.
     * @returns {number} - Identifiant de l'intervalle pour l'arrêter si nécessaire.
     */
    startTimer(timer, onTimeUp) {
        const timerDisplay = document.getElementById('timer'); // Sélectionne l'élément timer
        let currentTime = timer; // Temps restant initial
        timerDisplay.textContent = `Temps : ${currentTime}s`; // Affiche le temps restant initial
        timerDisplay.style.color = 'green'; // Couleur initiale du texte

        const interval = setInterval(() => {
            currentTime--; // Décrémente le temps restant
            timerDisplay.textContent = `Temps : ${currentTime}s`; // Met à jour l'affichage

            // Change dynamiquement la couleur en fonction du temps restant
            if (currentTime > 15) {
                timerDisplay.style.color = 'green'; // Temps suffisant
            } else if (currentTime > 5) {
                timerDisplay.style.color = 'orange'; // Attention
            } else {
                timerDisplay.style.color = 'red'; // Urgence
            }

            // Vérifie si le temps est écoulé
            if (currentTime <= 0) {
                clearInterval(interval); // Arrête le minuteur
                timerDisplay.textContent = 'Temps : 0s'; // Affiche que le temps est écoulé
                timerDisplay.style.color = 'gray'; // Couleur neutre pour indiquer la fin
                if (onTimeUp) onTimeUp(); // Exécute la fonction callback pour gérer la fin du temps
            }
        }, 1000); // Diminue toutes les secondes

        return interval; // Retourne l'identifiant de l'intervalle
    },

    /**
     * Réinitialise l'affichage du plateau et des scores.
     */
    resetUI() {
        const gameBoard = document.querySelector('.game-board'); // Sélectionne le plateau
        gameBoard.innerHTML = ''; // Vide le plateau

        // Réinitialise l'affichage des scores
        document.getElementById('score').textContent = 'Tentatives : 0';
        document.getElementById('timer').textContent = 'Temps : 0s';
    },

    /**
     * Affiche une fenêtre modale avec un message personnalisé.
     * @param {string} message - Message à afficher dans la modale.
     * @param {string} type - Type de message (win, lose, reset).
     */
    showModal(message, type) {
        const modal = document.getElementById('game-message'); // Sélectionne la modale
        const messageText = document.getElementById('message-text'); // Sélectionne le contenu texte de la modale

        messageText.innerHTML = message; // Définit le texte du message
        messageText.className = type; // Applique une classe CSS pour styliser le message
        modal.classList.remove('hidden'); // Supprime la classe cachée
        modal.classList.add('visible'); // Rendre la modale visible
    },

    /**
     * Ferme la fenêtre modale.
     */
    closeModal() {
        const modal = document.getElementById('game-message'); // Sélectionne la modale
        modal.classList.remove('visible'); // Cache la modale
        modal.classList.add('hidden'); // Ajoute une classe cachée
    }
};
