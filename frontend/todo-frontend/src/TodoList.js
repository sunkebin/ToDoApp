import React, { useState, useEffect } from "react";
import axios from "axios";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/todos");
        setTodos(response.data);
      } catch (error) {
        console.error("Error fetching todos", error);
      }
    };

    fetchTodos();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (inputValue.trim()) {
      try {
        const response = await axios.post("http://localhost:5001/api/todos", {
          text: inputValue,
          completed: false,
        });
        setTodos([...todos, { text: inputValue, completed: false }]);
        setInputValue("");
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    }
  };

  const handleDelete = async (index) => {
    const todoToDelete = todos[index];
    try {
      await axios.delete(`http://localhost:5001/api/todos/${todoToDelete._id}`);
      const newTodos = todos.filter((_, i) => i !== index);
      setTodos(newTodos);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleToggleComplete = async (index) => {
    const todoToUpdate = todos[index];
    try {
      const response = await axios.put(
        `http://localhost:5001/api/todos/${todoToUpdate._id}`,
        { ...todoToUpdate, completed: !todoToUpdate.completed }
      );
      const newTodos = todos.map((todo, i) =>
        i === index ? response.data : todo
      );
      setTodos(newTodos);
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditingValue(todos[index].text);
  };

  const handleEditChange = (event) => {
    setEditingValue(event.target.value);
  };

  const handleSaveEdit = async (index) => {
    const todoToUpdate = todos[index];
    try {
      const response = await axios.put(
        `http://localhost:5001/api/todos/${todoToUpdate._id}`,
        { text: editingValue }
      );
      const newTodos = todos.map((todo, i) =>
        i === index ? response.data : todo
      );
      setTodos(newTodos);
      setEditingIndex(null);
      setEditingValue("");
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  return (
    <div>
      <h1>Todo List</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new todo"
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {todos.map((todo, index) => (
          <li
            key={todo._id}
            style={{ textDecoration: todo.completed ? "line-through" : "none" }}
          >
            {editingIndex === index ? (
              <>
                <input
                  type="text"
                  value={editingValue}
                  onChange={handleEditChange}
                />
                <button onClick={() => handleSaveEdit(index)}>Save</button>
                <button onClick={() => setEditingIndex(null)}>Cancel</button>
              </>
            ) : (
              <>
                {todo.text}
                <button
                  onClick={() => {
                    console.log("Complete button clicked for index:", index);
                    console.log(todo.completed);
                    handleToggleComplete(index);
                  }}
                >
                  {todo.completed ? "Undo" : "Complete"}
                </button>
                <button onClick={() => handleEditClick(index)}>Edit</button>
                <button onClick={() => handleDelete(index)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
