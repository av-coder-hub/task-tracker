<?php
// Include the database connection
include '../config/db.php';

// Get the raw POST request data
$data = json_decode(file_get_contents("php://input"), true);

// Check if all required fields are provided
if (isset($data['title']) && isset($data['deadline']) && isset($data['priority']) && isset($data['status'])) {
    $title = $data['title'];
    $deadline = $data['deadline'];
    $priority = $data['priority'];
    $status = $data['status'];

    // Prepare the SQL insert query
    $sql = "INSERT INTO tasks (title, deadline, priority, status) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);

    // Bind the parameters and execute the query
    $stmt->bind_param("ssss", $title, $deadline, $priority, $status);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "id" => $stmt->insert_id]);
    } else {
        echo json_encode(["status" => "error", "message" => $stmt->error]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Missing required fields"]);
}
?>
