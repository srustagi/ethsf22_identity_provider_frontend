// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCg6QgH5qUD8zwMl4G_uW6Pjt7hownzlHE",
  authDomain: "local-topic-367803.firebaseapp.com",
  projectId: "local-topic-367803",
  storageBucket: "local-topic-367803.appspot.com",
  messagingSenderId: "264720083257",
  appId: "1:264720083257:web:c2c6ff307d35865f8520e8",
  measurementId: "G-BLHBVCG38T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let addEntry = async (address, user) => {
  await setDoc(doc(db, "users", address), user);
}

export default addEntry;