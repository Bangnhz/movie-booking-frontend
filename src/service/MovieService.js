const API_DOMAN = "http://localhost:8080/";
export const getMovies = async () => {
    const response = await fetch(`http://localhost:8080/api/movies`)
    const result = await response.json();
    return result;
}
export const getMovieById = async (id) => {
    const response = await fetch(`http://localhost:8080/api/movies/${id}`)
    const result = await response.json();
    return result;
}
export const getMoviesPaged = async (page = 0, size = 10) => {
    const response = await fetch(`http://localhost:8080/api/movies/list?page=${page}&size=${size}`);
    const result = await response.json();
    return result;
}

export const updateMovie = async (id, movieData) => {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`http://localhost:8080/api/movies/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(movieData)
    });
    if (!response.ok) {
        throw new Error("Failed to update movie");
    }
    return response.json();
}
export const addMovie = async (movieData) => {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`http://localhost:8080/api/movies`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(movieData)
    });
    if (!response.ok) {
        throw new Error("Failed to add movie");
    }
    return response.json();
}