export const getStat = async (filter) => {
    const token = localStorage.getItem("accessToken");
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const params = new URLSearchParams(filter).toString();
    const response = await fetch(`http://localhost:8080/api/statistics?${params}`, {
        headers
    });
    const result = await response.json();
    return result;  
}