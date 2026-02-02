import React, { useState } from "react";

const Signup = ({ onBackToLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validateName = (value) => {
    return value.trim().length > 0;
  };

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@unb\.ca$/;
    return emailRegex.test(value);
  };

  const validatePassword = (value) => {
    const minLength = value.length >= 8;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
    return (
      minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar
    );
  };

  const isNameValid = validateName(name);
  const isEmailValid = validateEmail(email);
  const isPasswordValid = validatePassword(password);
  const allValid = isNameValid && isEmailValid && isPasswordValid;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!allValid) {
      setError("Please ensure all fields are valid.");
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the JWT token
        localStorage.setItem("token", data.token);
        onBackToLogin();
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Could not connect to the server");
    }
  };

  return (
    <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 w-full max-w-sm shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Create Account
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 text-xs p-3 rounded-lg text-center">
            {error}
          </div>
        )}

        <div>
          <input
            type="text"
            required
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full bg-slate-800 border p-3 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-all ${isNameValid || name === "" ? "border-slate-700" : "border-red-500"}`}
          />
          {!isNameValid && name !== "" && (
            <p className="text-red-400 text-xs mt-1">Full name is required.</p>
          )}
        </div>

        <div>
          <input
            type="email"
            required
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full bg-slate-800 border p-3 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-all ${isEmailValid || email === "" ? "border-slate-700" : "border-red-500"}`}
          />
          {!isEmailValid && email !== "" && (
            <p className="text-red-400 text-xs mt-1">
              Please enter a valid @unb.ca email address.
            </p>
          )}
        </div>

        <input
          type="password"
          required
          placeholder="Create Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full bg-slate-800 border p-3 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-all ${isPasswordValid || password === "" ? "border-slate-700" : "border-red-500"}`}
        />
        {!isPasswordValid && password !== "" && (
          <p className="text-red-400 text-xs mt-1">
            Password must be at least 8 characters long and include uppercase,
            lowercase, a number, and a special character.
          </p>
        )}

        <button
          type="submit"
          disabled={!allValid}
          className={`w-full font-bold py-3 rounded-lg transition-colors ${allValid ? "bg-blue-700 hover:bg-blue-800 text-white" : "bg-gray-600 text-gray-400 cursor-not-allowed"}`}
        >
          Create Account
        </button>

        <div className="pt-2 text-center">
          <p className="text-slate-400 text-sm">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onBackToLogin}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors underline underline-offset-4"
            >
              Sign In
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Signup;
