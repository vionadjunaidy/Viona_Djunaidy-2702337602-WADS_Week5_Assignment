import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import googleLogo from "../assets/google.png"; 

function SignUpWithGoogle() {
    async function googleLogin() {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            console.log("Google sign-in success:", user);

            // Check if user already exists in Firestore
            const userRef = doc(db, "Users", user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                // If user is new, save profile details in Firestore
                await setDoc(userRef, {
                    email: user.email,
                    firstName: user.displayName?.split(" ")[0] || "",
                    lastName: user.displayName?.split(" ")[1] || "",
                    profilePic: user.photoURL, // Save Google profile pic
                });
            }

        } catch (error) {
            console.error("Error signing in with Google:", error.message);
        }
    }

    return (
        <div>
            <p className="continue-p">--Or continue with--</p>
            <div onClick={googleLogin}>
                <img src={googleLogo} width="60%" alt="Google Sign In" style={{ cursor: "pointer" }} />
            </div>
        </div>
    );
}

export default SignUpWithGoogle;
