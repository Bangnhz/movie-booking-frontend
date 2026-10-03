import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { checkIsAdmin } from "../../utils/auth";

export default function Header() {
  const navigate = useNavigate();
  const user = localStorage.getItem("username") || null;
  const rolesRaw = localStorage.getItem("roles");
  const isAdmin = checkIsAdmin(rolesRaw);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-700 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/home" className="text-xl font-bold text-red-500 hover:text-red-400">
          🎬 Đặt vé online
        </Link>

        {/* Navigation */}
        <div className="flex items-center space-x-6">
          <Link to="/movies" className="text-gray-300 hover:text-white transition-colors">
            Phim
          </Link>
          <Link to="/cinemas" className="text-gray-300 hover:text-white transition-colors">
            Rạp chiếu phim
          </Link>
          <Link to="/offers" className="text-gray-300 hover:text-white transition-colors">
            Ưu đãi
          </Link>
        </div>

        {/* User Menu */}
        {user ? (
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="text-blue-400 hover:text-blue-300 flex items-center"
            >
              <span className="mr-2">Chào, {user}</span>
            </button>
            {showUserMenu && (
              <div className="absolute top-full right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-2 min-w-40">
                {isAdmin && (
                  <Link to="/admin" className="block px-4 py-2 text-yellow-400 hover:bg-gray-700 hover:text-yellow-300">
                    📊 Admin Panel
                  </Link>
                )}
                <Link to="/profile" className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white">
                  Hồ sơ
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="block w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 hover:text-red-300"
                >
                  🚪 Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="text-red-500 hover:text-red-400 font-medium">
            Đăng nhập/Đăng ký
          </Link>
        )}
      </div>
    </nav>
  );
}