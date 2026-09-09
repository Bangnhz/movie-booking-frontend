export const getScheduleByCinema = async (cinemaId) => {
    const response = await fetch(`http://localhost:8080/api/cinemas/${cinemaId}/schedule`);
    const result = response.json();
    return result;
}