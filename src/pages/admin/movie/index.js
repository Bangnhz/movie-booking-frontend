import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMoviesPaged } from "../../../service/MovieService";

export default function MovieList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const fetchMovies = async (page) => {
    setLoading(true);
    try {
      const response = await getMoviesPaged(page, 7);
      setMovies(response.content || []);
      setTotalPages(response.totalPages || 0);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách phim:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) return <div className="text-white p-4">Đang tải dữ liệu...</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Quản lý Phim</h2>
        <Link 
          to="/admin/movies/add" 
          className="group flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-red-600/30 hover:shadow-red-600/50 transition-all duration-300 hover:-translate-y-0.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Thêm phim mới
        </Link>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full text-left text-gray-300">
          <thead className="bg-gray-700 text-gray-200 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Poster</th>
              <th className="px-4 py-3">Tên phim</th>
              <th className="px-4 py-3">Độ tuổi</th>
              <th className="px-4 py-3">Thời lượng</th>
              <th className="px-4 py-3">Khởi chiếu</th>
              <th className="px-4 py-3">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {movies.map((movie) => (
              <tr key={movie.id} className="hover:bg-gray-700 transition-colors">
                <td className="px-4 py-3">#{movie.id}</td>
                <td className="px-4 py-3">
                  <img 
                    src={movie.posterUrl} 
                    alt={movie.title} 
                    className="w-10 h-14 object-cover rounded shadow-md"
                  />
                </td>
                <td className="px-4 py-3 font-bold text-white">{movie.title}</td>
                <td className="px-4 py-3">
                    <span className="bg-orange-500/20 text-orange-500 px-2 py-0.5 rounded text-xs">
                        {movie.ageRating}
                    </span>
                </td>
                <td className="px-4 py-3">{movie.duration} phút</td>
                <td className="px-4 py-3">{movie.releaseDate}</td>
                <td className="px-4 py-3">
                   <Link to={`/admin/movies/${movie.id}`} className="text-green-400 hover:text-green-300 px-2 py-1 rounded border border-green-500 hover:bg-green-500 hover:text-white transition-all text-sm inline-block">
                     Chi tiết
                   </Link>
                   <Link to={`/admin/movies/${movie.id}`} className="text-blue-300 hover:text-blue-300 mr-3 px-2 py-1 rounded border border-blue-500 hover:bg-blue-500 hover:text-white transition-all text-sm inline-block">
                     Sửa
                   </Link>
                   <button className="text-red-300 hover:text-red-300 px-2 py-1 rounded border border-red-500 hover:bg-red-500 hover:text-white transition-all text-sm">
                     Xóa
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex text-gray-300 justify-center mt-6 gap-2">
          <button
            disabled={currentPage === 0}
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-4 py-2 bg-gray-700 rounded disabled:opacity-30"
          >
            ← Trước
          </button>
          
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i)}
              className={`px-4 py-2 rounded ${currentPage === i ? 'bg-red-600' : 'bg-gray-700'}`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages - 1}
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-4 py-2 bg-gray-700 rounded disabled:opacity-30"
          >
            Sau →
          </button>
        </div>
      )}
    </div>
  );
}