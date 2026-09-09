export const getGenres = async () => {
    const response = await fetch(`http://localhost:8080/api/genres`)
    const result = await response.json();
    return result;
}

export const createGenre = async (genreData) => {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`http://localhost:8080/api/genres`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(genreData)
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Không thể thêm thể loại");
    }
    return response.json();
}
export const updateGenre = async (genreData) => {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`http://localhost:8080/api/genres`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(genreData)
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Không thể sửa thể loại");
    }
    return response.json();
}
export const deleteGenre = async (id) => {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`http://localhost:8080/api/genres/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Không thể xóa thể loại");
    }
}