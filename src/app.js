const STATE_KEY = 'waterTrackerData';
const DEFAULT_GOAL = 2000;

let state = {
    date: new Date().toLocaleDateString(),
    goal: DEFAULT_GOAL,
    logs: []
};

// 🔒 DOM (PROTEGIDO)
const getDOMElements = () => ({
    currentAmount: typeof document !== 'undefined' ? document.getElementById('currentAmount') : null,
    goalAmount: typeof document !== 'undefined' ? document.getElementById('goalAmount') : null,
    remainingAmount: typeof document !== 'undefined' ? document.getElementById('remainingAmount') : null,
    progressBar: typeof document !== 'undefined' ? document.getElementById('progressBar') : null,
    progressPercentage: typeof document !== 'undefined' ? document.getElementById('progressPercentage') : null,
    historyList: typeof document !== 'undefined' ? document.getElementById('historyList') : null
});

if (typeof document !== 'undefined') {
    getDOMElements();
}

function loadState() {
    if (typeof localStorage === 'undefined') return;

    const saved = localStorage.getItem(STATE_KEY);
    if (saved) {
        try {
            state = JSON.parse(saved);
            if (!state.logs) state.logs = [];
        } catch (e) {
            console.error('Erro ao carregar:', e);
        }
    }
}

function saveState() {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

function getTotal(logs = state.logs) {
    return logs.reduce((acc, log) => acc + log.amount, 0);

}

function getIntervalText(prevTimestamp, currentTimestamp) {
    const diff = currentTimestamp - prevTimestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
        const remainingMins = minutes % 60;
        return `+${hours}h${remainingMins > 0 ? remainingMins + 'm' : ''}`;
    }
    return `+${minutes}m`;
}

// 🔒 INIT PROTEGIDO
function init() {
    loadState();
}

// só roda no navegador
if (typeof document !== 'undefined') {
    init();
}

// ✅ EXPORT PARA TESTE
module.exports = { getTotal, getIntervalText, saveState, loadState };