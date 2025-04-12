<?php
// Include the database connection
include '../config/db.php';

// Get the raw DELETE request data
$data = json_decode(file_get_contents("php://input"), true);

// Check if the ID is provided in the request
if (isset($data['id'])) {
    // Prepare the SQL delete query
    $sql = "DELETE FROM tasks WHERE id = ?";
    $stmt = $conn->prepare($sql);
    
    // Bind the id parameter
    $stmt->bind_param("i", $data['id']);
    
    // Execute the query
    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Task deleted successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => $stmt->error]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "No ID provided"]);
}
?>
