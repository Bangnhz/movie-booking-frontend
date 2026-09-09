export const getAgeRatings = async () => {
    const response = await fetch(`http://localhost:8080/api/age-ratings`);
    const result = await response.json();
    return result;
}