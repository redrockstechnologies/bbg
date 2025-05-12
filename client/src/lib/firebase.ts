import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFqw6BdP2DADQJAmphozyoeoGf6Zs-pnw",
  authDomain: "gearout3.firebaseapp.com",
  projectId: "gearout3",
  storageBucket: "gearout3.firebasestorage.app",
  messagingSenderId: "512167153796",
  appId: "1:512167153796:web:d920ba6859b0490176b2d1",
  measurementId: "G-RLJ1F6CDD9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
