// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAPpjED3wRoJQ1_RHKHu9rEth7kLPWWTLA",
    authDomain: "whms-auth-7ed4b.firebaseapp.com",
    projectId: "whms-auth-7ed4b",
    storageBucket: "whms-auth-7ed4b.appspot.com",
    messagingSenderId: "198515750686",
    appId: "1:198515750686:web:576815136f76090d10fb0f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);