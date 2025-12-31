// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAF5lUUz0TvxeDcNMvoKwxezXJb1rvlZW8",
  authDomain: "xenotixtech.firebaseapp.com",
  projectId: "xenotixtech",
  storageBucket: "xenotixtech.appspot.com",
  messagingSenderId: "935775713058",
  appId: "1:935775713058:web:05ecfb40912636b8f4577b",
  measurementId: "G-1VKD3L5G1Z",
};

// const firebaseConfig = {
//   apiKey: "AIzaSyA6hPiCznDoKTgZQ-mI8jTUDI8tgNZrrx0",
//   authDomain: "vahan-suraksha-d2181.firebaseapp.com",
//   projectId: "vahan-suraksha-d2181",
//   storageBucket: "vahan-suraksha-d2181.firebasestorage.app",
//   messagingSenderId: "1056503336845",
//   appId: "1:1056503336845:web:9f2f96bb4e0e0e761e77c4"
// };


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);