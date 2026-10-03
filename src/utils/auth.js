/**
 * Helper chuẩn hóa và kiểm tra quyền của User
 */

export const parseRoles = (rolesRaw) => {
  if (!rolesRaw) return [];
  if (Array.isArray(rolesRaw)) return rolesRaw;
  if (typeof rolesRaw === "object") return [rolesRaw];
  if (typeof rolesRaw === "string") {
    try {
      const parsed = JSON.parse(rolesRaw);
      if (Array.isArray(parsed)) return parsed;
      if (typeof parsed === "object" && parsed !== null) return [parsed];
      if (typeof parsed === "string") return [parsed];
    } catch {
      // Trường hợp lưu thẳng chuỗi dạng "ADMIN" hoặc "ROLE_ADMIN"
      return [rolesRaw];
    }
  }
  return [];
};

export const checkIsAdmin = (rolesRaw) => {
  if (!rolesRaw) return false;
  try {
    const roles = parseRoles(rolesRaw);
    return roles.some((r) => {
      if (!r) return false;
      if (typeof r === "string") {
        return r.toUpperCase().includes("ADMIN");
      }
      const roleName = r.name || r.roleName || r.authority || "";
      return String(roleName).toUpperCase().includes("ADMIN");
    });
  } catch (e) {
    console.error("Lỗi khi kiểm tra quyền Admin:", e);
    return false;
  }
};
