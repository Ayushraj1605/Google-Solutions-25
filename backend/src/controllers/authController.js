import { db } from "../../app.js"; // Import Firestore instance
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { collection, query, where, getDocs, addDoc, Timestamp, doc, updateDoc } from "firebase/firestore";
import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);

// Example usage in your deviceSuggestions function:
export const deviceSuggestions = async (req, res) => {
    try {
        const deviceType = req.body.deviceType;
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = "Give me some really nice creative ewaste recycling tips for: " + deviceType;
        const result = await model.generateContent(prompt);
        const response = await result.response.text();
        
        return res.status(200).json({
            message: "Suggestions generated successfully",
            suggestions: response
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error generating suggestions",
            error: error.message
        });
    }
}


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
            userId: orgDoc.id,
            email: orgData.email,
            username: orgData.name,
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
            userId: userDoc.id,
            email: userData.email,
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
        const usersCollection = collection(db, "users");
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create document without userId first
        const docRef = await addDoc(usersCollection, {
            username: username,
            email: email,
            password: hashedPassword,
        });
        
        // Update the document to add the userId
        await updateDoc(docRef, {
            userId: docRef.id
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

export const addDevice = async (req, res) => 
{
    const {deviceType, deviceName, userId} = req.body;
    if (!deviceType || !deviceName) {
        return res.status(400).json({
            message: "deviceType and deviceName are required"
        });
    }
    
    try
    {
        const deviceCollection = collection(db, "Devices");
        const deviceDoc = await addDoc(deviceCollection, {
            deviceType: deviceType,
            deviceName: deviceName,
            userId : userId,
            createdAt: Timestamp.fromDate(new Date())
        });

        return res.status(200).json({
            message: "Device added successfully!",
            deviceId: deviceDoc.id
        });
    }
    catch(err)
    {
        console.error("Error adding device:", err);
        return res.status(500).json({
            message: "Error adding device",
            error: err.message
        });
    }
}

export const getDevices = async (req, res) => 
{
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({
            message: "userId is required"
        });
    }

    try {
        const devicesCollection = collection(db, "Devices");
        const devicesQuery = query(devicesCollection, where("userId", "==", userId));
        const querySnapshot = await getDocs(devicesQuery);

        const userDevices = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                deviceId: doc.id,
                deviceType: data.deviceType,
                deviceName: data.deviceName,
                createdAt: data.createdAt
            };
        });

        return res.status(200).json({
            message: "User devices retrieved successfully!",
            devices: userDevices
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error retrieving user devices",
            error: err.message
        });
    }
}

export const orders = async (req, res) => {
    const { userId, deviceId, organizationId } = req.body;

    if (!userId) {
        return res.status(400).json({
            message: "userId is required"
        });
    }

    try {
        // Reference the user document
        const userDoc = doc(db, "users", userId);
        
        // Create orders subcollection inside the user document
        const ordersCollection = collection(userDoc, "orders");
        
        // Add a new order to the subcollection
        const orderDoc = await addDoc(ordersCollection, {
            userId: userId,
            deviceId: deviceId,
            organizationId: organizationId,
            createdAt: Timestamp.fromDate(new Date()),
            status: "pending"
            // Add other order details as needed
        });

        return res.status(200).json({
            message: "Order created successfully!",
            orderId: orderDoc.id
        });

    } catch (err) {
        console.error("Error creating order:", err);
        return res.status(500).json({
            message: "Error creating order",
            error: err.message
        });
    }
}

export const getOrders = async (req, res) => 
{
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({
            message: "userId is required"
        });
    }

    try {
        const userDoc = doc(db, "users", userId);
        const ordersCollection = collection(userDoc, "orders");
        const ordersSnapshot = await getDocs(ordersCollection);

        const userOrders = ordersSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                orderId: doc.id,
                userId: data.userId,
                deviceId: data.deviceId,
                organizationId: data.organizationId,
                createdAt: data.createdAt,
                status: data.status
            };
        });

        return res.status(200).json({
            message: "User orders retrieved successfully!",
            orders: userOrders
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error retrieving user orders",
            error: err.message
        });
    }
}