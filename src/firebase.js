// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDI_DnteZbC8wnPWR-gXTaWtrFu10hND4E",
  authDomain: "sai-brindavan.firebaseapp.com",
  projectId: "sai-brindavan",
  storageBucket: "sai-brindavan.firebasestorage.app",
  messagingSenderId: "1093068889968",
  appId: "1:1093068889968:web:63e84201f1b26bf7ef39b5",
  measurementId: "G-TNFP2NRBZJ"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);