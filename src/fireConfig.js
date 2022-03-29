import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDq2ue2cjWfzqIms-mTVmXscvZA1prgbBs",
  authDomain: "firecommerce-b9806.firebaseapp.com",
  projectId: "firecommerce-b9806",
  storageBucket: "firecommerce-b9806.appspot.com",
  messagingSenderId: "156838596272",
  appId: "1:156838596272:web:8e0ad8bcfbf12e4cceb575",
  measurementId: "G-1SCJFWWFWC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const fireDB = getFirestore(app);

export default fireDB