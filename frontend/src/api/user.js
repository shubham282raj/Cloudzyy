import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

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
    await signOut(auth);
  } catch (error) {
    throw new Error("Error while Logging Out");
  }
};
