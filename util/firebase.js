import firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCmuaZo-fph0z8m1V56vH3L_oof6vTQFI4",
    authDomain: "nextpractice-6a3f7.firebaseapp.com",
    projectId: "nextpractice-6a3f7",
    storageBucket: "nextpractice-6a3f7.appspot.com",
    messagingSenderId: "714046324386",
    appId: "1:714046324386:web:28d6847180199a869ba1fb"
  };

const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

export const firestore = app.firestore();
export const auth = app.auth();
export const storage = app.storage();