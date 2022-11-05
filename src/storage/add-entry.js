import { initializeApp } from "firebase/app";
import { getFirestore, setDoc } from "firebase/firestore";
import { collection, addDoc, doc} from "firebase/firestore";

async function addEntry(address, cid) {
    const firebaseConfig = {
        apiKey: "AIzaSyAdsaGn3ubLloml5CpkSrzCO9fms_HgMEc",
        authDomain: "attest-ecad7.firebaseapp.com",
        projectId: "attest-ecad7",
        storageBucket: "attest-ecad7.appspot.com",
        messagingSenderId: "563415869011",
        appId: "1:563415869011:web:cc1cca1e10226c1c30c8a6",
        measurementId: "G-VBGQH4HVQ1"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // Add key-value pair to database
    const docRef = await setDoc(doc(db, "entries", address), {
        cid: cid
    });
    console.log("Document written with ID: ", address);
    return;
}


export default addEntry;