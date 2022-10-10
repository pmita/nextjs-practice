import { useState, useEffect } from "react";
// FIREBASE
import { auth, firestore } from "../firebase";

export const useSignUpWithEmail = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(false);

    const signUp = async (email, password, displayName) => {
        try{
            setIsPending(true);
            setError(null);
            const response = await auth.createUserWithEmailAndPassword(email, password);
            
            if (!response) {
                throw new Error("Something went wrong");
            }

            await response.user.updateProfile({ displayName });
            setUser(response.user);
        } catch(err) {
            setError(err.message);
        } finally {
            setIsPending(false);
        }
    }

}