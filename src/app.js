const STATE_KEY = 'waterTrackerData';
const DEFAULT_GOAL = 2000;

let state = {
    date: typeof new Date() !== 'undefined' ? new Date().toLocaleDateString() : '',
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

async function loadWeather() {
    try {
        if (typeof fetch === 'undefined') return;

        const response = await fetch(
            'https://api.open-meteo.com/v1/forecast?latitude=-15.78&longitude=-47.93&current_weather=true'
        );

        const data = await response.json();

        console.log(
            `Temperatura atual: ${data.current_weather.temperature}°C`
        );

    } catch (error) {
        console.error('Erro ao buscar clima:', error);
    }
}

// 🔒 INIT PROTEGIDO
function init() {
    loadState();
}

// Só executa a inicialização se estiver no navegador e não em ambiente de testes (Node/Jest)
if (typeof document !== 'undefined' && typeof process === 'undefined') {
    init();
    loadWeather();
}

// ✅ EXPORT PARA TESTE
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getTotal, getIntervalText, saveState, loadState };
}