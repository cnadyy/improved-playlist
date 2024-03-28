import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZ8ifFzkzFQ0ASKh5A4L-0zq2OT7buuaU",
  authDomain: "improv-spotif.firebaseapp.com",
  projectId: "improv-spotif",
  storageBucket: "improv-spotif.appspot.com",
  messagingSenderId: "580907467056",
  appId: "1:580907467056:web:39a22bb9cba6fd90cf48f5"
};

const App = initializeApp(firebaseConfig);

const Db = getFirestore(App);

const Auth = getAuth(App);

export { Db, App, Auth };
