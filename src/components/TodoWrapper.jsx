import React, { useEffect, useState } from "react";
import EditForm from "./EditForm";
import TodoItem from "./TodoItem";
import TodoForm from "./TodoForm";
import { auth, db } from "./firebase";
import { signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { getDoc } from "firebase/firestore";
import defaultProfilePic from "../assets/profile.jpg";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


const TodoWrapper = () => {
  const [todos, setTodos] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const user = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodos = async () => {
      if (!user) return;
      const querySnapshot = await getDocs(
        collection(db, "users", user.uid, "todos")
      );
      const todosData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTodos(todosData);
    };

    const fetchUserProfile = async () => {
      if (!user) return;
    
      try {
        const userDoc = await getDoc(doc(db, "Users", user.uid));
    
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFname(userData.firstName || "");
          setLname(userData.lastName || "");
    
          // Use the imported default image if no profilePic is found
          setProfilePic(userData.profilePic || defaultProfilePic);
        } else {
          setProfilePic(defaultProfilePic); // Set default if no user data
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setProfilePic(defaultProfilePic); // Fallback in case of error
      }
    };        
    if (user) {
      fetchTodos();
      fetchUserProfile(); // Fetch profile pic
    }
  }, [user]);

  // Add a new todo to Firestore
  const addTodo = async (todo) => {
    if (!user) return;
    const newTodo = {
      title: todo.title,
      description: todo.description,
      completed: false,
      isEditing: false,
    };
    const docRef = await addDoc(
      collection(db, "users", user.uid, "todos"),
      newTodo
    );
    setTodos([...todos, { id: docRef.id, ...newTodo }]);
  };

  // Delete a todo from Firestore
  const deleteTodo = async (id) => {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "todos", id));
    setTodos(todos.filter((todo) => todo.id !== id));
  };


  const toggleComplete = async (id) => {
    if (!user) return;
    const todoRef = doc(db, "users", user.uid, "todos", id);
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    await updateDoc(todoRef, {
      completed: updatedTodos.find((todo) => todo.id === id).completed,
    });
  };

  const editTask = async (id, updatedFields) => {
    if (!user) return;
    const todoRef = doc(db, "users", user.uid, "todos", id);
    try {
      await updateDoc(todoRef, updatedFields);
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, ...updatedFields } : todo
        )
      );
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };
    
  const handleLogout = async () => {
    await signOut(auth);
  };
  return (
    <div className="todo-wrapper">
      <div className="header">
        <h1 className="title">
          <Link to="/todo" style={{ textDecoration: "none", color: "black" }}>
            {fname ? `${fname}'s Todo List` : "Todo List"}
          </Link>
        </h1>

        <div className="profile-container">
        <img
          src={profilePic}
          alt="Profile"
          className="profile-pic"
          onClick={() => setShowProfile(!showProfile)}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultProfilePic;
          }}
        />
          {showProfile && (
            <div className="profile-popup">
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
              <p>
                <strong>Full Name:</strong> {fname} {lname}
              </p>
              <p 
                className="clickable-text" 
                onClick={() => navigate('/profile')}
              >
                Profile Details
              </p>
              <button className="logout-btn" onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="todo-form-container">
        <TodoForm addTodo={addTodo} />
      </div>
      <div className="todo-grid">
        {todos.map((todo) =>
          todo.isEditing ? (
            <EditForm editTodo={editTask} task={todo} key={todo.id} hideCloseButton={true} />
          ) : (
            <TodoItem
              key={todo.id}
              task={todo}
              editTodo={editTask}
              deleteTodo={deleteTodo}
              toggleComplete={toggleComplete}
            />
          )
        )}
      </div>
    </div>
  );
};

export default TodoWrapper;
