import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState("");
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden font-sans">
            <div className="absolute top-[-10%] left-[-10%] w-80 h-80 bg-red-600 rounded-full blur-[120px] opacity-20"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-red-900 rounded-full blur-[120px] opacity-20"></div>

            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-[400px] border border-white/10">
                <div className="flex justify-center mb-6">
                    <img src="/logo.svg" alt="Logo" className="h-12 w-auto" />
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-xs py-2 px-3 rounded-lg mb-4 text-center">
                        {error}
                    </div>
                )}

                {isLogin ? (
                    <LoginForm 
                        setError={setError} 
                        switchToRegister={() => { setIsLogin(false); setError(""); }} 
                    />
                ) : (
                    <RegisterForm 
                        setError={setError} 
                        switchToLogin={() => { setIsLogin(true); setError(""); }} 
                    />
                )}
            </div>
        </div>
    );
}