import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import { setDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signOut } from "firebase/auth";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!profilePic) {
      toast.error("Please upload a profile picture!", { position: "top-center" });
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      console.log(user);
      
      
      const reader = new FileReader();
      reader.onload = async () => {
        const base64String = reader.result;

        // Save user details in Firestore with Base64 profile picture
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: fname,
          lastName: lname,
          profilePic: base64String, // Store Base64 string
        });

        console.log("User Registered Successfully!");
        toast.success("User Registered Successfully!", {
          position: "top-center",
        });
        await signOut(auth);
        navigate("/login");
      };
      reader.readAsDataURL(profilePic);
    } catch (error) {
      console.log(error.message);
      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input type="text" placeholder="First name" value={fname} onChange={(e) => setFname(e.target.value)} required />
        <input type="text" placeholder="Last name" value={lname} onChange={(e) => setLname(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input type="file" accept="image/*" onChange={(e) => setProfilePic(e.target.files[0])} required />
        <button type="submit">Sign Up</button>
      </form>
      <p>Already have an account? <a href="/login">Login</a></p>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Signup;
