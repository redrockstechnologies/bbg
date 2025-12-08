import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAYlYYs49J2v1jt_tmyL5Q2jKcWRrlE4pI",
  authDomain: "bbg-trax.firebaseapp.com",
  projectId: "bbg-trax",
  storageBucket: "bbg-trax.firebasestorage.app",
  messagingSenderId: "144130990598",
  appId: "1:144130990598:web:0258ed4dee2e0d30e79987",
  measurementId: "G-W4WDQH635D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
