// ====== Modo escuro ======
const toggleDark = document.getElementById('toggle-dark');
toggleDark.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    toggleDark.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});

// ====== Relógio ======
function atualizarRelogio() {
    const agora = new Date();
    const horas = agora.getHours().toString().padStart(2, '0');
    const minutos = agora.getMinutes().toString().padStart(2, '0');
    const relogio = document.getElementById('relogio-cozy');
    if (relogio) relogio.textContent = `🕰️ ${horas}:${minutos}`;
}
setInterval(atualizarRelogio, 1000);
atualizarRelogio();

// ====== Frases do dia ======
const frases = [
    " \"Enquanto estuda, tome uma xícara de cada vez.\"",
    " \"Pequenos progressos diários levam a grandes resultados.\"",
    " \"Aprender é como uma planta, exige paciência e cuidado.\"",
    " \"Foco no processo, não só no resultado.\"",
    " \"Mais um dia, bons estudos!\"",
    " \"Estudar é um ato de amor por si mesmo.\"",
    " \"Que tal uma pausa para o café antes de começar?\"",
    " \"Respire. Você está fazendo o seu melhor.\""
];

const fraseEl = document.getElementById('frase-do-dia');
if (fraseEl) {
    const fraseAleatoria = frases[Math.floor(Math.random() * frases.length)];
    fraseEl.textContent = fraseAleatoria;
}

// ====== Contador de ciclos pomodoros ======
let contadorPomodoro = parseInt(localStorage.getItem('pomodorosHoje') || '0');
const contadorEl = document.getElementById('contador-pomodoro');
if (contadorEl) contadorEl.textContent = contadorPomodoro;

function incrementarPomodoro() {
    contadorPomodoro++;
    localStorage.setItem('pomodorosHoje', contadorPomodoro);
    if (contadorEl) contadorEl.textContent = contadorPomodoro;
}

const btnResetContador = document.getElementById('btn-reset-contador');
if (btnResetContador) {
    btnResetContador.addEventListener('click', () => {
        if (confirm('Resetar o contador de pomodoros de hoje?')) {
            contadorPomodoro = 0;
            localStorage.setItem('pomodorosHoje', 0);
            if (contadorEl) contadorEl.textContent = 0;
        }
    });
}

// ====== Timer do pomodoro ======
let tempoRestante = 25 * 60;
let timerInterval = null;
let emFoco = true;
let topicoSelecionadoId = null;

const display = document.getElementById('timer-display');
const timerLabel = document.getElementById('timer-label');
const btnIniciar = document.getElementById('btn-iniciar');
const btnPausar = document.getElementById('btn-pausar');
const btnZerar = document.getElementById('btn-zerar');
const inputFoco = document.getElementById('input-foco');
const inputPausa = document.getElementById('input-pausa');

// Áudios de alerta
const somAlertaFoco = document.getElementById('som-alerta-foco');
const somAlertaPausa = document.getElementById('som-alerta-pausa');
const alertaSonoroCheckbox = document.getElementById('alerta-sonoro');

function atualizarDisplay() {
    const minutos = Math.floor(tempoRestante / 60);
    const segundos = tempoRestante % 60;
    const tempoFormatado = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    
    // Atualiza apenas o texto do tempo, sem mexer na nuvem
    const tempoTexto = document.getElementById('tempo-texto');
    if (tempoTexto) {
        tempoTexto.textContent = tempoFormatado;
    } else {
        // Fallback caso o elemento não exista (segurança)
        display.textContent = tempoFormatado;
    }
}

function atualizarLabelTimer() {
    if (!timerLabel) return;
    if (emFoco) {
        timerLabel.textContent = 'Tempo de Estudo';
    } else {
        timerLabel.textContent = 'Tempo de Pausa';
    }
}

function tocarAlerta(tipo) {
    if (alertaSonoroCheckbox && !alertaSonoroCheckbox.checked) return;

    const audio = tipo === 'foco-fim' ? somAlertaFoco : somAlertaPausa;
    if (audio) {
        audio.volume = 0.6;
        audio.currentTime = 0;
        audio.play().catch(err => {
            console.warn('Não foi possível tocar o alerta:', err);
        });
    }
}

function iniciarTimer() {
    if (timerInterval) return;
    btnIniciar.disabled = true;
    btnPausar.disabled = false;
    
    timerInterval = setInterval(() => {
        tempoRestante--;
        atualizarDisplay();
        if (tempoRestante <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            finalizarSessao();
        }
    }, 1000);
}

function pausarTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    btnIniciar.disabled = false;
    btnPausar.disabled = true;
}

function zerarTimer() {
    pausarTimer();
    const focoMin = parseInt(inputFoco.value) || 25;
    const pausaMin = parseInt(inputPausa.value) || 5;
    tempoRestante = emFoco ? focoMin * 60 : pausaMin * 60;
    atualizarDisplay();
    atualizarLabelTimer();
}

function finalizarSessao() {
    const focoMin = parseInt(inputFoco.value) || 25;
    const pausaMin = parseInt(inputPausa.value) || 5;

    if (emFoco) {
        // === Fim do estudo ===
        tocarAlerta('foco-fim');

        setTimeout(() => {
            alert("Tempo de estudo concluído! Agora vá tomar um café!");
        }, 400);

        incrementarPomodoro();
        if (topicoSelecionadoId) {
            salvarTempoEstudo(topicoSelecionadoId, focoMin);
        }

        // Muda para pausa
        emFoco = false;
        tempoRestante = pausaMin * 60;
    } else {
        // === Fim da pausa ===
        tocarAlerta('pausa-fim');

        setTimeout(() => {
            alert("Pausa concluída, vamos voltar aos estudos!");
        }, 400);

        // Volta automaticamente para o foco
        emFoco = true;
        tempoRestante = focoMin * 60;
    }

    atualizarDisplay();
    atualizarLabelTimer();
    btnIniciar.disabled = false;
    btnPausar.disabled = true;
    btnZerar.disabled = false;
}

async function salvarTempoEstudo(topicoId, minutos) {
    try {
        await fetch('api.php?action=salvar_tempo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topico_id: topicoId, duracao: minutos })
        });
    } catch (error) {
        console.error("Erro ao salvar tempo:", error);
    }
}

btnIniciar.addEventListener('click', iniciarTimer);
btnPausar.addEventListener('click', pausarTimer);
btnZerar.addEventListener('click', zerarTimer);
inputFoco.addEventListener('change', zerarTimer);
inputPausa.addEventListener('change', zerarTimer);
atualizarDisplay();
atualizarLabelTimer();

// ====== Som ambiente com fade-in ======
const somSelect = document.getElementById('som-select');
const audioAmbiente = document.getElementById('audio-ambiente');
const volumeSlider = document.getElementById('volume-slider');

if (audioAmbiente && volumeSlider) {
    audioAmbiente.volume = parseFloat(volumeSlider.value);
}

if (audioAmbiente) {
    audioAmbiente.loop = true;
}

let fadeInterval = null;

function limparFade() {
    if (fadeInterval) {
        clearInterval(fadeInterval);
        fadeInterval = null;
    }
}

function tocarSom(caminho) {
    if (!audioAmbiente) return;

    const volumeAlvo = volumeSlider ? parseFloat(volumeSlider.value) : 0.3;
    limparFade();

    if (!audioAmbiente.paused && audioAmbiente.src) {
        fadeInterval = setInterval(() => {
            if (audioAmbiente.volume > 0.05) {
                audioAmbiente.volume = Math.max(0, audioAmbiente.volume - 0.05);
            } else {
                clearInterval(fadeInterval);
                fadeInterval = null;
                audioAmbiente.pause();
                audioAmbiente.currentTime = 0;
                audioAmbiente.volume = 0;

                if (caminho) {
                    iniciarNovoSom(caminho, volumeAlvo);
                }
            }
        }, 50);
    } else {
        if (caminho) {
            iniciarNovoSom(caminho, volumeAlvo);
        }
    }
}

function iniciarNovoSom(caminho, volumeAlvo) {
    audioAmbiente.src = caminho;
    audioAmbiente.loop = true;
    audioAmbiente.volume = 0;
    audioAmbiente.load();

    const playPromise = audioAmbiente.play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            fadeInterval = setInterval(() => {
                if (audioAmbiente.volume < volumeAlvo - 0.05) {
                    audioAmbiente.volume = Math.min(volumeAlvo, audioAmbiente.volume + 0.05);
                } else {
                    audioAmbiente.volume = volumeAlvo;
                    clearInterval(fadeInterval);
                    fadeInterval = null;
                }
            }, 50);
        }).catch(err => {
            console.warn('Não foi possível tocar o áudio:', err);
            alert('Clique na página e tente novamente para ativar o som ambiente 🎧');
        });
    }
}

if (somSelect) {
    somSelect.addEventListener('change', (e) => {
        tocarSom(e.target.value);
    });
}

if (volumeSlider && audioAmbiente) {
    volumeSlider.addEventListener('input', (e) => {
        const novoVolume = parseFloat(e.target.value);
        if (!fadeInterval) {
            audioAmbiente.volume = novoVolume;
        }
    });
}

// ====== Modais ======
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const formAction = document.getElementById('form-action');
const formMateriaId = document.getElementById('form-materia-id');
const formNome = document.getElementById('form-nome');
const btnFecharModal = document.getElementById('btn-fechar-modal');

document.getElementById('btn-add-materia').addEventListener('click', () => {
    modalTitle.textContent = 'Nova Matéria';
    formAction.value = 'cadastrar_materia';
    formMateriaId.value = '';
    formNome.value = '';
    formNome.placeholder = 'Nome da matéria...';
    modal.classList.add('active');
});

document.querySelectorAll('.btn-add-topico').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const materiaId = e.target.getAttribute('data-id');
        modalTitle.textContent = 'Novo Tópico';
        formAction.value = 'cadastrar_topico';
        formMateriaId.value = materiaId;
        formNome.value = '';
        formNome.placeholder = 'Nome do tópico...';
        modal.classList.add('active');
    });
});

btnFecharModal.addEventListener('click', () => modal.classList.remove('active'));
modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });

document.querySelectorAll('.btn-excluir-materia').forEach(btn => {
    btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (confirm('Tem certeza que deseja excluir esta matéria e todos os seus tópicos?')) {
            const id = e.target.getAttribute('data-id');
            await fetch(`api.php?action=excluir_materia&id=${id}`);
            location.reload();
        }
    });
});

document.querySelectorAll('.btn-excluir-topico').forEach(btn => {
    btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (confirm('Marcar este tópico como concluído e removê-lo?')) {
            const id = e.target.getAttribute('data-id');
            await fetch(`api.php?action=excluir_topico&id=${id}`);
            location.reload();
        }
    });
});

document.querySelectorAll('.topico-item').forEach(item => {
    item.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') return;
        document.querySelectorAll('.topico-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
        topicoSelecionadoId = item.getAttribute('data-id');
        document.querySelector('.timer-label').textContent = `Focando: ${item.querySelector('.topico-nome').textContent}`;
    });
});