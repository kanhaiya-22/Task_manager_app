function renderTasks() {
  const tasks = getTasks();
  taskList.innerHTML = '';

  let filteredTasks = tasks;
  if (currentFilter === 'active') filteredTasks = tasks.filter(t => !t.completed);
  if (currentFilter === 'completed') filteredTasks = tasks.filter(t => t.completed);

  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';

    const main = document.createElement('div');
    main.className = 'task-main';
    main.textContent = task.text;

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.className = 'delete';
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteTask(task.id);
    });

    main.appendChild(delBtn);

    const meta = document.createElement('div');
    meta.className = 'task-meta';
    meta.textContent = `🕒 Added: ${task.date}`;

    li.appendChild(main);
    li.appendChild(meta);

    li.addEventListener('click', () => {
      task.completed = !task.completed;
      saveTasks(tasks);
      renderTasks();
    });

    taskList.appendChild(li);
  });

  taskCount.textContent = `${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'}`;
}