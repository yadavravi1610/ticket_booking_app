import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAZWNpqplPuf3MIPk6sb1WYILhVc9ybJ7Q",
  authDomain: "train-booking-7cac6.firebaseapp.com",
  projectId: "train-booking-7cac6",
  storageBucket: "train-booking-7cac6.appspot.com",
  messagingSenderId: "93410569531",
  appId: "1:93410569531:web:dd9d4359a98b325ad99b1e",
  measurementId: "G-7CKVY24K3R"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export default firebaseConfig;

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
