import { useState } from "react";
import { createGenre } from "../../service/GenreService";

export default function GenreModal({ isOpen, onClose, onSuccess }) {
  const [genreName, setGenreName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!genreName.trim()) return;
    setSaving(true);
    setError("");
    try {
      const newGenre = await createGenre({ name: genreName.trim() });
      onSuccess(newGenre);
      setGenreName("");
      onClose();
    } catch (err) {
      setError("Lỗi khi thêm thể loại");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setGenreName("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Thêm thể loại mới</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Tên thể loại</label>
            <input
              type="text"
              value={genreName}
              onChange={(e) => setGenreName(e.target.value)}
              placeholder="Nhập tên thể loại..."
              className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-red-500"
              autoFocus
            />
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving || !genreName.trim()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {saving ? "Đang lưu..." : "Thêm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}