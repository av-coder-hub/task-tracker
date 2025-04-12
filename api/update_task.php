<?php
include '../config/db.php';

$data = json_decode(file_get_contents("php://input"));

$id = $data->id ?? null;
$title = $data->title ?? null;
$deadline = $data->deadline ?? null;
$priority = $data->priority ?? null;
$status = $data->status ?? null;

if (!$id) {
    echo json_encode(["status" => "error", "message" => "Missing task ID"]);
    exit;
}

$fields = [];
$params = [];

if ($title !== null) {
    $fields[] = "title = ?";
    $params[] = $title;
}
if ($deadline !== null) {
    $fields[] = "deadline = ?";
    $params[] = $deadline;
}
if ($priority !== null) {
    $fields[] = "priority = ?";
    $params[] = $priority;
}
if ($status !== null) {
    $fields[] = "status = ?";
    $params[] = $status;
}

if (empty($fields)) {
    echo json_encode(["status" => "error", "message" => "No fields to update"]);
    exit;
}

$sql = "UPDATE tasks SET " . implode(", ", $fields) . " WHERE id = ?";
$params[] = $id;

$stmt = $conn->prepare($sql);
$types = str_repeat("s", count($params) - 1) . "i"; // last param is int id
$stmt->bind_param($types, ...$params);

if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}
?>
