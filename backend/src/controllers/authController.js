import { db } from "../../app.js";
import dotenv from 'dotenv'
dotenv.config();
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const signin = async (req ,res) => 
{
    const { email, password } = req.body;

    try {
        const usersCollection = db.collection('users');
        const userQuery = await usersCollection.where('email', '==', email).get();

        if (userQuery.empty) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userDoc = userQuery.docs[0];
        const userData = userDoc.data();

        const isPasswordValid = await bcrypt.compare(password, userData.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign(
            { id: userDoc.id, email: userData.email, username: userData.username },
            process.env.JWT_SECRET,
        );

        // Respond with the token
        return res.status(200).json({
            message: 'User successfully signed in!',
            username: userData.username,
            token,
        });
    }
    catch(e) 
    {
        res.status(500).json({
            message: 'Internal server error',
            error: e
        })
    }
}

export const signup = async (req, res) => {

    const { username, email, password } = req.body; 

    try {
        // Verify collection exists first
        const usersCollection = db.collection('users');
        const hashedPassword = bcrypt.hash(password,10);

        const docRef = await usersCollection.add({
            username: username,
            email: email,
            password: hashedPassword
        });

        res.status(200).json({
            message: 'User signed up successfully!',
        })
        
        console.log("Document written with ID:", docRef.id);
        
        // Verify the document was written
        const docSnapshot = await docRef.get();
        if (docSnapshot.exists) {
            console.log("Document verified successfully");
        }
    } catch (error) {
        console.error("Error adding document:", error.message);
        console.error("Full error:", error);
    }
};

export const getProfile = async (req,res) => 
{
    
    
}

