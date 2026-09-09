const API_DOMAN = "http://localhost:8080/";
export const getCities = async () => {
    const response = await fetch(`http://localhost:8080/api/cities`)
    const result = await response.json();
    return result;
}