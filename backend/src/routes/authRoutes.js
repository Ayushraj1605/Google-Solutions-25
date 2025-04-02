import express from 'express';
import { signup, signin, getProfile, locations, orders, getBlogs, getOrders, getDevices, addDevice, deviceSuggestions, createBlog, updateDevice,updateBlog,deleteBlog } from '../controllers/authController.js';
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
router.get('/user/profile', authMiddleware, getProfile);
router.get('/user/orgLocations', locations);

/* Adding Devices endpoints */
router.post('/user/addDevice', addDevice);
router.put('/user/updateDevice', updateDevice);
router.get('/user/getDevices', getDevices);

/* Blogs Endpoints */
router.post('/user/blogs', createBlog);
router.get('/user/getBlogs', getBlogs);
router.put('/user/updateBlog',updateBlog);
router.delete('/user/deleteBlog',deleteBlog);
/* order Endpoints */
router.post('/user/order', orders);
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

// AI endpoint
router.post('/user/deviceSuggestions', deviceSuggestions);

export default router;
