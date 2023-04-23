import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_KEY,
  authDomain: "www.sobrecupos.app",
  projectId: "frontend-core-bfc4e",
  storageBucket: "frontend-core-bfc4e.appspot.com",
  messagingSenderId: "1070466089894",
  appId: "1:1070466089894:web:0129d42ae177842a33c567",
  measurementId: "G-TSDKDF9M1R"
};

export const app = initializeApp(firebaseConfig);
