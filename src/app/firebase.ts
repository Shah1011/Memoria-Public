// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCaV8QQqJrQMC7a1nvdzQNlD0b2Gs8VRg",
  authDomain: "memoria-fbc42.firebaseapp.com",
  projectId: "memoria-fbc42",
  storageBucket: "memoria-fbc42.appspot.com",
  messagingSenderId: "810756943856",
  appId: "1:810756943856:web:7fa3e6ff6e45f66a68f735"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };