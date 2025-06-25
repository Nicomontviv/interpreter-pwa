let startTime = null;
let totalTime = 0;
let running = false;
let currentSessionTime = 0; // Tiempo de la sesión actual

let history = JSON.parse(localStorage.getItem('InterpreterWorkHistory')) || [];

const statusText = document.getElementById('statusText');
const accumulatedTime = document.getElementById('accumulatedTime');
const historyList = document.getElementById('historyList');
const avgDisplay = document.getElementById('avgDisplay');

const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const clearBtn = document.getElementById('clearBtn');

function startTimer() {
  if (!running) {
    startTime = Date.now();
    running = true;
    updateDisplay();
    updateButtons();
    // Sacar cartel de "Hoy has trabajado:"
    const finalMsg = document.getElementById('finalMessage');
    finalMsg.style.display = 'none';
  }
}

function pauseTimer() {
  if (running) {
    const now = Date.now();
    currentSessionTime = now - startTime; // Solo el tiempo de esta sesión
    totalTime += currentSessionTime; // Acumular al total general
    running = false;
    
    saveSession(); // Guardar la sesión individual
    renderHistory(); // Actualizar el historial
    updateDisplay(); // Mostrar tiempo acumulado total
    updateButtons();
  }
}

function finalizeSession() {
  // Si hay una sesión en curso, guardarla primero
  if (running) {
    pauseTimer();
  }
  
  const sumHistorial = history.reduce((a, b) => a + b, 0);

  // Mostrar cartel de "Hoy has trabajado:"
  const finalMsg = document.getElementById('finalMessage');
  finalMsg.style.display = 'block';
  finalMsg.textContent = 'Hoy has trabajado: ' + formatTime(sumHistorial);

  // Resetear todo
  startTime = null;
  totalTime = 0;
  currentSessionTime = 0;
  history = [];
  localStorage.removeItem('InterpreterWorkHistory');

  updateDisplay();
  renderHistory();
  updateButtons();
}

function saveSession() {
  if (currentSessionTime > 0) {
    history.push(currentSessionTime);
    localStorage.setItem('InterpreterWorkHistory', JSON.stringify(history));
  }
}

function clearHistory() {
  history = [];
  localStorage.removeItem('InterpreterWorkHistory');
  renderHistory();
  avgDisplay.textContent = '';
}

function formatTime(ms) {
  let totalSeconds = Math.floor(ms / 1000);
  let hours = Math.floor(totalSeconds / 3600);
  let minutes = Math.floor((totalSeconds % 3600) / 60);
  let seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateDisplay() {
  if (running) {
    statusText.style.color = 'blue';
    statusText.textContent = 'TRABAJANDO';
    accumulatedTime.textContent = 'Tiempo acumulado: ' + formatTime(totalTime);
  } else {
    statusText.textContent = 'DESCANSO';
    statusText.style.color = 'green';
    
    // Mostrar el tiempo total acumulado
    accumulatedTime.textContent = 'Tiempo acumulado: ' + formatTime(totalTime);
  }
}

function renderHistory() {
  historyList.innerHTML = '';
  if (history.length === 0) {
    historyList.textContent = 'No hay registros.';
    return;
  }
  history.forEach((time, idx) => {
    const li = document.createElement('li');
    li.textContent = `Sesión ${idx + 1}: ${formatTime(time)}`;
    historyList.appendChild(li);
  });
}

function updateButtons() {
  startBtn.disabled = running;
  pauseBtn.disabled = !running;
}

// Actualizar display en tiempo real cuando está corriendo
function updateLiveDisplay() {
  if (running) {
    updateDisplay();
  }
}

// Eventos
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', finalizeSession);
clearBtn.addEventListener('click', clearHistory);

// Estado inicial
renderHistory();
updateDisplay();
updateButtons();