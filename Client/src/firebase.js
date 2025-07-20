// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "estate-f6a52.firebaseapp.com",
  projectId: "estate-f6a52",
  storageBucket: "estate-f6a52.appspot.com",
  messagingSenderId: "9254190515",
  appId: "1:9254190515:web:cb03741ee7701431381fc6",
  measurementId: "G-V8F1W328W2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);