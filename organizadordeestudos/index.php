<?php 
require 'db.php'; 

$stmt = $pdo->query("SELECT * FROM materias ORDER BY id DESC");
$materias = $stmt->fetchAll();

foreach ($materias as &$mat) {
    $stmtT = $pdo->prepare("SELECT * FROM topicos WHERE materia_id = ? ORDER BY id ASC");
    $stmtT->execute([$mat['id']]);
    $mat['topicos'] = $stmtT->fetchAll();
}
unset($mat);
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>I Miss My Studies</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Quicksand:wght@400;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <!-- Topo direito com o relogio e o modo escuro -->
    <div class="top-controls">
        <span id="relogio-cozy" class="relogio">--:--</span>
        <button id="toggle-dark" title="Alternar Modo Escuro">🌙</button>
    </div>

    <div class="main-container">
        
        <!-- Lado esquerdo -->
        <div class="left-panel">
            <h1 class="main-title">I Miss<br>My Studies</h1>
            <p class="subtitle">Sente-se e fique a vontade.</p>
            <p class="quote-cozy" id="frase-do-dia"> "Um passo de cada vez, uma xícara de cada vez."</p>

            <div class="todo-box">
                <div class="todo-header">
                    <span>Matérias e Tópicos</span>
                    <button id="btn-add-materia" class="btn-icon" title="Adicionar Matéria">+</button>
                </div>
                
                <div class="todo-list" id="lista-materias">
                    <?php if(count($materias) > 0): ?>
                        <?php foreach($materias as $m): ?>
                            <div class="materia-item" data-id="<?= $m['id'] ?>">
                                <div class="materia-header">
                                    <strong><?= htmlspecialchars($m['nome']) ?></strong>
                                    <div class="materia-actions">
                                        <button class="btn-add-topico" data-id="<?= $m['id'] ?>" title="Adicionar Tópico">+</button>
                                        <button class="btn-excluir-materia" data-id="<?= $m['id'] ?>" title="Excluir Matéria">🗑️</button>
                                    </div>
                                </div>
                                <ul class="topicos-lista">
                                    <?php foreach($m['topicos'] as $t): ?>
                                        <li class="topico-item" data-id="<?= $t['id'] ?>">
                                            <span class="topico-nome"><?= htmlspecialchars($t['nome']) ?></span>
                                            <span class="topico-status status-<?= strtolower(str_replace(' ', '-', $t['status'])) ?>">
                                                <?= $t['status'] ?>
                                            </span>
                                            <button class="btn-excluir-topico" data-id="<?= $t['id'] ?>" title="Concluir/Excluir">✓</button>
                                        </li>
                                    <?php endforeach; ?>
                                </ul>
                            </div>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <p class="empty-msg">Nenhuma matéria. Clique no + para começar.</p>
                    <?php endif; ?>
                </div>
            </div>
        </div>

        <!-- Centro com a imagem -->
        <div class="center-panel">
            <img src="imissmystudiesfundocolorido.png" alt="Mesa de estudos" class="coffee-illustration">
        </div>

        <!-- Lado direito com o timer, os sons e o contador -->
        <div class="right-panel">
            <div class="timer-section">
                <h2 class="timer-label" id="timer-label">Tempo de Estudo</h2>
               <div class="timer-display" id="timer-display">
    <span class="vapor-extra">☁️</span>
    <span id="tempo-texto">25:00</span>
</div>
                
                <div class="timer-controls">
                    <button id="btn-iniciar" class="btn-timer">▶ Iniciar</button>
                    <button id="btn-pausar" class="btn-timer" disabled>⏸ Pausar</button>
                    <button id="btn-zerar" class="btn-timer">↺ Zerar</button>
                </div>

                <div class="timer-settings">
                    <label>Foco (min): <input type="number" id="input-foco" value="25" min="1" max="60"></label>
                    <label>Pausa (min): <input type="number" id="input-pausa" value="5" min="1" max="30"></label>
                </div>

                <!-- Contador de Pomodoros -->
                <div class="progresso-box">
                    <p>Estudos de hoje: <strong id="contador-pomodoro">0</strong></p>
                    <button id="btn-reset-contador" class="btn-reset" title="Resetar contador">↺ Resetar</button>
                </div>

                <!-- Som Ambiente -->
                <div class="som-ambiente">
                    <label>Som ambiente:</label>
                    <select id="som-select">
                        <option value="">🔇 Silêncio</option>
                        <option value="sons/cafe.mp3">☕ Café</option>
                        <option value="sons/chuva.mp3">🌧️ Chuva</option>
                        <option value="sons/lofi.mp3">🎵 Lo-fi</option>
                    </select>
                    <label class="volume-label">🔊 Volume: <input type="range" id="volume-slider" min="0" max="1" step="0.1" value="0.3"></label>
                    <label class="alerta-toggle">
                        <input type="checkbox" id="alerta-sonoro" checked>
                        🔔 Alerta sonoro ao fim do timer
                    </label>
                </div>
            </div>
        </div>

    </div>

    <!-- Rodapé -->
    <footer class="footer-cozy">
        <p>
            Esse site foi feito para um projeto do professor <strong>Marcello Collado</strong> 
            para a matéria <strong>Programação Web 2</strong>. O site foi totalmente inspirado 
            no site <a href="https://imissmycafe.com" target="_blank">imissmycafe.com</a>.
        </p>
        <p class="footer-credit">
            Feito com um bom café e noites sem sono — <em>I Miss My Studies</em>
        </p>
    </footer>

    <!-- Áudio invisivel (som ambiente) -->
    <audio id="audio-ambiente" loop preload="auto"></audio>

    <!-- Áudios de alerta (fim de foco e fim de pausa) -->
    <audio id="som-alerta-foco" src="sons/alerta-foco.mp3" preload="auto"></audio>
    <audio id="som-alerta-pausa" src="sons/alerta-pausa.mp3" preload="auto"></audio>

    <!-- Modal -->
    <div id="modal" class="modal-overlay">
        <div class="modal-content">
            <h3 id="modal-title">Nova Matéria</h3>
            <form id="form-modal" action="api.php" method="POST">
                <input type="hidden" name="action" id="form-action" value="cadastrar_materia">
                <input type="hidden" name="materia_id" id="form-materia-id" value="">
                <input type="text" name="nome" id="form-nome" placeholder="Digite o nome..." required>
                <div class="modal-buttons">
                    <button type="submit" class="btn-salvar">Salvar</button>
                    <button type="button" id="btn-fechar-modal" class="btn-cancelar">Cancelar</button>
                </div>
            </form>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>