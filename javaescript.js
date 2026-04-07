// ---------- CONFIGURAÇÕES E ESTADO ----------
// Chaves do localStorage
const STORAGE_RECORDS = 'hydration_records';
const STORAGE_META_ML = 'hydration_meta_ml';
const STORAGE_LAST_DATE = 'hydration_last_date';

// variáveis principais
let dailyRecords = [];       // array de objetos { timestamp: number, amountMl: number }
let dailyGoalMl = 2000;     // padrão 2 litros = 2000ml

// elementos DOM
const consumidoSpan = document.getElementById('consumidoHoje');
const metaExibidaSpan = document.getElementById('metaExibida');
const metaUnidadeExibidaSpan = document.getElementById('metaUnidadeExibida');
const progressFillBar = document.getElementById('progressFillBar');
const porcentagemTexto = document.getElementById('porcentagemTexto');
const faltandoTexto = document.getElementById('faltandoTexto');
const timelineContainer = document.getElementById('timelineList');
const intervalDisplaySpan = document.getElementById('intervalDisplay');
const consumidoUnidadeSpan = document.getElementById('consumidoUnidade');
const registroUnidadeLabel = document.getElementById('registroUnidadeLabel');
const metaValueInput = document.getElementById('metaValue');
const metaUnitSelect = document.getElementById('metaUnit');

// helper: exibir notificação flutuante simples
function showToast(message, duration = 2000) {
    const existingToast = document.querySelector('.toast-msg');
    if (existingToast) existingToast.remove();
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        if (toast && toast.remove) toast.remove();
    }, duration);
}

// helper: obter data atual como string 'YYYY-MM-DD'
function getTodayKey() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// reset automático se o dia mudou
function checkAndResetIfNewDay() {
    const todayKey = getTodayKey();
    const storedLastDate = localStorage.getItem(STORAGE_LAST_DATE);
    
    if (storedLastDate !== todayKey) {
        dailyRecords = [];
        saveRecordsToLocal();
        localStorage.setItem(STORAGE_LAST_DATE, todayKey);
        showToast("🌅 Novo dia! Registros zerados. Beba água!");
        return true;
    }
    return false;
}

// carregar meta salva
function loadGoal() {
    const savedGoal = localStorage.getItem(STORAGE_META_ML);
    if (savedGoal !== null && !isNaN(parseFloat(savedGoal))) {
        dailyGoalMl = parseFloat(savedGoal);
    } else {
        dailyGoalMl = 2000;
    }
    updateGoalUI();
}

// atualizar elementos visuais da meta
function updateGoalUI() {
    if (dailyGoalMl >= 1000 && dailyGoalMl % 1000 === 0) {
        const litros = dailyGoalMl / 1000;
        metaExibidaSpan.innerText = litros;
        metaUnidadeExibidaSpan.innerText = 'L';
        metaValueInput.value = litros;
        metaUnitSelect.value = 'litros';
    } else {
        metaExibidaSpan.innerText = dailyGoalMl;
        metaUnidadeExibidaSpan.innerText = 'ml';
        metaValueInput.value = dailyGoalMl;
        metaUnitSelect.value = 'ml';
    }
    registroUnidadeLabel.innerText = 'ml';
    updateProgressAndStats();
}

// salvar registros atuais no localStorage
function saveRecordsToLocal() {
    localStorage.setItem(STORAGE_RECORDS, JSON.stringify(dailyRecords));
}

// carregar registros do dia atual
function loadRecords() {
    const stored = localStorage.getItem(STORAGE_RECORDS);
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
                dailyRecords = parsed.filter(r => typeof r?.timestamp === 'number' && typeof r?.amountMl === 'number');
            } else {
                dailyRecords = [];
            }
        } catch(e) { dailyRecords = []; }
    } else {
        dailyRecords = [];
    }
}

// calcular total consumido hoje (ml)
function getTotalConsumedMl() {
    return dailyRecords.reduce((sum, rec) => sum + rec.amountMl, 0);
}

// calcular intervalo médio entre registros
function getAverageInterval() {
    if (dailyRecords.length < 2) return null;
    const sorted = [...dailyRecords].sort((a,b) => a.timestamp - b.timestamp);
    let totalDiffMinutes = 0;
    for (let i = 1; i < sorted.length; i++) {
        const diffMs = sorted[i].timestamp - sorted[i-1].timestamp;
        const diffMin = diffMs / (1000 * 60);
        totalDiffMinutes += diffMin;
    }
    const avgMinutes = totalDiffMinutes / (sorted.length - 1);
    return avgMinutes;
}

// formatar intervalo para exibição
function formatInterval(avgMinutes) {
    if (avgMinutes === null) return "⏳ Poucos registros";
    if (avgMinutes < 1) return `${Math.round(avgMinutes * 60)} segundos`;
    if (avgMinutes < 60) return `${Math.floor(avgMinutes)} min ${Math.round((avgMinutes % 1)*60)}s`;
    const hours = Math.floor(avgMinutes / 60);
    const mins = Math.round(avgMinutes % 60);
    return `${hours}h ${mins}min`;
}

// atualizar progresso, textos e histórico
function updateProgressAndStats() {
    const totalMl = getTotalConsumedMl();
    let percent = (totalMl / dailyGoalMl) * 100;
    percent = Math.min(100, percent);
    const percentFixed = percent.toFixed(1);
    
    const isGoalRoundLiter = (dailyGoalMl >= 1000 && dailyGoalMl % 1000 === 0);
    if (isGoalRoundLiter && totalMl >= 1000) {
        const totalLitros = totalMl / 1000;
        consumidoSpan.innerText = totalLitros.toFixed(2);
        consumidoUnidadeSpan.innerText = 'L';
        metaUnidadeExibidaSpan.innerText = 'L';
        metaExibidaSpan.innerText = dailyGoalMl / 1000;
    } else if (isGoalRoundLiter && totalMl < 1000) {
        consumidoSpan.innerText = totalMl;
        consumidoUnidadeSpan.innerText = 'ml';
        metaExibidaSpan.innerText = dailyGoalMl / 1000;
        metaUnidadeExibidaSpan.innerText = 'L';
    } else {
        consumidoSpan.innerText = totalMl;
        consumidoUnidadeSpan.innerText = 'ml';
        metaUnidadeExibidaSpan.innerText = 'ml';
        metaExibidaSpan.innerText = dailyGoalMl;
    }
    
    // Faltante
    let faltaMl = dailyGoalMl - totalMl;
    if (faltaMl < 0) faltaMl = 0;
    let faltaText = '';
    if (dailyGoalMl >= 1000 && dailyGoalMl % 1000 === 0 && faltaMl >= 1000) {
        faltaText = `Faltam ${(faltaMl/1000).toFixed(1)} L`;
    } else if (dailyGoalMl >= 1000 && dailyGoalMl % 1000 === 0 && faltaMl < 1000) {
        faltaText = `Faltam ${faltaMl} ml`;
    } else {
        faltaText = `Faltam ${faltaMl} ml`;
    }
    faltandoTexto.innerText = faltaText;
    porcentagemTexto.innerText = `${percentFixed}%`;
    
    // Barra de progresso
    const fillPercent = percent;
    progressFillBar.style.width = `${fillPercent}%`;
    progressFillBar.innerText = fillPercent >= 15 ? `${Math.floor(fillPercent)}%` : '';
    
    // Destaque visual se meta atingida
    if (totalMl >= dailyGoalMl) {
        progressFillBar.classList.add('goal-achieved');
        if (totalMl === dailyGoalMl || (totalMl > dailyGoalMl && !window._goalNotified)) {
            showToast("🎉 Parabéns! Meta diária atingida! 💪");
            window._goalNotified = true;
        }
    } else {
        progressFillBar.classList.remove('goal-achieved');
        window._goalNotified = false;
    }
    
    // Atualizar intervalo
    const avgInterval = getAverageInterval();
    if (avgInterval !== null) {
        intervalDisplaySpan.innerText = formatInterval(avgInterval);
    } else {
        intervalDisplaySpan.innerText = dailyRecords.length < 2 ? "➕ Adicione mais" : "--";
    }
    
    renderTimeline();
}

// renderizar linha do tempo
function renderTimeline() {
    if (!timelineContainer) return;
    if (dailyRecords.length === 0) {
        timelineContainer.innerHTML = `<div class="empty-history">✨ Nenhum registro ainda. Adicione sua primeira água! 💧</div>`;
        return;
    }
    
    const sorted = [...dailyRecords].sort((a,b) => b.timestamp - a.timestamp);
    const timelineHtml = sorted.map(record => {
        const date = new Date(record.timestamp);
        const horas = date.getHours().toString().padStart(2,'0');
        const minutos = date.getMinutes().toString().padStart(2,'0');
        const segundos = date.getSeconds().toString().padStart(2,'0');
        const horaStr = `${horas}:${minutos}:${segundos}`;
        
        let amountShow = record.amountMl;
        let unitShow = 'ml';
        if (dailyGoalMl >= 1000 && dailyGoalMl % 1000 === 0 && record.amountMl >= 1000) {
            amountShow = (record.amountMl / 1000).toFixed(2);
            unitShow = 'L';
        }
        
        return `
            <div class="registro-item">
                <div class="registro-hora">🕒 ${horaStr}</div>
                <div class="registro-qtd">+ ${amountShow} ${unitShow}</div>
            </div>
        `;
    }).join('');
    timelineContainer.innerHTML = timelineHtml;
}

// adicionar novo registro
function addRecord(amountMl) {
    if (isNaN(amountMl) || amountMl <= 0) {
        showToast("❌ Por favor, insira uma quantidade válida (maior que zero).", 2000);
        return false;
    }
    if (amountMl > 5000) {
        if (!confirm("⚠️ Você está adicionando mais de 5 litros de uma vez. Deseja continuar?")) return false;
    }
    const newRecord = {
        timestamp: Date.now(),
        amountMl: amountMl
    };
    dailyRecords.push(newRecord);
    saveRecordsToLocal();
    updateProgressAndStats();
    showToast(`✅ +${amountMl}ml registrado! Continue hidratado! 💧`, 1500);
    return true;
}

// definir nova meta
function setMetaFromInput() {
    let rawValue = parseFloat(metaValueInput.value);
    if (isNaN(rawValue) || rawValue <= 0) {
        showToast("Digite uma meta válida maior que zero.", 2000);
        return;
    }
    const unit = metaUnitSelect.value;
    let goalMl = 0;
    if (unit === 'litros') {
        goalMl = rawValue * 1000;
    } else {
        goalMl = rawValue;
    }
    if (goalMl < 50) {
        showToast("Meta muito baixa! Defina pelo menos 50 ml.", 2000);
        return;
    }
    dailyGoalMl = goalMl;
    localStorage.setItem(STORAGE_META_ML, dailyGoalMl);
    updateGoalUI();
    updateProgressAndStats();
    showToast(`🎯 Nova meta: ${dailyGoalMl >= 1000 ? (dailyGoalMl/1000) + 'L' : dailyGoalMl + 'ml'}`, 2000);
}

// inicialização completa
function init() {
    checkAndResetIfNewDay();
    loadGoal();
    loadRecords();
    localStorage.setItem(STORAGE_LAST_DATE, getTodayKey());
    updateGoalUI();
    updateProgressAndStats();
    
    // eventos dos botões
    const addBtn = document.getElementById('addRecordBtn');
    const amountInput = document.getElementById('amountInput');
    const setMetaBtn = document.getElementById('setMetaBtn');
    
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            let val = parseFloat(amountInput.value);
            if (isNaN(val)) val = 0;
            addRecord(val);
            amountInput.value = 250;
        });
    }
    
    if (setMetaBtn) {
        setMetaBtn.addEventListener('click', setMetaFromInput);
    }
    
    // suporte para tecla Enter no campo de quantidade
    if (amountInput) {
        amountInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                let val = parseFloat(amountInput.value);
                if (isNaN(val)) val = 0;
                addRecord(val);
                amountInput.value = 250;
            }
        });
    }
}

// Iniciar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}