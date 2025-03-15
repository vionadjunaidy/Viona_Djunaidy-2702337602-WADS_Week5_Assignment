import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const TodoItem = ({ task, editTodo, deleteTodo, toggleComplete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="Todo">
      <div className="todo-item">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => toggleComplete(task.id)}
          className="checkbox"
        />
        <div className="todo-content">
          <h3 className={task.completed ? "completed" : ""}>{task.title}</h3>
          <p>
            {task.description.length > 30
              ? `${task.description.slice(0, 30)}...`
              : task.description}
          </p>

          <div className="icons">
            <FontAwesomeIcon
              icon={faPenToSquare}
              className="edit-icon"
              onClick={() => editTodo(task.id, { isEditing: true })}
            />
            <FontAwesomeIcon
              icon={faTrash}
              className="delete-icon"
              onClick={() => deleteTodo(task.id)}
            />
            <button className="view-btn" onClick={() => setIsModalOpen(true)}>
              View
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsModalOpen(false)}>
              &times;
            </span>
            <h2>{task.title}</h2>
            <p>{task.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoItem;
