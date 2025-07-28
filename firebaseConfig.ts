// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCuCQ5gZVPugj1H7qfXp30A7f-BsQLbGjQ",
  authDomain: "nutree-468ba.firebaseapp.com",
  projectId: "nutree-468ba",
  storageBucket: "nutree-468ba.appspot.com",
  messagingSenderId: "941376112744",
  appId: "1:941376112744:web:d9b53ce1b613fcc57e93dd",
  measurementId: "G-0TQJ82E19E"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };
