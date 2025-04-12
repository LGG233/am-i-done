// services/firebase.js
import { initializeApp } from "firebase/app";
import {
    getAuth,
    setPersistence,
    browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // 👈 ADD THIS

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCq9jVb-N0u1boSa1NkRMZrPxXSPaDLQVE",
    authDomain: "amplifai-66945.firebaseapp.com",
    projectId: "amplifai-66945",
    storageBucket: "amplifai-66945.firebasestorage.app",
    messagingSenderId: "1089265874711",
    appId: "1:1089265874711:web:c54ac80d1334d7a4172952"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Create auth but don't export it yet
const auth = getAuth(app);

export const db = getFirestore(app); // 👈 AND THIS

// Set persistence BEFORE any auth method is used
setPersistence(auth, browserLocalPersistence)
    .then(() => {
        console.log("✅ Firebase auth persistence set to browserLocalPersistence");
    })
    .catch((error) => {
        console.error("🔥 Error setting persistence:", error);
    });

export { auth }; // ✅ only export after persistence setup starts
export default app;