import express from 'express';
import { signup, signin, getProfile } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { db } from '../../app.js'; 
import { collection, getDocs, query, where } from 'firebase/firestore';

const router = express.Router();

router.get('/', (req, res) => {

    res.status(200).json({
        message: "This is the user endpoint!"
    });
});

router.post('/signup', signup);

router.post('/login', signin);

router.get('/profile', authMiddleware, getProfile);

router.get('/users', async (req, res) => {
    try {
       
        const userCollection = collection(db, "users");  
        const userSnapshot = await getDocs(userCollection);  
        const userList = userSnapshot.docs.map(doc => doc.data());  

        res.status(200).json(userList);  
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to retrieve users' });
    }
});

export default router;
