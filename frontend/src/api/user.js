import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { setCookie } from "./github";
import { auth, db } from "../firebase";

// // TODO: Replace with your Firebase config
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID,
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);

export const registerUser = async (formData) => {
  try {
    // Create auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.email,
      formData.password,
    );

    // Store additional user data in Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
      name: formData.name,
      email: formData.email,
      githubRepoOwner: formData.githubRepoOwner || "",
      githubRepo: formData.githubRepo || "",
      githubToken: formData.githubToken || "",
      createdAt: new Date().toISOString(),
    });

    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const loginUser = async (formData) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      formData.email,
      formData.password,
    );

    return { user: userCredential.user };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const validateAuthToken = async () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (user) {
        resolve({
          uid: user.uid,
          email: user.email,
          isAuthenticated: true,
        });
      } else {
        reject(new Error("Token Invalid"));
      }
    });
  });
};

export const getUser = async () => {
  console.log("Get User Called");
  try {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("User not authenticated");
    }

    // Get user profile data from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (!userDoc.exists()) {
      throw new Error("User profile not found");
    }

    const userData = userDoc.data();

    return {
      id: user.uid,
      email: user.email,
      name: userData.name,
      githubRepoOwner: userData.githubRepoOwner,
      githubRepo: userData.githubRepo,
      githubToken: userData.githubToken,
    };
  } catch (error) {
    throw new Error("Failed to get User");
  }
};

export const logOut = async () => {
  try {
    setCookie("user", "", 0);
    await signOut(auth);
  } catch (error) {
    throw new Error("Error while Logging Out");
  }
};
