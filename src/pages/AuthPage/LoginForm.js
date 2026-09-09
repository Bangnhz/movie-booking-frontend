import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginForm({ setError, switchToRegister }) {
    const [data, setData] = useState({ username: "", password: "" });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const resData = await response.json();
            if (!response.ok) throw new Error(resData.message || "Đăng nhập thất bại");

            localStorage.setItem("accessToken", resData.accessToken);
            localStorage.setItem("username", resData.username); 
            localStorage.setItem("roles", JSON.stringify(resData.roles || []));
            if(resData.roles.some(role => role.name.includes("ADMIN"))) navigate("/admin");
            else navigate('/home');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-white">Chào mừng trở lại</h3>
                <p className="text-gray-400 text-sm">Vui lòng đăng nhập để đặt vé phim</p>
            </div>
            
            <input
                type="text"
                placeholder="Tên tài khoản"
                className="w-full bg-white/5 border border-gray-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-red-500 outline-none"
                onChange={(e) => setData({ ...data, username: e.target.value })}
                required
            />
            <input
                type="password"
                placeholder="Mật khẩu"
                className="w-full bg-white/5 border border-gray-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-red-500 outline-none"
                onChange={(e) => setData({ ...data, password: e.target.value })}
                required
            />
            
            <button type="submit" className="bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/30">
                Đăng nhập
            </button>

            <p className="text-gray-400 text-sm text-center">
                Bạn chưa có tài khoản? 
                <button type="button" onClick={switchToRegister} className="text-red-500 font-bold ml-1 hover:underline">Đăng ký ngay</button>
            </p>
        </form>
    );
}