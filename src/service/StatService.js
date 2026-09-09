export const getStat = async (filter) => {
    const params = new URLSearchParams(filter).toString();
    const response = await fetch(`http://localhost:8080/api/statistics?${params}`);
    const result = await response.json();
    return result;  
    
}