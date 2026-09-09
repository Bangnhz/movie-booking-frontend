import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const user = localStorage.getItem("username") || null;
  const rolesRaw = localStorage.getItem("roles");
  const roles = (rolesRaw && rolesRaw !== "undefined") ? JSON.parse(rolesRaw) : [];
  const [showMovies, setShowMovies] = useState(false);
  const [showCinemas, setShowCinemas] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  }
  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-700 text-white shadow-sm sticky top-0 z-50">
      <div className="px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/admin" className="text-xl font-bold text-yellow-400 hover:text-yellow-300">
          🎬 Admin Panel
        </Link>

        {/* Navigation */}
        <div className="flex items-center space-x-4">
          <Link to="/admin" className="text-gray-300 hover:text-white px-3 py-2 rounded">
            Dashboard
          </Link>
          
          {/* Movies Dropdown */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown('movies')}
              className="text-gray-300 hover:text-white px-3 py-2 rounded flex items-center"
            >
              Quản lý Phim
            </button>
            {openDropdown === 'movies' && (
              <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-2 min-w-40">
                <Link to="/admin/movies" className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white" onClick={() => toggleDropdown(null)}>
                  Danh sách Phim
                </Link>
                <Link to="/admin/movies/add" className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white" onClick={() => toggleDropdown(null)}>
                  Thêm Phim mới
                </Link>
              </div>
            )}
          </div>

          {/* Cinemas Dropdown */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown('cinemas')}
              className="text-gray-300 hover:text-white px-3 py-2 rounded flex items-center"
            >
              Quản lý Rạp
            </button>
            {openDropdown === 'cinemas' && (
              <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-2 min-w-40">
                <Link to="/admin/cinemas" className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white" onClick={() => toggleDropdown('null')}>
                  Danh sách Rạp
                </Link>
                <Link to="/admin/cinemas/add" className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white" onClick={() => toggleDropdown('null')}>
                  Thêm Rạp mới
                </Link>
              </div>
            )}
          </div>

          <Link to="/admin/users" className="text-gray-300 hover:text-white px-3 py-2 rounded">
            Quản lý Người dùng
          </Link>
          <Link to="/admin/genres" className="text-gray-300 hover:text-white px-3 py-2 rounded">
            Quản lý Thể loại
          </Link>
        </div>

        {/* User Menu */}
        {user ? (
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="text-gray-300 hover:text-white flex items-center"
            >
              <span className="mr-2">👤 {user}</span>
            </button>
            {showUserMenu && (
              <div className="absolute top-full right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-2 min-w-40">
                <Link to="/admin/profile" className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white">
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
          <Link to="/login" className="text-yellow-400 hover:text-yellow-300">
            Đăng nhập
          </Link>
        )}
      </div>
    </nav>
  );
}