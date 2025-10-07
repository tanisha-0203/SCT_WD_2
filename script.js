let startTime = 0;
let elapsedTime = 0;
let timerInterval;
let isRunning = false;

const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const lapBtn = document.getElementById("lapBtn");
const lapsList = document.getElementById("laps");
const themeToggle = document.getElementById("themeToggle");

let tickSound = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-tick-tock-clock-timer-1048.mp3");
tickSound.volume = 0.2;
let soundEnabled = true;

// Format time: HH:MM:SS.mmm
function formatTime(ms) {
  const totalSeconds = ms / 1000;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const milliseconds = Math.floor(ms % 1000);

  return (
    String(hours).padStart(2,"0") + ":" +
    String(minutes).padStart(2,"0") + ":" +
    String(seconds).padStart(2,"0") + "." +
    String(milliseconds).padStart(3,"0")
  );
}

function updateDisplay() {
  const currentTime = Date.now() - startTime + elapsedTime;
  timerDisplay.textContent = formatTime(currentTime);

  // Soft tick every second
  if (Math.floor(currentTime / 1000) !== Math.floor((currentTime - 10)/1000)) {
    if (soundEnabled && isRunning) {
      tickSound.currentTime = 0;
      tickSound.play().catch(()=>{});
    }
  }
}

function startTimer() {
  if (!isRunning) {
    startTime = Date.now();
    timerInterval = setInterval(updateDisplay, 10);
    isRunning = true;
    navigator.vibrate(50);
  }
}

function pauseTimer() {
  if (isRunning) {
    clearInterval(timerInterval);
    elapsedTime += Date.now() - startTime;
    isRunning = false;
    navigator.vibrate(30);
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  startTime = 0;
  elapsedTime = 0;
  isRunning = false;
  timerDisplay.textContent = "00:00:00.000";
  lapsList.innerHTML = "";
  navigator.vibrate(100);
}

function recordLap() {
  if (isRunning || elapsedTime > 0) {
    const currentTime = Date.now() - startTime + elapsedTime;
    const li = document.createElement("li");
    li.textContent = "Lap " + (lapsList.children.length + 1) + ": " + formatTime(currentTime);
    lapsList.prepend(li);
    navigator.vibrate([30,50,30]);
  }
}

// Dark/Light mode toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

// Event listeners
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);
lapBtn.addEventListener("click", recordLap);

// Initialize with dark mode off
document.body.classList.add("light-mode");
