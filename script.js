let startTime = null;
let totalTime = 0;
let running = false;

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
    totalTime += now - startTime;
    running = false;
    updateDisplay(); // mostrar acumulado antes de guardar
    saveSession();
    renderHistory();
    updateButtons();
  }
}

function finalizeSession() {
  const sumHistorial = history.reduce((a, b) => a + b, 0);
  const totalAcumulado = sumHistorial + totalTime;

  // Mostrar cartel de "Hoy has trabajado:"
  const finalMsg = document.getElementById('finalMessage');
  finalMsg.style.display = 'block';
  finalMsg.textContent = 'Hoy has trabajado: ' + formatTime(totalAcumulado);

  // Resetear acumulado
  startTime = null;
  totalTime = 0;
  history = [];
  localStorage.removeItem('InterpreterWorkHistory');

  updateDisplay();
  renderHistory();
  updateButtons();
}




function saveSession() {
  if (totalTime > 0) {
    history.push(totalTime);
    localStorage.setItem('InterpreterWorkHistory', JSON.stringify(history));
    //totalTime = 0; // ahora sí lo reseteamos
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
    
    // Sumamos todo el historial + el totalTime actual
    const sumHistorial = history.reduce((a, b) => a + b, 0);
    const totalAcumulado = sumHistorial + totalTime;

    accumulatedTime.textContent = 'Tiempo acumulado: ' + formatTime(totalAcumulado);
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

// Eventos
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', finalizeSession);
clearBtn.addEventListener('click', clearHistory);



// Estado inicial
renderHistory();
updateDisplay();
updateButtons();
