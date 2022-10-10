import { useContext } from "react";
import Link from "next/link";
// CONTEXT
import { AuthContext } from "../util/context";

export default function Narbar() {
    // STATE & VARIABLES
    const { user, dispatch } = useContext(AuthContext);
    return (
        <nav className="navbar">
            <h2 className="navbar-logo">Nextagram</h2>
            <ul className="navbar-links">
                {!user && (
                    <Link href="/signup" className="btn-primary">
                        Sign Up
                    </Link>
                )}
                {user && (
                    <button className="btn-primary" type="button" onClick={() => auth.signOut()}>Sign Out</button>
                )}
            </ul>

        </nav>
    )
}