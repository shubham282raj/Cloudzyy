// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQSzH1AsaeOJIfVzGMW-VHPwslCTD1t9I",
  authDomain: "cloudzyy.firebaseapp.com",
  projectId: "cloudzyy",
  storageBucket: "cloudzyy.firebasestorage.app",
  messagingSenderId: "826188185567",
  appId: "1:826188185567:web:f2a1b69c03a9a28c958e6a",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
