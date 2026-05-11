
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAY6FlNl6TM3CHtlnz1rht0H9_og3QzgvQ",
  authDomain: "historylab4-706b8.firebaseapp.com",
  projectId: "historylab4-706b8",
  storageBucket: "historylab4-706b8.firebasestorage.app",
  messagingSenderId: "113973078823",
  appId: "1:113973078823:web:c1e4dc42a5812845935702",
  measurementId: "G-BED38QDCJX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Саме ці два рядки "експортують" auth та db, щоб інші файли їх бачили!
export const auth = getAuth(app);
export const db = getFirestore(app);