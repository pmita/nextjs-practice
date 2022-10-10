import { useState } from "react";
// FIREBASE
import { auth, firestore } from '../util/firebase';
// CONTEXT
import { useContext } from "react";
import { AuthContext } from "../util/context";

export const useSignUpWithEmail = () => {
    // STATE & VARIABLES
    const { dispatch } = useContext(AuthContext);
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

            // Update the user's profile
            await response.user.updateProfile({ displayName });

            // Add user to 'users' & 'usernames' collections
            const userDoc = firestore.collection("users").doc(response.user.uid);
            const usernameDoc = firestore.collection("usernames").doc(displayName);
            const batch = firestore.batch();
            batch.set(userDoc, { displayName });
            batch.set(usernameDoc, { uid: response.user.uid });
            await batch.commit();

            // finally save the user in the context
            dispatch({ type: 'SIGNUP', payload: response.user });
        } catch(err) {
            setError(err.message);
            dispatch({ type: 'SIGNUP_ERROR', payload: err.message });
        } finally {
            setIsPending(false);
        }
    }


    return { error, isPending, signUp };

}