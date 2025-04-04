import { db } from "../../app.js";
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { collection, query, where, setDoc, getDocs, addDoc, Timestamp, doc, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
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

export const addAddress = async (req, res) => {
    const { userId } = req.query;
    const { Address, pinCode } = req.body;

    if (!userId || !Address || !pinCode) {
        return res.status(400).json({ message: "userId, Address and pinCode are required" });
    }

    try {
        // Reference the user document
        const userDoc = doc(db, "users", userId);
        
        // Create addresses subcollection inside the user document
        const addressesCollection = collection(userDoc, "addresses");

        // Add a new address to the subcollection
        const addressDoc = await addDoc(addressesCollection, {
            userId: userId,
            Address: Address,
            pinCode: pinCode,
            createdAt: Timestamp.fromDate(new Date())
        });

        res.status(200).json({
            message: "Address added successfully!",
            addressId: addressDoc.id
        });
    } catch (error) {
        console.error("Error adding address:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
}

// Add a new function to get user addresses
export const getAddresses = async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ message: "userId is required" });
    }

    try {
        const userDoc = doc(db, "users", userId);
        const addressesCollection = collection(userDoc, "addresses");
        const addressesSnapshot = await getDocs(addressesCollection);

        const userAddresses = addressesSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                addressId: doc.id,
                Address: data.Address,
                pinCode: data.pinCode,
                createdAt: data.createdAt
            };
        });

        res.status(200).json({
            message: "User addresses retrieved successfully!",
            addresses: userAddresses
        });
    } catch (error) {
        console.error("Error getting addresses:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}
// Get Profile Function (Optional, Implement Based on Requirements)
export const getProfile = async (req, res) => {
    const { userId } = req.query;  // Destructure userId from query params

    if (!userId) {
        return res.status(400).json({ message: "userId is required" });
    }

    try {
        const userDoc = doc(db, "users", userId);
        const userSnapshot = await getDoc(userDoc);  // Use getDoc instead of getDocs

        if (!userSnapshot.exists()) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User profile retrieved successfully!",
            profile: userSnapshot.data(),
        });
    } catch (error) {
        console.error("Error getting profile:", error);
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

export const addDevice = async (req, res) => {
    const { deviceType, deviceName, userId } = req.body || null;
    /* For the case of recycling the device */
    const {
        organizationName,
        organizationId,
        imei,
        modelNumber,
        purchaseYear,
        address,
        pinCode,
        status,
        submittedAt } = req.body || null;

    if (!deviceType || !deviceName) {
        return res.status(400).json({
            message: "deviceType and deviceName are required"
        });
    }

    try {
        const deviceCollection = collection(db, "Devices");
        const deviceDoc = await addDoc(deviceCollection, {
            deviceType: deviceType,
            deviceName: deviceName,
            userId: userId,
            createdAt: Timestamp.fromDate(new Date()),
            organizationId: organizationId,
            address: address,
            pinCode: pinCode,
            imei: imei,
            modelNumber: modelNumber,
            purchaseYear: purchaseYear,
            status: status,
            organizationName: organizationName,
            submittedAt: submittedAt
        });

        return res.status(200).json({
            message: "Device added successfully!",
            deviceId: deviceDoc.id
        });
        console.log(organizationId, description, imei, modelNumber, purchaseYear, status);
    }
    catch (err) {
        console.error("Error adding device:", err);
        return res.status(500).json({
            message: "Error adding device",
            error: err.message
        });
    }
}

export const updateDevice = async (req, res) => {
    const { deviceId } = req.query;

    if (!deviceId) {
        return res.status(400).json({
            message: "deviceId is required"
        });
    }

    try {
        const deviceDocRef = doc(db, "Devices", deviceId);
        const deviceSnapshot = await getDoc(deviceDocRef);

        if (!deviceSnapshot.exists()) {
            return res.status(404).json({
                message: "Device not found"
            });
        }

        // Get the data you want to update from the request body
        const updateData = req.body;

        // Update the document
        await updateDoc(deviceDocRef, updateData);

        return res.status(200).json({
            message: "Device updated successfully"
        });
    } catch (err) {
        console.error("Error updating device:", err);
        return res.status(500).json({
            message: "Failed to update device",
            error: err.message
        });
    }
}

// Duplicate donateDevice function removed to fix the issue

export const getDevices = async (req, res) => {
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
                createdAt: data.createdAt,
                status: data.status,
                imei: data.imei,
                modelNumber: data.modelNumber,
                organizationId: data.organizationId,
                organizationName: data.organizationName,
                purchaseYear: data.purchaseYear,
                modelNumber: data.modelNumber,
                description: data.description,
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
    const userId = req.query.userId;
    const { deviceId, organizationId } = req.body;

    if (!userId) {
        return res.status(400).json({
            message: "userId is required"
        });
    }

    try {
        // First, create the order document for the user
        const userDoc = doc(db, "users", userId);
        const userOrdersCollection = collection(userDoc, "orders");
        
        // Create the order data
        const orderData = {
            userId: userId,
            deviceId: deviceId,
            organizationId: organizationId,
            createdAt: Timestamp.fromDate(new Date()),
            status: "pending"
        };

        // Add to user's orders first
        const userOrderDoc = await addDoc(userOrdersCollection, orderData);
        const orderId = userOrderDoc.id; // Get the generated orderId

        // Now add the same order (with same ID) to organization's orders
        const organizationDoc = doc(db, "Organization", organizationId);
        const orgOrdersCollection = collection(organizationDoc, "orders");
        
        // Use the same orderId for organization's order
        await setDoc(doc(orgOrdersCollection, orderId), {
            ...orderData,
            orderId: orderId // Include the orderId in the data
        });

        return res.status(200).json({
            message: "Order created successfully!",
            orderId: orderId
        });

    } catch (err) {
        console.error("Error creating order:", err);
        return res.status(500).json({
            message: "Error creating order",
            error: err.message
        });
    }
}

export const getOrgOrders = async (req, res) => {
    const organizationId = req.query.organizationId;

    if (!organizationId) {
        return res.status(400).json({
            message: "organizationId is missing"
        });
    }

    try {
        const organizationDoc = doc(db, "Organization", organizationId);
        const ordersCollection = collection(organizationDoc, "orders");
        const ordersSnapshot = await getDocs(ordersCollection);

        const orgOrders = ordersSnapshot.docs.map(doc => {
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
            message: "Organization orders retrieved successfully!",
            orders: orgOrders
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error retrieving organization orders",
            error: err.message
        });
    }
}

export const getOrders = async (req, res) => {
    const userId = req.query.userId;

    if (!userId) {
        return res.status(400).json({
            message: "userId is missing"
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

export const createBlog = async (req, res) => {
    const { userId } = req.query;
    // const { title,description } = req.body;
    const title = req.body.title;
    const body = req.body.body;


    if (!body || !title) {
        return res.status(400).json({
            message: "Body and title are required"
        });
    }

    try {
        // First, get the username from users collection by matching document ID
        const usersCollection = collection(db, "users");
        const userSnapshot = await getDocs(usersCollection);

        // Find the user document where doc.id matches userId
        const userDoc = userSnapshot.docs.find(doc => doc.id === userId);

        if (!userDoc) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const userData = userDoc.data();
        const username = userData.username;

        // Reference the main blogs collection
        const blogsCollection = collection(db, "blogs");

        // Add the blog document with user reference and username
        const blogDoc = await addDoc(blogsCollection, {
            userId: userId,
            username: username,
            body: body,
            title: title,
            createdAt: Timestamp.fromDate(new Date()),
        });

        return res.status(200).json({
            message: "Blog created successfully!",
            blogId: blogDoc.id,
            username: username
        });
    } catch (err) {
        console.error("Error creating blog:", err);
        return res.status(500).json({
            message: "Error creating blog",
            error: err.message
        });
    }
}

export const getBlogs = async (req, res) => {
    const userId = req.query.userId;

    try {
        const blogsCollection = collection(db, "blogs");
        const blogsSnapshot = await getDocs(blogsCollection);

        let blogs;

        if (userId) {
            // If userId is provided, filter blogs with matching userId
            blogs = blogsSnapshot.docs
                .filter(doc => doc.data().userId === userId)
                .map(doc => {
                    const data = doc.data();
                    return {
                        blogId: doc.id,
                        userId: data.userId,
                        username: data.username,
                        body: data.body,
                        title: data.title,
                        createdAt: data.createdAt
                    };
                });
        } else {
            // If no userId, return all blogs
            blogs = blogsSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    blogId: doc.id,
                    userId: data.userId,
                    username: data.username,
                    body: data.body,
                    title: data.title,
                    createdAt: data.createdAt
                };
            });
        }

        return res.status(200).json({
            message: userId ? "User blogs retrieved successfully!" : "Blogs retrieved successfully!",
            blogs: blogs
        });
    } catch (err) {
        console.error("Error retrieving blogs:", err);
        return res.status(500).json({
            message: "Error retrieving blogs",
            error: err.message
        });
    }
}

export const updateBlog = async (req, res) => {
    const { blogId } = req.query;
    const { title, body } = req.body;

    if (!blogId) {
        return res.status(400).json({
            message: "blogId is required"
        });
    }

    try {
        const blogDocRef = doc(db, "blogs", blogId);
        const blogSnapshot = await getDoc(blogDocRef);

        if (!blogSnapshot.exists()) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        // Update the document with new title and body
        await updateDoc(blogDocRef, {
            title: title,
            body: body
        });

        return res.status(200).json({
            message: "Blog updated successfully"
        });
    } catch (err) {
        console.error("Error updating blog:", err);
        return res.status(500).json({
            message: "Failed to update blog",
            error: err.message
        });
    }
}

export const deleteBlog = async (req, res) => {
    const blogId = req.query.blogId;
    if (!blogId) {
        return res.status(400).json({
            message: "blogId is required"
        });
    }
    else {
        try {
            const blogDocRef = doc(db, "blogs", blogId);
            await deleteDoc(blogDocRef);

            return res.status(200).json({
                message: "Blog deleted successfully"
            });
        } catch (err) {
            console.error("Error deleting blog:", err);
            return res.status(500).json({
                message: "Failed to delete blog",
                error: err.message
            });
        }
    }
}

export const donateDevice = async (req, res) => {
    const { deviceId } = req.query;

if (!deviceId) {
    return res.status(400).json({
        message: "deviceId is required"
    });
}

try {
    const deviceDocRef = doc(db, "Devices", deviceId);
    const deviceSnapshot = await getDoc(deviceDocRef);

    if (!deviceSnapshot.exists()) {
        return res.status(404).json({
            message: "Device not found"
        });
    }

    // Only update the status field to "InDonation"
    await updateDoc(deviceDocRef, {
        status: "InDonation"
    });

    return res.status(200).json({
        message: "Device status updated to InDonation successfully"
    });
} catch (err) {
    console.error("Error updating device status:", err);
    return res.status(500).json({
        message: "Failed to update device status",
        error: err.message
    });
}
}

export const getInDonationDevices = async (req, res) => {
    try {
        const devicesCollection = collection(db, "Devices");
        const devicesSnapshot = await getDocs(devicesCollection);

        // Filter devices with status "InDonation" and map to desired format
        const devices = devicesSnapshot.docs
            .filter(doc => doc.data().status === "InDonation")
            .map(doc => {
                const data = doc.data();
                return {
                    deviceId: doc.id,
                    deviceName: data.deviceName,
                    deviceType: data.deviceType,
                    status: data.status,
                    imageUrl: data.imageUrl,
                    userId: data.userId,
                    createdAt: data.createdAt
                };
            });

        return res.status(200).json({
            message: "Devices with 'InDonation' status retrieved successfully!",
            devices: devices
        });
    } catch (err) {
        console.error("Error retrieving devices:", err);
        return res.status(500).json({
            message: "Error retrieving devices",
            error: err.message
        });
    }
}

export const getHomeFeed = async (req, res) => {
    try {
        // Fetch blogs
        const blogsCollection = collection(db, "blogs");
        const blogsSnapshot = await getDocs(blogsCollection);
        
        const blogs = blogsSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                type: 'blog',
                userId: data.userId,
                username: data.username,
                body: data.body,
                title: data.title,
                createdAt: data.createdAt,
                // Add any other blog fields you want to include
            };
        });

        // Fetch devices
        const devicesCollection = collection(db, "Devices");
        const devicesSnapshot = await getDocs(devicesCollection);
        
        const devices = devicesSnapshot.docs
            .filter(doc => doc.data().status === "InDonation")
            .map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    type: 'device',
                    name: data.name,
                    deviceType: data.type,
                    status: data.status,
                    location: data.location,
                    currentOwner: data.currentOwner,
                    donationInfo: data.donationInfo,
                    createdAt: data.createdAt,
                    // Add any other device fields you want to include
                };
            });

        // Combine and sort by createdAt (newest first)
        const combinedFeed = [...blogs, ...devices].sort((a, b) => {
            // Convert to timestamps for comparison
            const dateA = new Date(a.createdAt?.seconds * 1000 || a.createdAt);
            const dateB = new Date(b.createdAt?.seconds * 1000 || b.createdAt);
            return dateB - dateA; // For newest first
        });

        return res.status(200).json({
            message: "Combined feed retrieved successfully!",
            feed: combinedFeed
        });
    } catch (err) {
        console.error("Error retrieving combined feed:", err);
        return res.status(500).json({
            message: "Error retrieving combined feed",
            error: err.message
        });
    }
};