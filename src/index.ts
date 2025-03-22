// Vérifier si l'utilisateur a activé les notifications
if ("Notification" in window) {
    Notification.requestPermission();
}

// Sélection des éléments HTML
const timeDisplay = document.getElementById("time-display") as HTMLParagraphElement;
const startStopButton = document.getElementById("start-stop") as HTMLButtonElement;
const resetButton = document.getElementById("reset") as HTMLButtonElement;
const workDurationInput = document.getElementById("work-duration") as HTMLInputElement;
const shortBreakInput = document.getElementById("short-break-duration") as HTMLInputElement;
const longBreakInput = document.getElementById("long-break-duration") as HTMLInputElement;
const sessionTitle = document.getElementById("session-title") as HTMLHeadingElement;
const sessionHistory = document.getElementById("session-history") as HTMLUListElement;
const themeToggle = document.getElementById("theme-toggle") as HTMLButtonElement;

let timer: number | undefined;
let timeLeft = 25 * 60;
let isRunning = false;
let pomodoroCount = 0;
let sessionType: "work" | "shortBreak" | "longBreak" = "work";

// Charger l'historique des sessions depuis localStorage
function loadHistory(): void {
    const savedHistory = localStorage.getItem("studyTrackerHistory");
    if (savedHistory) {
        sessionHistory.innerHTML = savedHistory;
        pomodoroCount = document.querySelectorAll("#session-history li").length;
    }
}

// Sauvegarder l'historique des sessions dans localStorage
function saveHistory(): void {
    localStorage.setItem("studyTrackerHistory", sessionHistory.innerHTML);
}

// Affichage du temps
function updateDisplay(): void {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timeDisplay.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

// Démarrer ou arrêter le timer
function toggleTimer(): void {
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
        startStopButton.textContent = "Démarrer";
    } else {
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                clearInterval(timer);
                handleSessionEnd();
            }
        }, 1000);
        isRunning = true;
        startStopButton.textContent = "Pause";
    }
}

// Gérer la fin d'une session
function handleSessionEnd(): void {
    if (sessionType === "work") {
        pomodoroCount++;
        sessionHistory.innerHTML += `<li>Pomodoro ${pomodoroCount} terminé !</li>`;
        saveHistory();
        sendNotification("Pomodoro terminé ! 🎉", "Prenez une pause.");

        if (pomodoroCount % 4 === 0) {
            startLongBreak();
        } else {
            startShortBreak();
        }
    } else {
        sendNotification("Pause terminée !", "Reprenez votre travail !");
        startWorkSession();
    }
}

// Envoyer une notification
function sendNotification(title: string, message: string): void {
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification(title, { body: message });
    }
}

// Démarrer une session de travail
function startWorkSession(): void {
    sessionType = "work";
    timeLeft = parseInt(workDurationInput.value) * 60;
    sessionTitle.textContent = "Pomodoro";
    updateDisplay();
}

// Démarrer une pause courte
function startShortBreak(): void {
    sessionType = "shortBreak";
    timeLeft = parseInt(shortBreakInput.value) * 60;
    sessionTitle.textContent = "Pause courte";
    updateDisplay();
}

// Démarrer une pause longue
function startLongBreak(): void {
    sessionType = "longBreak";
    timeLeft = parseInt(longBreakInput.value) * 60;
    sessionTitle.textContent = "Pause longue";
    updateDisplay();
}

// Réinitialiser le timer
function resetTimer(): void {
    clearInterval(timer);
    isRunning = false;
    startWorkSession();
    startStopButton.textContent = "Démarrer";
}

// Basculer entre mode clair et sombre
function toggleTheme(): void {
    document.body.classList.toggle("dark-mode");
    themeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️ Mode Clair" : "🌙 Mode Sombre";
}

// Sélection du bouton Supprimer Historique
const deleteStorageButton = document.getElementById("deleteStorage") as HTMLButtonElement;

// Fonction pour supprimer l'historique des sessions
function deleteHistory(): void {
    localStorage.removeItem("studyTrackerHistory"); // Supprime les données du stockage
    sessionHistory.innerHTML = ""; // Efface l'affichage dans l'UI
    pomodoroCount = 0; // Réinitialise le compteur des Pomodoros
}

// Ajout de l'écouteur d'événement au bouton
deleteStorageButton.addEventListener("click", deleteHistory);



// Écouteurs d'événements
startStopButton.addEventListener("click", toggleTimer);
resetButton.addEventListener("click", resetTimer);
themeToggle.addEventListener("click", toggleTheme);

// Charger l'historique au démarrage
loadHistory();
updateDisplay();
