import { db } from "../../app.js"; // Import Firestore instance
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { collection, query, where, getDocs, addDoc, Timestamp } from "firebase/firestore";

// Sign-In Function

export const signupOrg = async (req, res) => {
    const { name, email, password, GST, Address, latitude, longitude } = req.body;

    // Validate all required fields are present
    if (!name || !email || !password || !GST || !Address || !latitude || !longitude) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Validate data types
    if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string' ||
        typeof GST !== 'string' || typeof Address !== 'string') {
        return res.status(400).json({ message: "Invalid data types" });
    }

    // Convert latitude and longitude to numbers if they're strings
    const lat = Number(latitude);
    const lng = Number(longitude);

    if (isNaN(lat) || isNaN(lng)) {
        return res.status(400).json({ message: "Invalid latitude or longitude values" });
    }

    try {
        // Check if organization with email already exists
        const orgCollection = collection(db, "Organization");
        const existingOrgQuery = query(orgCollection, where("email", "==", email));
        const existingOrgSnapshot = await getDocs(existingOrgQuery);

        if (!existingOrgSnapshot.empty) {
            return res.status(409).json({ message: "Organization with this email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create document data
        const orgData = {
            name,
            email,
            password: hashedPassword,
            GST,
            Address,
            latitude: lat,
            longitude: lng,
            createdAt: Timestamp.fromDate(new Date()) // Convert to Firestore Timestamp
        };

        console.log("Data being sent to Firestore:", orgData);

        // Create new organization document
        const docRef = await addDoc(orgCollection, orgData);

        // Generate JWT token
        const token = jwt.sign(
            { id: docRef.id, email, name },
            process.env.JWT_SECRET
        );

        return res.status(200).json({
            message: "Organization registered successfully!",
            userId: docRef.id,
            token
        });
    } catch (err) {
        console.error("Signup error:", err.message);
        return res.status(500).json({
            message: "Internal server error",
            error: err.message
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

export const locations = async (req, res) => {
    try {
        const locationCollection = collection(db, "Organization");
        const querySnapshot = await getDocs(locationCollection);

        // Map the documents to extract only name, latitude, and longitude
        const organizationLocations = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                name: data.name,
                Address: data.Address,
                latitude: data.latitude,
                longitude: data.longitude
            };
        });

        return res.status(200).json({
            message: "Organizations locations retrieved successfully!",
            locations: organizationLocations
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error retrieving organization locations",
            error: err.message
        });
    }
};
