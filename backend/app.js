import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './src/routes/authRoutes.js';
import admin from 'firebase-admin';
import fs from 'fs/promises';

dotenv.config();

// Initialize Express
const app = express();

// Firebase initialization with error handling
async function initializeFirebase() {
    try {
        const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
        
        if (!serviceAccountPath) {
            throw new Error('GOOGLE_APPLICATION_CREDENTIALS environment variable is not set');
        }

        try {
            const serviceAccount = JSON.parse(await fs.readFile(serviceAccountPath, 'utf8'));
            
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                databaseURL: "https://ewastemanagement-7bf01-default-rtdb.firebaseio.com"
            });

            console.log('Firebase initialized successfully');
            return admin.firestore();
        } catch (readError) {
            if (readError.code === 'ENOENT') {
                throw new Error(`Service account file not found at path: ${serviceAccountPath}`);
            }
            throw new Error(`Error reading service account file: ${readError.message}`);
        }
    } catch (error) {
        console.error('Firebase initialization error:', error.message);
        process.exit(1); // Exit if Firebase can't be initialized
    }
}

// Initialize Firebase and export db
export const db = await initializeFirebase();

// Middleware setup
app.use(express.json());
app.use(cors());

// Routes
app.get('/', (req, res) => {
    res.status(200).json({
        message: "Server is running!",
        firebaseStatus: !!db ? "Connected" : "Not Connected"
    });
});

app.use('/user', router);

// Server initialization with error handling
const PORT = process.env.PORT || 3000;

try {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
} catch (error) {
    console.error('Server initialization error:', error);
    process.exit(1);
}