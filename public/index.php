<?php include("../config/db.php"); ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Task Tracker</title>
  <link rel="stylesheet" href="assets/style.css">
</head>
<body>
  <h1>Task Tracker</h1>
  
  <form id="taskForm">
    <input type="text" name="title" placeholder="Task Title" required>
    <input type="date" name="deadline" required>
    <select name="priority">
      <option>Low</option>
      <option>Medium</option>
      <option>High</option>
    </select>
    <button type="submit">Add Task</button>
  </form>

  <table id="taskTable">
    <thead>
      <tr><th>Title</th><th>Deadline</th><th>Priority</th><th>Status</th><th>Action</th></tr>
    </thead>
    <tbody></tbody>
  </table>

  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="assets/script.js"></script>
</body>
</html>
