"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        // Redirect to admin page after login
        router.push("/admin");
      })
      .catch((error) => {
        // Handle login errors
        setError("Invalid email or password. Please try again.");
      });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        className="p-6 bg-white shadow-md rounded-lg"
        onSubmit={handleLogin}
      >
        <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          className="block w-full mb-4 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="block w-full mb-4 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full p-2 bg-emerald-600 text-white rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
