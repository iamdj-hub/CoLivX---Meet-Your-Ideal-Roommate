 // Import Firebase core
import { initializeApp } from "firebase/app";

// Import Firebase Auth
import { getAuth } from "firebase/auth";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA8AAKySZC6a-FWKVXn7jNIb9GQHSuzGBk",
  authDomain: "colivx-auth.firebaseapp.com",
  projectId: "colivx-auth",
  storageBucket: "colivx-auth.firebasestorage.app",
  messagingSenderId: "990976669754",
  appId: "1:990976669754:web:ad06abd6c3e48ae3d85d03"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);