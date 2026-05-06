import { FormEvent, useEffect, useMemo, useState } from "react";
import "./styles.css";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
};

type Filter = "all" | "active" | "completed";

const STORAGE_KEY = "coderabbit-demo.todos";

const filters: Filter[] = ["all", "active", "completed"];

const createTodo = (title: string): Todo => ({
  id: crypto.randomUUID(),
  title,
  completed: false,
  createdAt: Date.now(),
});

const loadTodos = (): Todo[] => {
  try {
    const storedTodos = localStorage.getItem(STORAGE_KEY);
    if (!storedTodos) {
      return [];
    }

    const parsedTodos = JSON.parse(storedTodos);
    if (!Array.isArray(parsedTodos)) {
      return [];
    }

    return parsedTodos.filter(
      (todo): todo is Todo =>
        typeof todo?.id === "string" &&
        typeof todo?.title === "string" &&
        typeof todo?.completed === "boolean" &&
        typeof todo?.createdAt === "number",
    );
  } catch {
    return [];
  }
};

function App() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos);
  const [newTitle, setNewTitle] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      if (filter === "active") {
        return !todo.completed;
      }

      if (filter === "completed") {
        return todo.completed;
      }

      return true;
    });
  }, [filter, todos]);

  const activeCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.length - activeCount;

  const handleAddTodo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = newTitle.trim();
    if (!title) {
      setError("Enter a todo before adding it.");
      return;
    }

    setTodos((currentTodos) => [createTodo(title), ...currentTodos]);
    setNewTitle("");
    setError("");
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
    setError("");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  const saveTodo = (id: string) => {
    const title = editingTitle.trim();
    if (!title) {
      setError("Todo text cannot be empty.");
      return;
    }

    setTodos((currentTodos) =>
      currentTodos.map((todo) => (todo.id === id ? { ...todo, title } : todo)),
    );
    cancelEditing();
    setError("");
  };

  const toggleTodo = (id: string) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
  };

  const clearCompletedTodos = () => {
    setTodos((currentTodos) => currentTodos.filter((todo) => !todo.completed));
  };

  return (
    <main className="app-shell">
      <section className="todo-panel" aria-labelledby="todo-title">
        <div className="panel-header">
          <p className="eyebrow">CodeRabbit Demo</p>
          <h1 id="todo-title">CRUD Todo List</h1>
        </div>

        <form className="todo-form" onSubmit={handleAddTodo}>
          <label htmlFor="new-todo">New todo</label>
          <div className="entry-row">
            <input
              id="new-todo"
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
              placeholder="Add a task"
            />
            <button type="submit">Add todo</button>
          </div>
        </form>

        {error ? (
          <p className="form-error" role="alert">
            {error}
          </p>
        ) : null}

        <div className="toolbar" aria-label="Todo filters">
          <div className="filter-group">
            {filters.map((filterOption) => (
              <button
                key={filterOption}
                type="button"
                className={filter === filterOption ? "is-selected" : ""}
                onClick={() => setFilter(filterOption)}
                aria-pressed={filter === filterOption}
              >
                {filterOption}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="clear-button"
            onClick={clearCompletedTodos}
            disabled={completedCount === 0}
          >
            Clear completed
          </button>
        </div>

        <ul className="todo-list" aria-label="Todo list">
          {filteredTodos.map((todo) => {
            const isEditing = editingId === todo.id;

            return (
              <li key={todo.id} className={todo.completed ? "is-completed" : ""}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  aria-label={`Mark ${todo.title} ${todo.completed ? "active" : "complete"}`}
                />

                {isEditing ? (
                  <div className="edit-row">
                    <input
                      value={editingTitle}
                      onChange={(event) => setEditingTitle(event.target.value)}
                      aria-label={`Editing ${todo.title}`}
                    />
                    <button type="button" onClick={() => saveTodo(todo.id)}>
                      Save todo
                    </button>
                    <button type="button" className="secondary" onClick={cancelEditing}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <span>{todo.title}</span>
                    <div className="item-actions">
                      <button
                        type="button"
                        onClick={() => startEditing(todo)}
                        aria-label={`Edit ${todo.title}`}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="danger"
                        onClick={() => deleteTodo(todo.id)}
                        aria-label={`Delete ${todo.title}`}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ul>

        {filteredTodos.length === 0 ? (
          <p className="empty-state">No todos match this view.</p>
        ) : null}

        <footer>
          <span>
            {activeCount} {activeCount === 1 ? "active" : "active"}
          </span>
          <span>{completedCount} completed</span>
        </footer>
      </section>
    </main>
  );
}

export default App;
