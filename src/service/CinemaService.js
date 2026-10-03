export const getCinemasByCity = async (cityId) => {
    const response = await fetch(`http://localhost:8080/api/cinemas/city/${cityId}`);
    const result = await response.json();
    return result;
}
export const getCinemaById = async (cinemaId) => {
    const response = await fetch(`http://localhost:8080/api/cinemas/${cinemaId}`);
    const result = await response.json();
    return result;
}
export const updateCinema = async (id, cinemaData) => {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`http://localhost:8080/api/cinemas/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(cinemaData)
    });
    if (!response.ok) {
        throw new Error("Failed to update cinema");
    }
    return response.json();
}
export const addCinema = async (cinemaData) => {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`http://localhost:8080/api/cinemas`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(cinemaData)
    });
    if (!response.ok) {
        throw new Error("Failed to add cinema");
    }
    return response.json();
}
export const searchCinemas = async ({ name = "", cityId = "", page = 0, size = 5, sort = "id,asc" } = {}) => {
    const queryObj = { page, size };
    if (name && String(name).trim()) queryObj.name = String(name).trim();
    if (cityId !== "" && cityId !== null && cityId !== undefined) queryObj.cityId = cityId;
    if (sort) queryObj.sort = sort;

    const params = new URLSearchParams(queryObj).toString();
    const response = await fetch(`http://localhost:8080/api/cinemas?${params}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });
    const result = await response.json();
    return result;
};