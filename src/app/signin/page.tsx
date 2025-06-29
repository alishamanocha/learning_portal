"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { useRouter } from "next/navigation";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSignIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/");
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Sign In</h1>
            <input
                type="email"
                placeholder="Email"
                className="w-full mb-2 p-2 border rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                className="w-full mb-2 p-2 border rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button onClick={handleSignIn} className="w-full bg-blue-600 text-white p-2 rounded">
                Sign In
            </button>
        </div>
    );
}