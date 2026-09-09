import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { searchCinemas } from "../../../service/CinemaService";
import { getCities } from "../../../service/CityService";

export default function CinemaList() {
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [cities, setCities] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 5;

  const fetchCinemas = async (page = 0) => {
    setLoading(true);
    try {
      const response = await searchCinemas({
        name: searchTerm,
        cityId: selectedCity,
        page: page,
        size: pageSize,
        sort: "id,asc"
      });
      console.log(response);
      
      setCinemas(response.content || []);
      setTotalPages(response.totalPages || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching cinemas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCinemas(0);
    getCities().then(data => setCities(data)).catch(console.error);
  }, []);

  const handleSearch = () => {
    fetchCinemas(0);
  };

  const handlePageChange = (newPage) => {
    fetchCinemas(newPage);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-xl">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-white">Quản lý Rạp chiếu</h2>
        <Link 
          to="/admin/cinemas/add" 
          className="group flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-red-600/30 hover:shadow-red-600/50 transition-all duration-300 hover:-translate-y-0.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Thêm rạp mới
        </Link>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên rạp..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-red-500"
          />
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-red-500"
          >
            <option value="">Tất cả thành phố</option>
            {cities.map(city => (
              <option key={city.id} value={city.id}>{city.name}</option>
            ))}
          </select>
          <button
            onClick={handleSearch}
            className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Tìm kiếm
          </button>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        {cinemas.length === 0 ? (
          <div className="text-center text-gray-400 py-8">Không tìm thấy rạp nào</div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-300">
            <thead className="bg-gray-700 text-gray-200 uppercase text-sm">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Tên rạp</th>
                <th className="px-4 py-3">Địa chỉ</th>
                <th className="px-4 py-3">Thành phố</th>
                <th className="px-4 py-3">Số phòng</th>
                <th className="px-4 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {cinemas.map(cinema => (
                <tr key={cinema.id} className="hover:bg-gray-700 transition-colors">
                  <td className="px-4 py-3">#{cinema.id}</td>
                  <td className="px-4 py-3 font-medium text-white">
                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${cinema.name}`)}`}>{cinema.name}</a></td>
                  <td className="px-4 py-3">{cinema.address}</td>
                  <td className="px-4 py-3">{cinema.city}</td>
                  <td className="px-4 py-3">{cinema.numberOfRoom} phòng</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link to={`/admin/cinemas/${cinema.id}/edit`} className="text-blue-400 hover:text-blue-300 px-2 py-1 rounded border border-blue-500 hover:bg-blue-500 hover:text-white transition-all text-sm">
                        Sửa
                      </Link>
                      <button className="text-red-400 hover:text-red-300 px-2 py-1 rounded border border-red-500 hover:bg-red-500 hover:text-white transition-all text-sm">
                        Xóa
                      </button>
                      <Link to={`/admin/cinemas/${cinema.id}/rooms`} className="text-green-400 hover:text-green-300 px-2 py-1 rounded border border-green-500 hover:bg-green-500 hover:text-white transition-all text-sm">
                        Xem phòng
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
          >
            ← Trước
          </button>
          {Array.from({ length: totalPages }, (_, i) => i).map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded ${currentPage === page ? 'bg-red-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
            >
              {page + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
          >
            Sau →
          </button>
        </div>
      )}
    </div>
  );
}