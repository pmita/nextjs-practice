import { createContext, useReducer, useEffect } from "react";
// FIREBASE
import { auth } from "../util/firebase";

export const AuthContext = createContext();

let initialState = {
    user: null,
    username: null,
    authIsReady: false,
}

const authReducer = (state, action) => {
    switch(action.type){
        case "SIGNUP":
            return { ...state, user: action.payload };
        case "SIGNUP_ERROR":
            return { ...state, error: action.payload };
        case "SIGNOUT":
            return { ...state, user: null};
        case "AUTH_READY":
            return { ...state, authIsReady: true, user: action.payload };
        default:
            return { ...state };
    }
}

export const AuthProvider = ({ children }) => {
    // STATE & VARIABLES
    const [state, dispatch] = useReducer(authReducer, initialState);

    // USEEFFECT
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            console.log(user);
            if (user) {
                dispatch({ type: 'AUTH_READY', payload: user });
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};