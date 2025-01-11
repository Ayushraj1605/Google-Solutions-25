import { db } from "../../app.js";

export const signin = async (req ,res) => 
{
    /* Logic to verify the JWT */ 
    
}

export const signup = async (req, res) => {
    const { username, email, password } = req.body; 

    try {
        // Verify collection exists first
        const usersCollection = db.collection('users');
        
        const docRef = await usersCollection.add({
            username: username,
            email: email,
            password: password
        });
        
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

