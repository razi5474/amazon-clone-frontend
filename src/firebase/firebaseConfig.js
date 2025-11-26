import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyChPJfkgqFA8Ozs70V4vYPOf8DKV46dDTc",
  authDomain: "web-app-3e055.firebaseapp.com",
  projectId: "web-app-3e055",
  storageBucket: "web-app-3e055.appspot.com",
  messagingSenderId: "608197972242",
  appId: "1:608197972242:web:0120fa4eed805c473163cb",
  measurementId: "G-W53VWPXLLN"

};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
