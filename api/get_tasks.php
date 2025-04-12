<?php
include '../config/db.php';

$sql = "SELECT * FROM tasks ORDER BY created_at DESC";
$result = $conn->query($sql);

$tasks = [];

while ($row = $result->fetch_assoc()) {
    $tasks[] = $row;
}

echo json_encode($tasks);
?>
