import { useEffect, useState } from "react";
import { deleteUser, searchUsers, updateUser } from "../../../service/UserService";
import { Link } from "react-router-dom";

export default function User() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [roleName, setRoleName] = useState("");
  const pageSize = 5;
  const roles = ["ADMIN", "USER", "STAFF"];
  const [editingId, setEditingId] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editingRole, setEditingRole] = useState(null);
  const fetchUsers = async (page = 0) => {
    setLoading(true);
    try {
      const response = await searchUsers({
        keyword,
        roleName,
        page,
        size: pageSize,
        sort: "id,asc"
      });

      setUsers(response.content || []);
      setTotalPages(response.totalPages || 0);
      setCurrentPage(page);
      setError("");
    } catch (e) {
      setError("Không thể tải danh sách người dùng");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(0);
  }, []);

  const handleSearch = () => {
    fetchUsers(0);
  };
  const handleCancelEdit = () => {
    setEditingRole(null);
    setEditingId(null);
    setError("");
  };

  const getRoleText = (rolesValue) => {
    if (!rolesValue) return "—";
    if (Array.isArray(rolesValue)) {
      return rolesValue.map((role) => typeof role === "string" ? role : role?.name || role?.roleName || "").filter(Boolean).join(", ") || "—";
    }
    if (typeof rolesValue === "string") return rolesValue;
    return rolesValue?.name || rolesValue?.roleName || "—";
  };

  const getRoleValue = (rolesValue) => {
    if (!rolesValue) return "";
    if (Array.isArray(rolesValue)) {
      const role = rolesValue.find((item) => item && (typeof item === "string" || item.name || item.roleName));
      if (!role) return "";
      return typeof role === "string" ? role : role.name || role.roleName || "";
    }
    if (typeof rolesValue === "string") return rolesValue;
    return rolesValue?.name || rolesValue?.roleName || "";
  };

  const handleStartEdit = (user) => {
    setEditingId(user.id);
    setEditingRole(getRoleValue(user.roles) || roles[0]);
    setError("");
  };

  const getDisplayValue = (value) => (value === null || value === undefined ? "—" : value);
  const handleDelete = async (userId) => {
    setDeletingId(userId);
    try {
      await deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
      setError("");
    } catch (err) {
      setError(err?.message || err || "Lỗi khi xóa người dùng");
    } finally {
      setDeletingId(null);
    }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-xl">Đang tải...</div>
      </div>
    );
  }
  const handleSaveEdit = async (user) => {
    setSavingId(user.id);
    try {
      const updatedUser = await updateUser({ ...user, role: editingRole });
      setUsers(prev => prev.map(item => item.id === user.id ? { ...item, ...updatedUser } : item));
      setEditingId(null);
      setEditingRole(null);
    } catch (err) {
      setError(err.message || "Lỗi khi sửa người dùng");
    } finally {
      setSavingId(null);
    }
  }
  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-white">Quản lý Người dùng</h2>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên/email/sdt..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-1 bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-red-500"
          />
          <select
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-red-500"
          >
            <option value="">Tất cả Role</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
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

      {error && <div className="text-red-400 mb-4">{error}</div>}

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        {users.length === 0 ? (
          <div className="text-center text-gray-400 py-8">Không tìm thấy người dùng</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-gray-300">
              <thead className="bg-gray-700 text-gray-200 uppercase text-sm">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Họ tên</th>
                  <th className="px-4 py-3">Tên đăng nhập</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Điện thoại</th>
                  <th className="px-4 py-3">Điểm</th>
                  <th className="px-4 py-3">Vai trò</th>
                  <th className="px-4 py-3">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {users.map((user) => {
                  const isEditingThisRow = editingId === user.id;
                  return (
                    <tr key={user.id} className="hover:bg-gray-700 transition-colors">
                      <td className="px-4 py-3">#{user.id}</td>
                      <td className="px-4 py-3 font-medium text-white">{getDisplayValue(user.fullname)}</td>
                      <td className="px-4 py-3">{getDisplayValue(user.username)}</td>
                      <td className="px-4 py-3">{getDisplayValue(user.email)}</td>
                      <td className="px-4 py-3">{getDisplayValue(user.phone)}</td>
                      <td className="px-4 py-3">{getDisplayValue(user.points)}</td>
                      <td className="px-4 py-3">
                        {isEditingThisRow ? (
                          <select
                            value={editingRole || ""}
                            onChange={(e) => setEditingRole(e.target.value)}
                            className="bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-red-500"
                          >
                            {roles.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                        ) : (
                          getRoleText(user.roles)
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center gap-2 min-h-[40px]">
                          {isEditingThisRow ? (
                            <>
                              <button
                                onClick={() => handleSaveEdit(user)}
                                disabled={savingId === user.id}
                                className="text-green-400 hover:bg-green-500/20 px-3 py-1 rounded border border-green-500 transition-all text-sm font-medium disabled:opacity-50"
                              >
                                {savingId === user.id ? "Đang lưu..." : "Lưu"}
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                disabled={savingId === user.id}
                                className="text-gray-400 hover:bg-gray-500/20 px-3 py-1 rounded border border-gray-500 transition-all text-sm disabled:opacity-50"
                              >
                                Hủy
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleStartEdit(user)}
                              className="text-blue-400 hover:bg-blue-500/20 px-3 py-1 rounded border border-blue-500 transition-all text-sm disabled:opacity-50"
                            >
                              Sửa
                            </button>
                          )}
                          <Link to={`/admin/users/${user.id}`} className="text-blue-400 hover:text-blue-300 px-2 py-1 rounded border border-blue-500 hover:bg-blue-500 hover:text-white transition-all text-sm">
                            Chi tiết
                          </Link>
                        </div>

                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-2">
          <button
            onClick={() => fetchUsers(currentPage - 1)}
            disabled={currentPage === 0}
            className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
          >
            ← Trước
          </button>
          {Array.from({ length: totalPages }, (_, i) => i).map((page) => (
            <button
              key={page}
              onClick={() => fetchUsers(page)}
              className={`px-3 py-1 rounded ${currentPage === page ? "bg-red-600 text-white" : "bg-gray-700 text-white hover:bg-gray-600"}`}
            >
              {page + 1}
            </button>
          ))}
          <button
            onClick={() => fetchUsers(currentPage + 1)}
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