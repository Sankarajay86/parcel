import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref } from "firebase/database";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2tS5ZWW5kpZnlVtYHDWIVbe2arsfLty8",
  authDomain: "e-bbeb3.firebaseapp.com",
  projectId: "e-bbeb3",
  storageBucket: "e-bbeb3.firebasestorage.app",
  messagingSenderId: "121630402068",
  appId: "1:121630402068:web:54ef8992cc9fedc98fe901"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Realtime Database
export const database = getDatabase(app);
export const dataRef = ref(database, "all"); // Reference to the "all" node in Realtime Database

// Initialize Firestore
export const db = getFirestore(app);

export default app;
