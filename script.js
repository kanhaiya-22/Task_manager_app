// Get DOM elements
const welcomePage = document.getElementById('welcome-page');
const dashboardPage = document.getElementById('dashboard-page');
const nameForm = document.getElementById('name-form');
const nameInput = document.getElementById('name-input');
const greetingElement = document.getElementById('greeting');
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const dateElement = document.getElementById('date');
const timeElement = document.getElementById('time');
const messageBox = document.getElementById('message-box');
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');

// Array of motivational quotes
const quotes = [
    { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "It's not whether you get knocked down, it's whether you get up.", author: "Vince Lombardi" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
    { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" }
];

// --- Core Application Logic ---

// Function to show a custom message box instead of alert
function showMessage(message, duration = 3000) {
    messageBox.textContent = message;
    messageBox.classList.add('show');
    setTimeout(() => {
        messageBox.classList.remove('show');
    }, duration);
}

// Function to update the date and time every second
function updateDateTime() {
    const now = new Date();
    const optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };

    const dateString = now.toLocaleDateString('en-US', optionsDate);
    const timeString = now.toLocaleTimeString('en-US', optionsTime);

    dateElement.textContent = dateString;
    timeElement.textContent = timeString;
}

// Function to display a random quote
function displayRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteText.textContent = `"${randomQuote.text}"`;
    quoteAuthor.textContent = `- ${randomQuote.author}`;
}

// Function to save tasks to local storage
function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to get tasks from local storage
function getTasks() {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
}

// Function to render a single task item
function renderTask(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.dataset.id = task.id;

    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = task.text;

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    // Text-based completion button
    const completeBtn = document.createElement('button');
    completeBtn.className = 'complete-btn';
    completeBtn.textContent = task.completed ? 'Mark as Incomplete' : 'Mark as Complete';
    completeBtn.addEventListener('click', () => {
        toggleTaskComplete(task.id);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    actions.appendChild(completeBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(taskText);
    li.appendChild(actions);

    taskList.appendChild(li);
}


// Function to render all tasks from local storage
function renderAllTasks() {
    taskList.innerHTML = ''; // Clear the current list
    const tasks = getTasks();
    tasks.forEach(task => renderTask(task));
}

// Handle form submission to add a new task
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskText = taskInput.value.trim();

    if (taskText) {
        const tasks = getTasks();
        const newTask = {
            id: Date.now(), // Use a timestamp for a unique ID
            text: taskText,
            completed: false,
        };
        tasks.push(newTask);
        saveTasks(tasks);
        renderTask(newTask); // Render just the new task
        taskInput.value = ''; // Clear the input field
        showMessage('Task added successfully!');
    } else {
        showMessage('Please enter a task!', 2000);
    }
});

// Function to toggle a task's completion status
function toggleTaskComplete(id) {
    const tasks = getTasks();
    const updatedTasks = tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks(updatedTasks);
    renderAllTasks(); // Re-render the entire list to apply the new state
    showMessage('Task status updated!');
}

// Function to delete a task
function deleteTask(id) {
    const tasks = getTasks();
    const filteredTasks = tasks.filter(task => task.id !== id);
    saveTasks(filteredTasks);
    renderAllTasks(); // Re-render the entire list without the deleted task
    showMessage('Task deleted successfully!');
}

// --- Page and User Management Logic ---

// Function to show a specific page and hide others
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

// Function to load the dashboard for a given user
function loadDashboard(name) {
    greetingElement.textContent = `Hello, ${name}!`;
    updateDateTime();
    setInterval(updateDateTime, 1000); // Start the clock
    renderAllTasks(); // Load tasks from local storage
    displayRandomQuote(); // Show a random quote
    showPage('dashboard-page');
}

// Handle name form submission
nameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    if (name) {
        localStorage.setItem('userName', name);
        loadDashboard(name);
    } else {
        showMessage('Please enter your name.', 2000);
    }
});

// Initial check when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const userName = localStorage.getItem('userName');
    if (userName) {
        loadDashboard(userName);
    } else {
        showPage('welcome-page');
    }
});
let currentFilter = 'all'; // default filter

// Add event listeners to all filter buttons
document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', () => {
        // Update active class
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Set current filter and re-render
        currentFilter = button.getAttribute('data-filter');
        renderAllTasks();
    });
});

// Modified renderAllTasks function to include filtering
function renderAllTasks() {
    taskList.innerHTML = ''; // Clear the current list
    const tasks = getTasks();

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'completed') return task.completed;
        if (currentFilter === 'active') return !task.completed;
        return true; // 'all'
    });

    filteredTasks.forEach(task => renderTask(task));
}
