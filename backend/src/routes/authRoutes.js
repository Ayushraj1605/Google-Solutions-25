import express from 'express';
import { signup, signin, getProfile, locations, orders, getOrders, getDevices, addDevice } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { db } from '../../app.js'; 
import { collection, getDocs, query, where } from 'firebase/firestore';
import { signupOrg, signinOrg } from '../controllers/authController.js';

const router = express.Router();

router.get('/user', (req, res) => {

    res.status(200).json({
        message: "This is the user endpoint!"
    });
}); 

/* Org Endpoints */
router.post('/org/signup', signupOrg);
router.post('/org/login', signinOrg);

/* user Endpoints */
router.post('/user/signup', signup);
router.post('/user/login', signin);     
router.post('/user/order', orders);
router.get('/user/profile', authMiddleware, getProfile);
router.get('/user/orgLocations', locations);

/* Adding Devices endpoints */
router.post('/user/addDevice', addDevice);
router.get('/user/getDevices', getDevices);

/* order Endpoints */
router.get('/user/getOrders', getOrders);
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
