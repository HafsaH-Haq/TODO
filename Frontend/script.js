const API_BASE = "http://127.0.0.1:8000";

// --- Add Todo ---
document.getElementById("todo-form").onsubmit = async (e) => {
    e.preventDefault();
    const task = document.getElementById("todo-task").value;
    const user_id = document.getElementById("todo-user-id").value;
    if (!user_id || !task) return;

    await fetch(`${API_BASE}/todo/add-item`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, task, done: false })
    });

    document.getElementById("todo-task").value = "";
    loadTodos(user_id);
};

// --- Get Todos ---
document.getElementById("fetch-todos-btn").onclick = function() {
    const user_id = document.getElementById("todo-user-id").value;
    if (user_id) loadTodos(user_id);
};

async function loadTodos(user_id) {
    const res = await fetch(`${API_BASE}/todo/get-items/${user_id}`);
    const todos = await res.json();

    const list = document.getElementById("todo-list");
    list.innerHTML = "";

    todos.forEach(todo => {
        const li = document.createElement("li");
        li.textContent = todo.task + (todo.done ? " ✅" : "");

        // --- Update Button ---
        const updateBtn = document.createElement("button");
        updateBtn.textContent = "Update";
        updateBtn.onclick = () => {
            const newTask = prompt("Enter new task:", todo.task);
            if (newTask !== null) {
                updateTodo(todo.id, user_id, newTask, todo.done);
            }
        };

        // --- Delete Button ---
        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.onclick = () => deleteTodo(todo.id, user_id);

        li.appendChild(updateBtn);
        li.appendChild(delBtn);
        list.appendChild(li);
    });
}

// --- Update Todo ---
async function updateTodo(item_id, user_id, newTask, doneStatus) {
    await fetch(`${API_BASE}/todo/update-item`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            item_id,
            user_id,
            task: newTask,
            done: doneStatus
        })
    });
    loadTodos(user_id);
}

// --- Delete Todo ---
async function deleteTodo(item_id, user_id) {
    await fetch(`${API_BASE}/todo/delete-item`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_id })
    });
    loadTodos(user_id);
}
