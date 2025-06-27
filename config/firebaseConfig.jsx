// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {initializeAuth, getReactNativePersistence} from 'firebase/auth'
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBhA9kwIVGL-Qnv-8ZokGj_K39v_lVodXI",
  authDomain: "projects-2025-36e66.firebaseapp.com",
  projectId: "projects-2025-36e66",
  storageBucket: "projects-2025-36e66.firebasestorage.app",
  messagingSenderId: "742909295292",
  appId: "1:742909295292:web:ba41db7da97b2c87d22eb9",
  measurementId: "G-M11W7KBWRM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=initializeAuth(app, {
  persistence:getReactNativePersistence(ReactNativeAsyncStorage)
})
export const db = getFirestore(app);
const analytics = getAnalytics(app);