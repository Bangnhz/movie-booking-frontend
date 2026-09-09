export const searchUsers = async({ keyword = "", roleName = "", page = 0, size = 5, sort = "id,asc" }) => {
    const params = new URLSearchParams({
        keyword:keyword,
        roleName:roleName,
        page:page,
        size:size,
        sort:sort
    }).toString();
     const response = await fetch(`http://localhost:8080/api/users?${params}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });

    const result = await response.json();
    return result;
}
export const deleteUser = async(id) => {
    const token = localStorage.getItem("accessToken");
     const response = await fetch(`http://localhost:8080/api/users/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Không thể xóa người dùng");
    }
}
export const updateUser = async(userData) => {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`http://localhost:8080/api/users`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(userData)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Không thể sửa người dùng");
    }
}
export const getBookingsByUser = async({userId,cinemaName,status,fromDate,toDate,page = 0, size = 5, sort = "id,asc"}) => {
    const params = new URLSearchParams({
        cinemaName: cinemaName,
        status: status,
        fromDate: fromDate,
        toDate: toDate,
        page:page,
        size:size,
        sort:sort
    }).toString();
    const response = await fetch(`http://localhost:8080/api/users/${userId}/bookings?${params}`);
    const result = await response.json();
    return result;
}

export const getCurrentUser = async () => {
    const token = localStorage.getItem("accessToken");
    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;

    // Try a /me endpoint first
    try {
        const resp = await fetch(`http://localhost:8080/api/users/me`, { headers });
        if (resp.ok) {
            const data = await resp.json();
            return data;
        }
    } catch (e) {
        // ignore and fallback
    }

    // Fallback: try to find by username stored in localStorage
    const username = localStorage.getItem("username");
    if (username) {
        try {
            const params = new URLSearchParams({ keyword: username, page: 0, size: 1 }).toString();
            const resp2 = await fetch(`http://localhost:8080/api/users?${params}`);
            if (resp2.ok) {
                const res = await resp2.json();
                const content = res?.content || (Array.isArray(res) ? res : []);
                return Array.isArray(content) ? content[0] || null : null;
            }
        } catch (e) {
            // ignore
        }
    }

    throw new Error("Không thể tải thông tin người dùng");
}