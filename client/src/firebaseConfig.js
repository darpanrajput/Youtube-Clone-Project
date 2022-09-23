// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_KEY,
    authDomain: "xxxx--xxxx-xxxxx.firebaseapp.com",
    projectId: "xxxx--xxxx-xxxxx",
    storageBucket: "xxxx--xxxx-xxxxx.appspot.com",
    messagingSenderId: "xxxxx75844xx",
    appId: "1:xxxxx75844xx:web:xxxx1c2d611815241564fe"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();

export default app;
export const provider = new GoogleAuthProvider();