import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getGenres, deleteGenre, updateGenre } from "../../../service/GenreService";
import GenreModal from "../../../component/GenreModal";

export default function GenreList() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [showGenreModal, setShowGenreModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [savingId, setSavingId] = useState(null);

  const fetchGenres = async () => {
    setLoading(true);
    try {
      const data = await getGenres();
      setGenres(data);
    } catch (err) {
      setError("Lỗi khi tải danh sách thể loại");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleGenreSuccess = (newGenre) => {
    if (!newGenre?.id) {
      fetchGenres();
      return;
    }
    setGenres(prev => [...prev, newGenre]);
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  const handleStartEdit = (genre) => {
    setEditingId(genre.id);
    setEditingName(genre.name || "");
    setError("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
    setError("");
  };

  const handleSaveEdit = async (genre) => {
    const trimmedName = editingName.trim();
    if (!trimmedName) {
      setError("Tên thể loại không được để trống");
      return;
    }

    setSavingId(genre.id);
    setError("");
    try {
      const updatedGenre = await updateGenre({ id: genre.id, name: trimmedName });
      setGenres(prev => prev.map(item => item.id === genre.id ? { ...item, ...updatedGenre } : item));
      setEditingId(null);
      setEditingName("");
    } catch (err) {
      setError(err.message || "Lỗi khi sửa thể loại");
    } finally {
      setSavingId(null);
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa thể loại này?")) return;

    setDeleteId(id);
    try {
      await deleteGenre(id);
      setGenres(prev => prev.filter(g => g.id !== id));
      setError("");
    } catch (err) {
      setError(err||"Lỗi khi xóa thể loại");
      console.error(err);
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) return <div className="text-white p-4">Đang tải dữ liệu...</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Quản lý Thể loại</h2>
        <button
          onClick={() => setShowGenreModal(true)}
          className="group flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-red-600/30 hover:shadow-red-600/50 transition-all duration-300 hover:-translate-y-0.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Thêm thể loại
        </button>
      </div>

      {error && error.length>0 && (
        <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full table-fixed text-left text-gray-300">
          <thead className="bg-gray-700 text-gray-200 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 w-20">ID</th>
              <th className="px-4 py-3 w-[320px] min-w-[260px]">Tên thể loại</th>
              <th className="px-4 py-3 w-56 min-w-[220px]">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {genres.map((genre) => {
              const isEditingThisRow = editingId === genre.id;

              return (
                <tr key={genre.id} className="hover:bg-gray-700 transition-colors">
                  <td className="px-4 py-3">#{genre.id}</td>
                  <td className="px-4 py-3 font-medium text-white align-middle">
                    <div className="min-h-[44px] flex items-center w-full">
                      {isEditingThisRow ? (
                        <input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="bg-gray-900 border border-gray-600 text-white px-2 py-1 rounded focus:outline-none focus:border-blue-500 w-full max-w-[280px] min-h-[38px]"
                        />
                      ) : (
                        <span className="truncate">{genre.name}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 w-56 min-w-[220px]">
                    <div className="flex flex-wrap items-center gap-2 min-h-[40px]">
                      {isEditingThisRow ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(genre)}
                            disabled={savingId === genre.id}
                            className="text-green-400 hover:bg-green-500/20 px-3 py-1 rounded border border-green-500 transition-all text-sm font-medium disabled:opacity-50"
                          >
                            {savingId === genre.id ? "Đang lưu..." : "Lưu"}
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            disabled={savingId === genre.id}
                            className="text-gray-400 hover:bg-gray-500/20 px-3 py-1 rounded border border-gray-500 transition-all text-sm disabled:opacity-50"
                          >
                            Hủy
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleStartEdit(genre)}
                            className="text-green-400 hover:bg-green-500/20 px-3 py-1 rounded border border-green-500 transition-all text-sm disabled:opacity-50"
                          >
                            Chi tiết
                          </button>
                          <button
                            onClick={() => handleStartEdit(genre)}
                            className="text-blue-400 hover:bg-blue-500/20 px-3 py-1 rounded border border-blue-500 transition-all text-sm disabled:opacity-50"
                          >
                            Sửa
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(genre.id)}
                        disabled={deleteId === genre.id || savingId === genre.id}
                        className="text-red-400 hover:text-red-300 px-3 py-1 rounded border border-red-500 hover:bg-red-500 hover:text-white transition-all text-sm disabled:opacity-50"
                      >
                        {deleteId === genre.id ? "Đang xóa..." : "Xóa"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {genres.length === 0 && (
              <tr>
                <td colSpan="3" className="px-4 py-8 text-center text-gray-500">
                  Chưa có thể loại nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <GenreModal
        isOpen={showGenreModal}
        onClose={() => setShowGenreModal(false)}
        onSuccess={handleGenreSuccess}
      />
    </div>
  );
}