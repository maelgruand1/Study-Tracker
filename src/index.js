// Vérifier si l'utilisateur a activé les notifications
if ("Notification" in window) {
    Notification.requestPermission();
}
// Sélection des éléments HTML
var timeDisplay = document.getElementById("time-display");
var startStopButton = document.getElementById("start-stop");
var resetButton = document.getElementById("reset");
var workDurationInput = document.getElementById("work-duration");
var shortBreakInput = document.getElementById("short-break-duration");
var longBreakInput = document.getElementById("long-break-duration");
var sessionTitle = document.getElementById("session-title");
var sessionHistory = document.getElementById("session-history");
var themeToggle = document.getElementById("theme-toggle");
var timer;
var timeLeft = 25 * 60;
var isRunning = false;
var pomodoroCount = 0;
var sessionType = "work";
// Charger l'historique des sessions depuis localStorage
function loadHistory() {
    var savedHistory = localStorage.getItem("studyTrackerHistory");
    if (savedHistory) {
        sessionHistory.innerHTML = savedHistory;
        pomodoroCount = document.querySelectorAll("#session-history li").length;
    }
}
// Sauvegarder l'historique des sessions dans localStorage
function saveHistory() {
    localStorage.setItem("studyTrackerHistory", sessionHistory.innerHTML);
}
// Affichage du temps
function updateDisplay() {
    var minutes = Math.floor(timeLeft / 60);
    var seconds = timeLeft % 60;
    timeDisplay.textContent = "".concat(minutes, ":").concat(seconds < 10 ? "0" : "").concat(seconds);
}
// Démarrer ou arrêter le timer
function toggleTimer() {
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
        startStopButton.textContent = "Démarrer";
    }
    else {
        timer = setInterval(function () {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            }
            else {
                clearInterval(timer);
                handleSessionEnd();
            }
        }, 1000);
        isRunning = true;
        startStopButton.textContent = "Pause";
    }
}
// Gérer la fin d'une session
function handleSessionEnd() {
    if (sessionType === "work") {
        pomodoroCount++;
        sessionHistory.innerHTML += "<li>Pomodoro ".concat(pomodoroCount, " termin\u00E9 !</li>");
        saveHistory();
        sendNotification("Pomodoro terminé ! 🎉", "Prenez une pause.");
        if (pomodoroCount % 4 === 0) {
            startLongBreak();
        }
        else {
            startShortBreak();
        }
    }
    else {
        sendNotification("Pause terminée !", "Reprenez votre travail !");
        startWorkSession();
    }
}
// Envoyer une notification
function sendNotification(title, message) {
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification(title, { body: message });
    }
}
// Démarrer une session de travail
function startWorkSession() {
    sessionType = "work";
    timeLeft = parseInt(workDurationInput.value) * 60;
    sessionTitle.textContent = "Pomodoro";
    updateDisplay();
}
// Démarrer une pause courte
function startShortBreak() {
    sessionType = "shortBreak";
    timeLeft = parseInt(shortBreakInput.value) * 60;
    sessionTitle.textContent = "Pause courte";
    updateDisplay();
}
// Démarrer une pause longue
function startLongBreak() {
    sessionType = "longBreak";
    timeLeft = parseInt(longBreakInput.value) * 60;
    sessionTitle.textContent = "Pause longue";
    updateDisplay();
}
// Réinitialiser le timer
function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    startWorkSession();
    startStopButton.textContent = "Démarrer";
}
// Basculer entre mode clair et sombre
function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    themeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️ Mode Clair" : "🌙 Mode Sombre";
}
// Sélection du bouton Supprimer Historique
var deleteStorageButton = document.getElementById("deleteStorage");
// Fonction pour supprimer l'historique des sessions
function deleteHistory() {
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
