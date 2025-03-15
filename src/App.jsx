import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import TodoWrapper from "./components/TodoWrapper";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProfileDetails from "./components/ProfileDetails";
import { auth } from "./components/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./App.css";

function App() {
  const [user] = useAuthState(auth);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/todo" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/todo" /> : <Signup />} />
        <Route path="/todo" element={user ? <TodoWrapper /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/profile" element={<ProfileDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
