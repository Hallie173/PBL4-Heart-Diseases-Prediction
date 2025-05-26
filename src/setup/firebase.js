// // src/firebase.js
// import { initializeApp } from "firebase/app";

// const firebaseConfig = {
//   apiKey: "AIzaSyDzdTVUocq92-NdBF1tByX3wudL5wmW9PY",
//   authDomain: "pbl4-f183a.firebaseapp.com",
//   projectId: "pbl4-f183a",
//   storageBucket: "pbl4-f183a.appspot.com",
//   messagingSenderId: "915661157521",
//   appId: "1:915661157521:web:d862afb73bc1bb280e3b30",
//   databaseURL: "https://pbl4-f183a-default-rtdb.firebaseio.com/", // Optional for Realtime Database
//   measurementId: "G-4TDZFPVN8C",
// };

// // Initialize Firebase
// export const app = initializeApp(firebaseConfig);

// Import the functions you need from the SDKs you need
// import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref, remove } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBqtuWLDn1DJXMzFWaVCkFSYShAmu83pos",
  authDomain: "healthy-heart-7f60d.firebaseapp.com",
  projectId: "healthy-heart-7f60d",
  storageBucket: "healthy-heart-7f60d.firebasestorage.app",
  messagingSenderId: "575879998029",
  appId: "1:575879998029:web:69a5eb3e528d949df7ca04",
  measurementId: "G-HSQVGB9NP2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const callsRef = ref(db, "calls");
onValue(callsRef, (snapshot) => {
  const data = snapshot.val() || {};
  Object.keys(data).forEach((callId) => {
    if (data[callId].status === "ended") {
      remove(ref(db, `calls/${callId}`));
    }
  });
});
// const analytics = getAnalytics(app);
export { app, db };
