// To-Do List Application with Local Storage

class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.editingId = null;
        this.init();
    }

    // Initialize the app
    init() {
        this.loadTodos();
        this.attachEventListeners();
        this.render();
    }

    // Attach event listeners
    attachEventListeners() {
        const addBtn = document.getElementById('addBtn');
        const todoInput = document.getElementById('todoInput');
        const clearCompletedBtn = document.getElementById('clearCompleted');
        const deleteAllBtn = document.getElementById('deleteAll');
        const filterBtns = document.querySelectorAll('.filter-btn');

        // Add task on button click
        addBtn.addEventListener('click', () => this.addTodo());

        // Add task on Enter key
        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });

        // Filter buttons
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter(e.target.dataset.filter));
        });

        // Clear completed
        clearCompletedBtn.addEventListener('click', () => this.clearCompleted());

        // Delete all
        deleteAllBtn.addEventListener('click', () => this.deleteAll());
    }

    // Add a new todo
    addTodo() {
        const input = document.getElementById('todoInput');
        const text = input.value.trim();

        if (text === '') {
            alert('Please enter a task!');
            return;
        }

        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toLocaleString()
        };

        this.todos.push(todo);
        this.saveTodos();
        input.value = '';
        input.focus();
        this.render();
    }

    // Delete a todo
    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveTodos();
        this.render();
    }

    // Toggle todo completion
    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.render();
        }
    }

    // Edit a todo
    editTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            this.editingId = id;
            this.render();
            // Focus on the input after rendering
            setTimeout(() => {
                const editInput = document.querySelector('.edit-input');
                if (editInput) editInput.focus();
            }, 0);
        }
    }

    // Save edited todo
    saveEdit(id, newText) {
        const text = newText.trim();
        if (text === '') {
            alert('Task cannot be empty!');
            return;
        }

        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.text = text;
            this.editingId = null;
            this.saveTodos();
            this.render();
        }
    }

    // Cancel editing
    cancelEdit() {
        this.editingId = null;
        this.render();
    }

    // Clear completed todos
    clearCompleted() {
        if (this.todos.some(t => t.completed)) {
            if (confirm('Delete all completed tasks?')) {
                this.todos = this.todos.filter(t => !t.completed);
                this.saveTodos();
                this.render();
            }
        } else {
            alert('No completed tasks to clear!');
        }
    }

    // Delete all todos
    deleteAll() {
        if (this.todos.length === 0) {
            alert('No tasks to delete!');
            return;
        }

        if (confirm('Delete all tasks? This cannot be undone.')) {
            this.todos = [];
            this.saveTodos();
            this.render();
        }
    }

    // Set filter
    setFilter(filter) {
        this.currentFilter = filter;
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        this.render();
    }

    // Get filtered todos
    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(t => !t.completed);
            case 'completed':
                return this.todos.filter(t => t.completed);
            case 'all':
            default:
                return this.todos;
        }
    }

    // Update stats
    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        const active = total - completed;

        document.getElementById('totalCount').textContent = total;
        document.getElementById('completedCount').textContent = completed;
        document.getElementById('activeCount').textContent = active;
    }

    // Render the todo list
    render() {
        const todoList = document.getElementById('todoList');
        const emptyState = document.getElementById('emptyState');
        const filteredTodos = this.getFilteredTodos();

        todoList.innerHTML = '';

        if (filteredTodos.length === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
            filteredTodos.forEach(todo => {
                const li = document.createElement('li');
                li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

                if (this.editingId === todo.id) {
                    // Edit mode
                    li.innerHTML = `
                        <div class="edit-mode">
                            <input 
                                type="text" 
                                class="edit-input" 
                                value="${this.escapeHtml(todo.text)}"
                                id="edit-input-${todo.id}">
                            <button class="save-btn" onclick="todoApp.saveEdit(${todo.id}, document.getElementById('edit-input-${todo.id}').value)">Save</button>
                            <button class="cancel-btn" onclick="todoApp.cancelEdit()">Cancel</button>
                        </div>
                    `;
                } else {
                    // Normal mode
                    li.innerHTML = `
                        <input 
                            type="checkbox" 
                            class="checkbox" 
                            ${todo.completed ? 'checked' : ''}
                            onchange="todoApp.toggleTodo(${todo.id})">
                        <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                        <div class="todo-actions">
                            <button class="edit-btn" onclick="todoApp.editTodo(${todo.id})">✏️ Edit</button>
                            <button class="delete-btn" onclick="todoApp.deleteTodo(${todo.id})">🗑️ Delete</button>
                        </div>
                    `;
                }

                todoList.appendChild(li);
            });
        }

        this.updateStats();
    }

    // Save todos to local storage
    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    // Load todos from local storage
    loadTodos() {
        const saved = localStorage.getItem('todos');
        this.todos = saved ? JSON.parse(saved) : [];
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

// Initialize the app when DOM is ready
let todoApp;
document.addEventListener('DOMContentLoaded', () => {
    todoApp = new TodoApp();
});
