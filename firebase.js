// Import the functions you need from the SDKs you need
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQaflpUAzomvHeCcYxsXD8F_PH43z1dL4",
  authDomain: "transaction-pesaapp.firebaseapp.com",
  projectId: "transaction-pesaapp",
  storageBucket: "transaction-pesaapp.appspot.com",
  messagingSenderId: "895279523795",
  appId: "1:895279523795:web:662ff2b594477514c7f126",
  measurementId: "G-BY0M2KR2E8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//initialize firestore

export const db = getFirestore(app);