import { db } from "../../app.js"; // Import Firestore instance
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

// Sign-In Function

export const signupOrg = async (req, res) => {
    const { name, email, password, GST } = req.body;

    if (!name || !email || !password || !GST) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const orgCollection = collection(db, "Organization");
        const hashedPassword = await bcrypt.hash(password, 10);

        const docRef = await addDoc(orgCollection, {
            name,
            email,
            password: hashedPassword,
            GST,
        });

        return res.status(200).json({
            message: "Organization registered successfully!",
            userId: docRef.id,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error",
            error: err.message,
        });
    }
};

export const signinOrg = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const orgCollection = collection(db, "Organization");
        const orgQuery = query(orgCollection, where("email", "==", email));
        const querySnapshot = await getDocs(orgQuery);

        if (querySnapshot.empty) {
            return res.status(404).json({ message: "Organization not found" });
        }

        const orgDoc = querySnapshot.docs[0];
        const orgData = orgDoc.data();

        const isPasswordValid = await bcrypt.compare(password, orgData.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: orgDoc.id, email: orgData.email, name: orgData.name },
            process.env.JWT_SECRET,
        );

        return res.status(200).json({
            message: "Organization successfully signed in!",
            name: orgData.name,
            token,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const usersCollection = collection(db, "users"); // Reference to 'users' collection
        const userQuery = query(usersCollection, where("email", "==", email));
        const querySnapshot = await getDocs(userQuery);

        if (querySnapshot.empty) {
            return res.status(404).json({ message: "User not found" });
        }

        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();

        const isPasswordValid = await bcrypt.compare(password, userData.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            { id: userDoc.id, email: userData.email, username: userData.username },
            process.env.JWT_SECRET
        );

        // Respond with the token
        return res.status(200).json({
            message: "User successfully signed in!",
            username: userData.username,
            token,
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Sign-Up Function
export const signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const usersCollection = collection(db, "users"); // Reference to 'users' collection
        const hashedPassword = await bcrypt.hash(password, 10);

        const docRef = await addDoc(usersCollection, {
            username: username,
            email: email,
            password: hashedPassword,
        });

        res.status(200).json({
            message: "User signed up successfully!",
            userId: docRef.id,
        });

        console.log("Document written with ID:", docRef.id);
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Get Profile Function (Optional, Implement Based on Requirements)
export const getProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const userDoc = doc(db, "users", userId);
        const userSnapshot = await getDocs(userDoc);

        if (!userSnapshot.exists()) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User profile retrieved successfully!",
            profile: userSnapshot.data(),
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};
