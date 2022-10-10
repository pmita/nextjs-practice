import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import debounce from "lodash.debounce";
// FIREBASE
import { firestore } from "../util/firebase";
// HOOKS
import { useSignUpWithEmail } from "../hooks/useSignUpWithEmail";
// STYLES
import styles from "../styles/SignUp.module.scss";

export default function SignUpPage() {
    // STATE & VARIABLES
    const router = useRouter();
    const { 
        register, handleSubmit, formState: { errors }, reset, getValues, watch
    } = useForm( { mode: "onChange" } );
    const { username } = getValues();
    const watchUsername = watch("username");
    const [usernameExists, setUsernameExists] = useState(false);
    const [usernamePending, setUsernamePending] = useState(false);
    const [usernameError, setUsernameError] = useState(null);
    const { error, isPending, signUp } = useSignUpWithEmail();

    // EVENTS
    const onSubmit = async ({ email, password, username }) => {
        signUp(email, password, username);
        reset();
        router.push('/');
    }

    // FUNCTIONS
    const checkUsername = useCallback(debounce(async (username) => {
        if (username && username.length > 3) {
            try{
                setUsernamePending(true);
                setUsernameError(null);

                const usernameRef = firestore.collection("usernames").doc(username);
                const { exists }  = await usernameRef.get();
                setUsernameExists(!exists);
            } catch(err) {
                setUsernamePending(false);
                setUsernameError(err.message);
            } finally {
                setUsernamePending(false);
            }
        }
    }, 100), [username]);

    // USEEFFECT
    useEffect(() => {
        checkUsername(username);
    }, [username, checkUsername]);

    const UsernameMessage = () => {
        if (usernamePending) return <p>Checking...</p>
        if (usernameError) return <p>{usernameError}</p>
        if (usernameExists) return <p>Username is available</p>
        if (!usernameExists) return <p>Username is taken</p>
        return null;
    }
    return (
        <main className={styles["signup-page"]}>
            <h1>Welcome to /signup route</h1>
            <form onSubmit={handleSubmit(onSubmit)} className={styles["signup-form"]}>
                <label>
                    <span>Email</span>
                    <input type="email" {...register("email", {
                        required: "Email is required",
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address"
                        }
                    })} />
                    {errors.email && <p>{errors.email.message}</p>}
                </label>
                <label>
                    <span>Password</span>
                    <input type="password" {...register("password", {
                        required: "Password is required",
                        minLength: { value: 6, message: "Password must have at least 6 characters" },
                        maxLength: { value: 20, message: "Password must have at most 20 characters" },
                        patthern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/,
                            message: "Password must contain at least one uppercase letter, one lowercase letter and one number"
                        }
                    })} />
                    {errors.password && <p>{errors.password.message}</p>}
                </label>
                <label>
                    <span>Username</span>
                    <input type="text" {...register("username", {
                        required: "Username is required",
                        minLength: { value: 3, message: "Username must have at least 3 characters" },
                        maxLength: { value: 20, message: "Username must have at most 20 characters" },
                        pattern: {
                            value: /^[a-zA-Z0-9]+$/,
                            message: "Username must contain only letters and numbers"
                        }
                    })} />
                    {errors.username && <p>{errors.username.message}</p>}
                </label>
                {UsernameMessage()}
                <button className="btn-primary" type="submit">Sign Up</button>
            </form>
        </main>
    )
}