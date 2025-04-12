<?php
$host = 'localhost';
$db = 'task_tracker';
$user = 'root';
$pass = ''; // default for XAMPP
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
?>