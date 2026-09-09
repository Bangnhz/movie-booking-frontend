import { useState } from "react";

export default function RegisterForm({ setError, switchToLogin }) {
    const [data, setData] = useState({ fullname: "", username:"",phone: "", email: "", password: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const resData = await response.json();
            if (!response.ok) throw new Error(resData.message || "Đăng ký thất bại");

            alert("Đăng ký thành công! Hãy đăng nhập.");
            switchToLogin();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-white">Tạo tài khoản mới</h3>
                <p className="text-gray-400 text-sm">Đăng ký để nhận nhiều ưu đãi hấp dẫn</p>
            </div>

            <input
                type="text"
                placeholder="Họ và tên"
                className="w-full bg-white/5 border border-gray-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-red-500 outline-none"
                onChange={(e) => setData({ ...data, fullname: e.target.value })}
                required
            />
            <input
                type="text"
                placeholder="Tên tài khoản"
                className="w-full bg-white/5 border border-gray-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-red-500 outline-none"
                onChange={(e) => setData({ ...data, username: e.target.value })}
                required
            />
            <input
                type="text"
                placeholder="Số điện thoại"
                className="w-full bg-white/5 border border-gray-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-red-500 outline-none"
                onChange={(e) => setData({ ...data, phone: e.target.value })}
                required
            />
            <input
                type="email"
                placeholder="Email"
                className="w-full bg-white/5 border border-gray-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-red-500 outline-none"
                onChange={(e) => setData({ ...data, email: e.target.value })}
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
                Đăng ký
            </button>

            <p className="text-gray-400 text-sm text-center">
                Đã có tài khoản? 
                <button type="button" onClick={switchToLogin} className="text-red-500 font-bold ml-1 hover:underline">Đăng nhập ngay</button>
            </p>
        </form>
    );
}