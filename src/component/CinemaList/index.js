import { useEffect, useState } from "react";
import {
    Dropdown,
    DropdownButton,
    Badge,
    ButtonGroup,
    Container,
    ListGroup,
    Card,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getCinemasByCity } from "../../service/CinemaService";

export default function CinemaList() {
    const [cities, setCities] = useState([]);
    const [cinemasByCity, setCinemasByCity] = useState({});
    const [cinemaSchedule, setCinemaSchedule] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:8080/api/cities`)
            .then((res) => res.json())
            .then((data) => setCities(data))
            .catch((err) => console.error("Lỗi tải thành phố:", err));
    }, []);

    async function loadCinemasByCity(cityId) {
        try {
            const res = await getCinemasByCity(cityId);
            setCinemasByCity((prev) => ({ ...prev, [cityId]: res }));

        }
        catch (err) {
            console.error(err);
        }
    }

    function loadShowtimesByCinema(cinemaId) {
        fetch(`http://localhost:8080/api/cinemas/${cinemaId}/schedule`)
            .then((res) => res.json())
            .then((data) => setCinemaSchedule(data))
            .catch((err) => console.error("Lỗi:", err));
    }

    function formatTime(time) {
        return new Date(time).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    }

    return (
        <div className="bg-[#0f1115] min-h-screen py-10 text-gray-100">
            <Container>
                {/* Header với Gradient Text */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-8 w-1.5 bg-gradient-to-b from-red-600 to-red-900 rounded-full"></div>
                    <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        Hệ thống rạp
                    </h2>
                </div>

                {/* Cities Section - Tăng tương phản bằng nền Glassmorphism */}
                <div className="flex flex-wrap gap-3 mb-12 p-6 bg-[#1a1d23] rounded-3xl border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    {cities.map((city) => (
                        <DropdownButton
                            as={ButtonGroup}
                            key={city.id}
                            title={<span className="font-semibold text-white tracking-wide">{city.name}</span>}
                            onToggle={(isOpen) => isOpen && loadCinemasByCity(city.id)}
                            variant="none"
                            className="bg-[#2a2e37] hover:bg-red-600 text-white rounded-xl transition-all duration-300 border border-white/5 shadow-sm"
                        >
                            {!cinemasByCity[city.id] ? (
                                <Dropdown.Item disabled className="text-gray-500">
                                    <span className="spinner-border spinner-border-sm me-2"></span> Đang tải...
                                </Dropdown.Item>
                            ) : (
                                cinemasByCity[city.id].map((cinema) => (
                                    <Dropdown.Item
                                        key={cinema.id}
                                        onClick={() => loadShowtimesByCinema(cinema.id)}
                                        className="hover:!bg-red-600 hover:!text-white py-2 px-4 transition-colors"
                                    >
                                        {cinema.name}
                                    </Dropdown.Item>
                                ))
                            )}
                        </DropdownButton>
                    ))}
                </div>

                {/* Schedule Section */}
                {cinemaSchedule && (
                    <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
                        <div className="mb-6 flex justify-between items-end border-b border-white/10 pb-4">
                            <h4 className="text-2xl text-red-500 font-bold flex items-center gap-2">
                                <i className="bi bi-calendar3"></i> Lịch chiếu rạp
                            </h4>
                            <Badge className="bg-red-600/10 text-red-500 border border-red-500/20 px-3 py-1.5 rounded-lg">
                                Suất chiếu hôm nay
                            </Badge>
                        </div>

                        <div className="space-y-6">
                            {cinemaSchedule.movies.map((movie) => (
                                <div
                                    key={movie.id}
                                    className="group relative bg-[#16191e] border border-white/5 rounded-3xl overflow-hidden hover:border-red-500/30 transition-all duration-500 shadow-xl"
                                >
                                    <div className="flex flex-col md:flex-row gap-0">
                                        {/* Poster với hiệu ứng Zoom & Overlay */}
                                        <div className="relative w-full md:w-48 shrink-0 overflow-hidden">
                                            <img
                                                src={movie.posterUrl}
                                                alt={movie.title}
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#16191e] via-transparent to-transparent md:bg-gradient-to-r"></div>
                                        </div>

                                        {/* Movie Details */}
                                        <div className="p-8 flex-1">
                                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                                <span className="bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded shadow-lg">2D</span>
                                                <h5 className="text-2xl font-black text-white group-hover:text-red-500 transition-colors uppercase italic tracking-tighter">
                                                    {movie.title}
                                                </h5>
                                            </div>

                                            <div className="text-gray-400 text-sm mb-6 flex items-center gap-4">
                                                <span className="flex items-center gap-1"><i className="bi bi-clock"></i> 120 phút</span>
                                                <span className="flex items-center gap-1 text-amber-500"><i className="bi bi-star-fill"></i> 9.8</span>
                                            </div>

                                            {/* Showtimes Grid */}
                                            <div className="flex flex-wrap gap-4">
                                                {movie.showtimes.map((showtime) => (
                                                    <button
                                                        key={showtime.id}
                                                        onClick={() => navigate(`/bookings/${showtime.id}`)}
                                                        className="
    relative group/btn
    px-6 py-2.5 rounded-xl
    /* 1. Nền tối sâu và hiệu ứng kính */
    bg-gradient-to-b from-[#2e323a] to-[#1a1d23]
    /* 2. Viền tinh tế (tăng độ nổi khối) */
    border border-white/10 shadow-lg
    /* 3. Hiệu ứng khi Hover */
    hover:border-red-500/50 
    hover:shadow-[0_0_25px_rgba(220,38,38,0.3)]
    transition-all duration-300
    overflow-hidden
    active:scale-95
  "
                                                    >
                                                        {/* Lớp màu đỏ chạy ngầm bên dưới khi hover */}
                                                        <div className="
    absolute inset-0 
    bg-gradient-to-tr from-red-600 to-red-800 
    opacity-0 group-hover/btn:opacity-100 
    transition-opacity duration-500
  "></div>

                                                        {/* Nội dung chữ - Chỉnh lại màu Amber sáng */}
                                                        <span className="
    relative z-10 
    font-mono text-xl font-black 
    text-amber-400 
    group-hover/btn:text-white 
    group-hover/btn:drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]
    transition-all duration-300 
    inline-block
  ">
                                                            {formatTime(showtime.startTime)}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Container>
        </div>
    );
}