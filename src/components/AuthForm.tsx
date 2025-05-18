import React, { useState } from "react";
import { supabase } from "../lib/supabase";

interface props {
  loginOnly: boolean;
}

const AuthForm = ({ loginOnly }: props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");
  const handleAuth = async () => {
    const { error } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage(
        isLogin
          ? "Login successful!"
          : "Check your email to confirm registration."
      );
      isLogin ? (window.location.href = "/admin") : "";
    }
  };

  return (
    <div className="border border-primary rounded-lg shadow-lg shadow-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.5)] p-6 bg-base-100 mx-auto">
      <h2 className="text-2xl font-bold text-center">
        {isLogin ? "Accedi" : "Crea un Account"}
      </h2>

      <div className="form-control w-full mb-4 mt-4">
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          type="email"
          className="input input-bordered w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
      </div>

      <div className="form-control w-full mb-4">
        <label className="label">
          <span className="label-text">Password</span>
        </label>
        <input
          type="password"
          className="input input-bordered w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </div>
      <div className="flex justify-center mb-4">
        <button
          className="btn btn-lg preset-outlined-secondary-500"
          onClick={handleAuth}
        >
          {isLogin ? "Accedi" : "Registrati"}
        </button>
      </div>
      {!loginOnly && (
        <div className="text-sm text-center">
          <button
            className="text-primary underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "Need an account? Register"
              : "Already have an account? Login"}
          </button>
        </div>
      )}
      {message && <div className="alert alert-info text-sm">{message}</div>}
    </div>
  );
};

export default AuthForm;
