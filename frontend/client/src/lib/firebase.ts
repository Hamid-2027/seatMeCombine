import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyABArBgR8lHwQgC-qYSXnZBQHYiADEXdI8",
    authDomain: "seatme-cd356.firebaseapp.com",
    projectId: "seatme-cd356",
    storageBucket: "seatme-cd356.firebasestorage.app",
    messagingSenderId: "211288303829",
    appId: "1:211288303829:web:0afb585ced6fb129751a5c",
    measurementId: "G-7F23XWLHRZ"
  };


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
