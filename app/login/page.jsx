"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  auth,
  registerServiceWorker,
  requestPermission,
  saveAdminToken,
} from "@/firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // First authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Get Firebase ID token for verification
      const idToken = await user.getIdToken();

      // Send to our secure login endpoint
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        throw new Error("Authentication failed");
      }

      // Booking alerts are optional — a blocked notification prompt must not
      // turn a successful sign-in into an error.
      try {
        await registerServiceWorker();
        const fcmToken = await requestPermission();
        await saveAdminToken(user, fcmToken);
      } catch (notifyError) {
        console.warn("Booking notifications not enabled:", notifyError.message);
      }

      // Redirect to the admin page after successful authentication
      router.push("/admin");
    } catch (error) {
      setError("Invalid email or password. Please try again.");
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <main className="grid min-h-screen place-items-center bg-ink px-4">
      <div aria-hidden className="pointer-events-none fixed -right-32 -top-32 h-96 w-96 rounded-full bg-gradient-to-br from-sun-400 to-sunset-500" />
      <form
        className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-sand-50 shadow-lift"
        onSubmit={handleLogin}
      >
        <div className="flex items-center justify-between bg-sand-200 px-6 py-3 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-muted">
          <span>Crew only</span>
          <span>JETT · Admin</span>
        </div>
        <div className="space-y-4 p-6 sm:p-8">
          <h1 className="text-3xl tracking-tight">Welcome back.</h1>
          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>
          )}
          <div>
            <label htmlFor="login-email" className="field-label">Email</label>
            <input
              id="login-email"
              type="email"
              autoComplete="username"
              className="field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="login-password" className="field-label">Password</label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              className="field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={isLoading} className="btn-primary w-full !py-3.5">
            {isLoading ? "Signing in…" : "Sign in"}
          </button>
        </div>
      </form>
    </main>
  );
};

export default Login;
