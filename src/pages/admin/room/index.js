import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCinemaById } from "../../../service/CinemaService";
import {
  createRoom,
  deleteRoom,
  getRoomsByCinemaId,
  updateRoom,
} from "../../../service/RoomService";

const emptyForm = {
  name: "",
  description: "",
};

export default function RoomPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cinema, setCinema] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const loadData = async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [cinemaData, roomsData] = await Promise.all([
        getCinemaById(id),
        getRoomsByCinemaId(id),
      ]);

      setCinema(cinemaData || null);
      const normalizedRooms = Array.isArray(roomsData)
        ? roomsData
        : roomsData?.content || roomsData?.data || [];
      setRooms(normalizedRooms);
    } catch (err) {
      console.error("Error loading cinema rooms:", err);
      setError("Không thể tải danh sách phòng. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const openCreateModal = () => {
    setEditingRoom(null);
    setFormData(emptyForm);
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name || "",
      description: room.description || "",
    });
    setError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRoom(null);
    setFormData(emptyForm);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      setError("Tên phòng không được để trống.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (editingRoom) {
        await updateRoom(editingRoom.id, {
          ...formData,
          cinemaId: id,
        });
      } else {
        await createRoom(id, {
          ...formData,
          cinemaId: id,
        });
      }

      await loadData();
      closeModal();
    } catch (err) {
      console.error("Error saving room:", err);
      setError("Không thể lưu phòng. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (room) => {
    const confirmDelete = window.confirm(`Bạn có chắc muốn xóa phòng "${room.name}" không?`);
    if (!confirmDelete) {
      return;
    }

    try {
      await deleteRoom(room.id);
      await loadData();
    } catch (err) {
      console.error("Error deleting room:", err);
      setError("Không thể xóa phòng. Vui lòng thử lại.");
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Quản lý phòng chiếu</h2>
          <p className="text-gray-400 mt-1">
            {cinema ? `Rạp: ${cinema.name}` : "Đang tải thông tin rạp..."}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate("/admin/cinemas")}
            className="px-4 py-2 text-sm rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors"
          >
            ← Quay lại
          </button>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 text-sm rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors"
          >
            + Thêm phòng
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48 text-white">
          Đang tải danh sách phòng...
        </div>
      ) : rooms.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-8 text-center text-gray-400">
          Rạp này hiện chưa có phòng nào.
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-gray-300">
              <thead className="bg-gray-700 text-gray-200 uppercase text-sm">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Tên phòng</th>
                  <th className="px-4 py-3">Mô tả</th>
                  <th className="px-4 py-3">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {rooms.map((room) => (
                  <tr key={room.id} className="hover:bg-gray-700 transition-colors">
                    <td className="px-4 py-3">#{room.id}</td>
                    <td className="px-4 py-3 font-medium text-white">{room.name}</td>
                    <td className="px-4 py-3">{room.description || "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(room)}
                          className="text-blue-400 hover:text-blue-300 px-2 py-1 rounded border border-blue-500 hover:bg-blue-500 hover:text-white transition-all text-sm"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(room)}
                          className="text-red-400 hover:text-red-300 px-2 py-1 rounded border border-red-500 hover:bg-red-500 hover:text-white transition-all text-sm"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-xl bg-gray-800 border border-gray-700 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-700 px-6 py-4">
              <h3 className="text-lg font-semibold text-white">
                {editingRoom ? "Sửa phòng" : "Thêm phòng mới"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Tên phòng *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Mô tả</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-red-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors disabled:opacity-50"
                >
                  {saving ? "Đang lưu..." : editingRoom ? "Lưu thay đổi" : "Thêm phòng"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
