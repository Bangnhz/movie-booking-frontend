import { useEffect, useState } from "react";
import { getCurrentUser } from "../service/UserService";

const getRoleText = (rolesValue) => {
  if (!rolesValue) return "—";
  if (Array.isArray(rolesValue)) {
    return rolesValue.map((role) => typeof role === "string" ? role : role?.name || role?.roleName || "").filter(Boolean).join(", ") || "—";
  }
  if (typeof rolesValue === "string") return rolesValue;
  return rolesValue?.name || rolesValue?.roleName || "—";
};

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUser = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getCurrentUser();
      setUser(data);
    } catch (e) {
      setError(e?.message || "Không thể tải thông tin người dùng");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) return <div className="p-4 text-white">Đang tải...</div>;

  if (error) return <div className="p-4 text-red-400">{error}</div>;

  if (!user) return <div className="p-4 text-gray-400">Không có thông tin người dùng.</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-white mb-4">Hồ sơ của tôi</h2>

      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
          <div>
            <p className="text-sm text-gray-400">ID</p>
            <p className="font-medium text-white">{user.id ?? "—"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-400">Tên đăng nhập</p>
            <p className="font-medium text-white">{user.username ?? "—"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-400">Họ tên</p>
            <p className="font-medium text-white">{user.fullname ?? "—"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-400">Email</p>
            <p className="font-medium text-white">{user.email ?? "—"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-400">Điện thoại</p>
            <p className="font-medium text-white">{user.phone ?? "—"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-400">Điểm</p>
            <p className="font-medium text-white">{user.points ?? "—"}</p>
          </div>

          <div className="md:col-span-2">
            <p className="text-sm text-gray-400">Vai trò</p>
            <p className="font-medium text-white">{getRoleText(user.roles)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
