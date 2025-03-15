import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { FaSignOutAlt } from "react-icons/fa";
import defaultProfilePic from "../assets/profile.jpg";

const ProfileDetails = () => {
  const [profilePic, setProfilePic] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [editedFname, setEditedFname] = useState(""); // Local state for editing
  const [editedLname, setEditedLname] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [newProfilePic, setNewProfilePic] = useState(null); // Store the new image locally


  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      try {
        const userDoc = await getDoc(doc(db, "Users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFname(userData.firstName || "");
          setLname(userData.lastName || "");
          setEditedFname(userData.firstName || ""); // Initialize edit state
          setEditedLname(userData.lastName || "");
          setProfilePic(userData.profilePic || defaultProfilePic);
        } else {
          setProfilePic(defaultProfilePic);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setProfilePic(defaultProfilePic);
      }
    };

    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setNewProfilePic(reader.result); // Store locally instead of updating Firebase
    };
    reader.onerror = (error) => {
      console.error("Error converting file to base64:", error);
    };
  };
  

  const handleSave = async () => {
    if (!user) return;
    try {
      const updatedData = {
        firstName: editedFname,
        lastName: editedLname,
      };
  
      // Only update profile pic if a new one was uploaded
      if (newProfilePic) {
        updatedData.profilePic = newProfilePic;
        setProfilePic(newProfilePic); // Update UI
      }
  
      await updateDoc(doc(db, "Users", user.uid), updatedData);
  
      setFname(editedFname); // Update UI state
      setLname(editedLname);
      setNewProfilePic(null); // Reset local image state after saving
  
      console.log("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile details:", error);
    }
  };
  

  const handleLogout = () => {
    auth.signOut()
      .then(() => navigate("/login"))
      .catch((error) => console.error("Error logging out:", error));
  };

  return (
    <div>
      <div className="header">
        <h1 className="title">
          <Link to="/todo" style={{ textDecoration: "none", color: "black" }}>
            {fname ? `${fname}'s Profile` : "Profile"}
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
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Full Name:</strong> {fname} {lname}</p>
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

      <div className="pd-profile-container">
        <h2>Profile Details</h2>
        <img
          src={newProfilePic || profilePic} // Show new pic if uploaded, else show old one
          alt="Profile"
          className="pd-profile-pic"
          style={{
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultProfilePic;
          }}
        />
        <input type="file" accept="image/*" onChange={handleFileChange} />

        <p><strong>Email:</strong> {user?.email}</p>

        <label>First Name:</label>
        <input
          type="text"
          value={editedFname}
          onChange={(e) => setEditedFname(e.target.value)}
          className="profile-input"
        />

        <label>Last Name:</label>
        <input
          type="text"
          value={editedLname}
          onChange={(e) => setEditedLname(e.target.value)}
          className="profile-input"
        />
        <div className="save-btn-container">
          <button className="save-btn" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
