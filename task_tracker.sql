-- Create the database if it does not exist
CREATE DATABASE IF NOT EXISTS task_tracker;

-- Use the task_tracker database
USE task_tracker;

-- Create the tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  deadline DATETIME NOT NULL,  -- Changed from DATE to DATETIME to include time
  priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
  status ENUM('Pending', 'Completed') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Example insert statement for testing purposes (optional)
INSERT INTO tasks (title, deadline, priority, status) 
VALUES 
  ('Interview Preparation', '2025-04-16 00:00:00', 'Medium', 'Pending'),
  ('Yoga', '2025-04-13 05:00:00', 'High', 'Pending'),
  ('Cooking', '2025-04-16 00:00:00', 'Medium', 'Completed'),
  ('Family Dinner', '2025-04-14 00:00:00', 'Low', 'Pending'),
  ('Code Practice', '2025-04-13 06:00:00', 'High', 'Pending'),
  ('Mini Project', '2025-04-12 17:00:00', 'High', 'Completed');
