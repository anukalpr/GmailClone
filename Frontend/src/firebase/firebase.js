// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyAyrwXcnRRwLj9s6Ug5U01nffykd9VuQDU",
//   authDomain: "clone-37174.firebaseapp.com",
//   projectId: "clone-37174",
//   storageBucket: "clone-37174.firebasestorage.app",
//   messagingSenderId: "436852010608",
//   appId: "1:436852010608:web:79a1d88514212f9ab8ceb5",
//   measurementId: "G-RS6HWHJQXS"
// };
const firebaseConfig = {
  apiKey: "AIzaSyDULJYEGfHAPAcgFMQzY2Tz9ljgWxICTeg",
  authDomain: "clone-84c54.firebaseapp.com",
  projectId: "clone-84c54",
  storageBucket: "clone-84c54.firebasestorage.app",
  messagingSenderId: "383375376422",
  appId: "1:383375376422:web:8e4b008e55f4fb11a026e7",
  measurementId: "G-PKTEY0S9ZC"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export {app , auth};
