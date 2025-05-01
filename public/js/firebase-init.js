// Firebase configuration
// Replace with your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjG4olSzA1pzHhRk4rlXCLp2m6TTOqnxE",
  authDomain: "team-heretics-22174.firebaseapp.com",
  projectId: "team-heretics-22174",
  storageBucket: "team-heretics-22174.firebasestorage.app",
  messagingSenderId: "538460562933",
  appId: "1:538460562933:web:3414aa226af89a5f362cbc",
  measurementId: "G-EF2GPJCKK2",
  databaseURL: "https://team-heretics-22174-default-rtdb.firebaseio.com"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Initialize Realtime Database
const rtdb = firebase.database();

// Export for easy access in other scripts
window.db = db;
window.rtdb = rtdb;