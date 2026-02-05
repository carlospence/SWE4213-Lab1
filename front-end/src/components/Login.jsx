import React, { useState } from 'react';

const Login = ({ onLogin, onSignUpClick }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const apiUrl = import.meta.env.VITE_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset error message

        try {
            const response = await fetch(`${apiUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email, // Your backend expects "username"
                    password: password
                }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                onLogin(data.user);
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Could not connect to the server');
        }
    };

    return (
        <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 w-full max-w-sm shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">UNB Buy and Sell Login</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Display error message if login fails */}
                {error && (
                    <div className="bg-red-900/50 border border-red-500 text-red-200 text-xs p-3 rounded-lg text-center">
                        {error}
                    </div>
                )}

                <input
                    type="email"
                    required
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-all"
                />
                <input
                    type="password"
                    required
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-all"
                />

                <button
                    type="submit"
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-lg transition-colors"
                >
                    Sign In
                </button>

                <div className="pt-2 text-center">
                    <p className="text-slate-400 text-sm">
                        Don't have an account?{' '}
                        <button
                            type="button"
                            onClick={onSignUpClick}
                            className="text-blue-400 hover:text-blue-300 font-medium transition-colors underline underline-offset-4"
                        >
                            Sign Up
                        </button>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Login;