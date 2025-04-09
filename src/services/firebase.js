// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

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

// Export the auth module for use in your app
export const auth = getAuth(app);
export default app;
