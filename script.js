document.addEventListener("DOMContentLoaded", function () {
  const taskTable = document.getElementById("taskTable").querySelector("tbody");
  const addTaskForm = document.getElementById("addTaskForm");

  // Format DATETIME to "YYYY-MM-DD HH:MM"
  function formatDateTime(datetime) {
    const date = new Date(datetime);
    return date.toLocaleString([], {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: false
    }).replace(',', '');
  }

  // Group by DATE only (no time part)
  function getDateGroup(datetime) {
    return datetime.split(" ")[0];
  }

  function sanitizeClassName(str) {
    return str.replace(/\s|:|\./g, "_");
  }

  // Fetch all tasks
  function fetchTasks() {
    fetch("http://localhost/task-tracker/api/get_tasks.php")
      .then((res) => res.json())
      .then((data) => {
        taskTable.innerHTML = "";
        const groupedTasks = {};

        data.forEach(task => {
          const dateGroup = getDateGroup(task.deadline);
          if (!groupedTasks[dateGroup]) {
            groupedTasks[dateGroup] = [];
          }
          groupedTasks[dateGroup].push(task);
        });

        Object.keys(groupedTasks).forEach(date => {
          const tasks = groupedTasks[date];
          const dateClass = sanitizeClassName(date);

          // Date heading
          const dateRow = document.createElement("tr");
          dateRow.innerHTML = `<td colspan="5" style="background:#f0f0f0;">
            <button onclick="toggleTaskVisibility('${dateClass}')">📅 ${date}</button>
          </td>`;
          taskTable.appendChild(dateRow);

          const pending = tasks.filter(t => t.status !== "Completed");
          const completed = tasks.filter(t => t.status === "Completed");

          pending.forEach(task => {
            const row = createTaskRow(task, dateClass);
            taskTable.appendChild(row);
          });

          if (completed.length > 0) {
            const sepRow = document.createElement("tr");
            sepRow.classList.add(`task-${dateClass}`);
            sepRow.innerHTML = `<td colspan="5" style="background:#e7ffe7;font-weight:bold;">✅ Completed Tasks</td>`;
            taskTable.appendChild(sepRow);

            completed.forEach(task => {
              const row = createTaskRow(task, dateClass, true);
              taskTable.appendChild(row);
            });
          }
        });
      })
      .catch(err => console.error("Error fetching tasks:", err));
  }

  // Create a task row
  function createTaskRow(task, dateClass, isCompleted = false) {
    const row = document.createElement("tr");
    row.classList.add(`task-${dateClass}`);
    if (isCompleted) row.style.opacity = "0.6";

    const deadlineDate = task.deadline.split("T")[0];
    const deadlineTime = task.deadline.split("T")[1]?.slice(0, 5);

    row.innerHTML = `
      <td><input type="text" value="${task.title}" id="title-${task.id}" disabled></td>
      <td><input type="datetime-local" value="${task.deadline.replace(' ', 'T')}" id="deadline-${task.id}" disabled></td>
      <td>
        <select id="priority-${task.id}" disabled>
          <option value="Low" ${task.priority === "Low" ? "selected" : ""}>Low</option>
          <option value="Medium" ${task.priority === "Medium" ? "selected" : ""}>Medium</option>
          <option value="High" ${task.priority === "High" ? "selected" : ""}>High</option>
        </select>
      </td>
      <td>
        <select id="status-${task.id}" disabled>
          <option value="Pending" ${task.status === "Pending" ? "selected" : ""}>Pending</option>
          <option value="Completed" ${task.status === "Completed" ? "selected" : ""}>Completed</option>
        </select>
      </td>
      <td>
        <button onclick="toggleEditMode(${task.id})">✏️</button>
        <button onclick="updateTask(${task.id})" class="update-btn" style="display:none;">✅</button>
        <button onclick="deleteTask(${task.id})"><i class="fas fa-trash"></i></button>
      </td>
    `;
    return row;
  }

  // Toggle edit
  window.toggleEditMode = function (id) {
    ["title", "deadline", "priority", "status"].forEach(field => {
      const el = document.getElementById(`${field}-${id}`);
      el.disabled = false;
    });

    const row = document.getElementById(`title-${id}`).closest("tr");
    row.querySelector(".update-btn").style.display = "inline-block";
  };

  // Update task
  window.updateTask = function (id) {
    const title = document.getElementById(`title-${id}`).value;
    const deadline = document.getElementById(`deadline-${id}`).value;
    const priority = document.getElementById(`priority-${id}`).value;
    const status = document.getElementById(`status-${id}`).value;

    fetch("http://localhost/task-tracker/api/update_task.php", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, title, deadline, priority, status })
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          alert("✅ Task updated!");
          fetchTasks();
        } else {
          alert("❌ Update failed: " + data.message);
        }
      });
  };

  // Delete task
  window.deleteTask = function (id) {
    if (!confirm("Are you sure you want to delete this task?")) return;

    fetch("http://localhost/task-tracker/api/delete_task.php", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          fetchTasks();
        } else {
          alert("❌ Delete failed: " + data.message);
        }
      });
  };

  // Toggle visibility by date group
  window.toggleTaskVisibility = function (dateClass) {
    const rows = document.querySelectorAll(`.task-${dateClass}`);
    rows.forEach(row => {
      row.style.display = row.style.display === "none" ? "table-row" : "none";
    });
  };

  // Add new task
  addTaskForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const priority = document.getElementById("priority").value;
    const status = document.getElementById("status").value;

    const deadline = `${date} ${time}`;

    fetch("http://localhost/task-tracker/api/add_task.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, deadline, priority, status })
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          alert("✅ Task added!");
          addTaskForm.reset();
          fetchTasks();
        } else {
          alert("❌ Add failed: " + data.message);
        }
      });
  });

  // Initial fetch
  fetchTasks();
});
