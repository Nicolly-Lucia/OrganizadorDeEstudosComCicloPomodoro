<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require 'db.php';

$action = $_GET['action'] ?? $_POST['action'] ?? '';

// ===== CADASTRAR MATÉRIA =====
if ($action === 'cadastrar_materia' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $nome = trim($_POST['nome'] ?? '');
    if (!empty($nome)) {
        $stmt = $pdo->prepare("INSERT INTO materias (nome) VALUES (?)");
        $stmt->execute([$nome]);
    }
    header("Location: index.php");
    exit;
}

// ===== CADASTRAR TÓPICO =====
if ($action === 'cadastrar_topico' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $materia_id = $_POST['materia_id'] ?? null;
    $nome = trim($_POST['nome'] ?? '');
    if ($materia_id && !empty($nome)) {
        $stmt = $pdo->prepare("INSERT INTO topicos (materia_id, nome) VALUES (?, ?)");
        $stmt->execute([$materia_id, $nome]);
    }
    header("Location: index.php");
    exit;
}

// ===== EXCLUIR MATÉRIA =====
if ($action === 'excluir_materia') {
    $id = $_GET['id'] ?? null;
    if ($id) {
        $stmt = $pdo->prepare("DELETE FROM materias WHERE id = ?");
        $stmt->execute([$id]);
    }
    header("Location: index.php");
    exit;
}

// ===== EXCLUIR TÓPICO =====
if ($action === 'excluir_topico') {
    $id = $_GET['id'] ?? null;
    if ($id) {
        $stmt = $pdo->prepare("DELETE FROM topicos WHERE id = ?");
        $stmt->execute([$id]);
    }
    header("Location: index.php");
    exit;
}

// ===== SALVAR TEMPO DE ESTUDO (via AJAX) =====
if ($action === 'salvar_tempo' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json');
    $input = json_decode(file_get_contents('php://input'), true);
    $topico_id = $input['topico_id'] ?? null;
    $duracao = $input['duracao'] ?? 0;

    if ($topico_id) {
        $stmt = $pdo->prepare("UPDATE topicos SET tempo_dedicado = tempo_dedicado + ?, status = 'Estudando' WHERE id = ?");
        $stmt->execute([$duracao, $topico_id]);
        
        $stmt = $pdo->prepare("INSERT INTO sessoes_pomodoro (topico_id, duracao) VALUES (?, ?)");
        $stmt->execute([$topico_id, $duracao]);

        echo json_encode(['success' => true, 'message' => 'Tempo registrado!']);
        exit;
    }
    echo json_encode(['success' => false, 'message' => 'Tópico inválido']);
    exit;
}

// Se nenhuma ação corresponder
header("Location: index.php");
exit;