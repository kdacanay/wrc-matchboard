import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAOJ9YYRu3QUE3o9psBJCWDg_EgDuXoyrg",
  authDomain: "wrc-matchboard.firebaseapp.com",
  projectId: "wrc-matchboard",
  storageBucket: "wrc-matchboard.firebasestorage.app",
  messagingSenderId: "14594152664",
  appId: "1:14594152664:web:fd4e9456e63b6cc3b5dfad",
  measurementId: "G-SVVN19FM76"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);