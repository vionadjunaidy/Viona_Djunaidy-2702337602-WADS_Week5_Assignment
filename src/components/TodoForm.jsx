import React, { useState } from "react";

const TodoForm = ({ addTodo }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return; // Prevent empty tasks

    addTodo({ title: taskTitle, description: taskDescription });
    setTaskTitle("");
    setTaskDescription("");
    setIsModalOpen(false); // Close modal after submission
  };

  return (
    <div>
      {/* Button to Open Modal */}
      <button className="todo-btn" onClick={() => setIsModalOpen(true)}>
        Add Task
      </button>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsModalOpen(false)}>
              &times;
            </span>
            <h2>Add Task</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                className="todo-input"
                placeholder="Task Title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
              />
              <textarea
                className="todo-textarea"
                placeholder="Task Description"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
              />
              <button className="todo-btn" type="submit">
                Done
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoForm;
