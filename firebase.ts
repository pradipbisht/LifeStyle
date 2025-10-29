// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtyK9gc1qf2q19CR0LkSlQBvwOuQyVBoY",
  authDomain: "e-com-36739.firebaseapp.com",
  projectId: "e-com-36739",
  storageBucket: "e-com-36739.appspot.com",
  messagingSenderId: "814534951657",
  appId: "1:814534951657:web:fb1c6c93e6d50c8010a678",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const db = getFirestore(app);
const storage = getStorage(app);
export { auth, db, app, storage };
