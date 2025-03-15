import { useState } from 'react';
import React from 'react'

const EditForm = ({ editTodo, task, hideCloseButton }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedTodo = { title, description, isEditing: false }; // Set isEditing to false

    console.log("Updating task:", updatedTodo); // Debugging log

    await editTodo(task.id, updatedTodo); // Ensure correct data is passed

    setIsModalOpen(false); // Close modal AFTER update
  };

  return (
    isModalOpen && (
      <div className="modal">
        <div className="modal-content">
          {/* Conditionally render the close button */}
          {!hideCloseButton && (
            <span className="close" onClick={() => setIsModalOpen(false)}>
              &times;
            </span>
          )}
          <h2>Edit Task</h2>
          <form onSubmit={handleSubmit}>
            <input
              className="todo-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task Title"
            />
            <textarea
              className="todo-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task Description"
            />
            <button className="todo-btn" type="submit">
              Done
            </button>
          </form>
        </div>
      </div>
    )
  );
};
export default EditForm