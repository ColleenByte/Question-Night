import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBtmcrA15kBaaeEmDQOjuSL_q-a369VmTY",
  authDomain: "question-night-417b9.firebaseapp.com",
  projectId: "question-night-417b9",
  storageBucket: "question-night-417b9.firebasestorage.app",
  messagingSenderId: "823061666662",
  appId: "1:823061666662:web:d34ec9a2db9c5435f886a7",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
