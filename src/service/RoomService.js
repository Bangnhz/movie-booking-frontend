export const getRoomsByCinemaId = async (cinemaId) => {
    const response = await fetch(`http://localhost:8080/api/rooms/cinemas/${cinemaId}`);
    if (!response.ok) {
        throw new Error("Failed to fetch rooms");
    }
    const result = await response.json();
    return result;
};

export const createRoom = async (cinemaId, roomData) => {
    const token = localStorage.getItem("accessToken");
    const response = await fetch("http://localhost:8080/api/rooms", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...roomData, cinemaId }),
    });

    if (!response.ok) {
        throw new Error("Failed to create room");
    }

    return response.json();
};

export const updateRoom = async (roomId, roomData) => {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`http://localhost:8080/api/rooms/${roomId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(roomData),
    });

    if (!response.ok) {
        throw new Error("Failed to update room");
    }

    return response.json();
};

export const deleteRoom = async (roomId) => {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`http://localhost:8080/api/rooms/${roomId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to delete room");
    }

    return response.json();
};