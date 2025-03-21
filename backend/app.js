// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import router from './src/routes/authRoutes.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSEGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig); // Renamed to avoid conflict with Express `app`

// Initialize Firestore
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

// Initialize Express
const app = express();

// Middleware for parsing JSON
app.use(express.json());
app.use(router);

// Basic route
app.get('/', (req, res) => {
    res.json({
        message: 'Server is running!',
        firebaseStatus: 'Connected'
    });
});

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});