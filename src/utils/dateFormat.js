export const dateFormat = (dateString) => {
    try {
        const dateObj = new Date(dateString);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Add leading zero for single-digit months
        const day = String(dateObj.getDate()).padStart(2, '0'); // Add leading zero for single-digit days
        return `${year}-${month}-${day}`;
    } catch (error) {
        console.error("Invalid date format. Please provide a valid string in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ).");
        return null; // Or display an error message to the user
    }
};