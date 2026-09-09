import { Badge, Container, Spinner } from 'react-bootstrap';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function MovieList() {
    const [tab, setTab] = useState("now-showing");
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const ageRatingColors = {
        "P":   { color: "bg-green-500", text: "P" },
        "K":   { color: "bg-blue-500",  text: "K" },
        "T13": { color: "bg-yellow-500", text: "T13" },
        "T16": { color: "bg-orange-500", text: "T16" },
        "T18": { color: "bg-red-600",    text: "T18" },
    };

    useEffect(() => {
        setIsLoading(true);
        let url = `http://localhost:8080/api/movies/${tab}`;
        fetch(url)
            .then(res => res.json())
            .then(data => setMovies(data))
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false));
    }, [tab]);

    return (
        <div className="bg-[#0f1115] min-h-screen py-10 text-white">
            <Container>
                {/* TABS STYLING */}
                <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-6">
                    <div className="flex gap-8">
                        {['now-showing', 'coming-soon'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setTab(type)}
                                className={`text-2xl font-black uppercase tracking-tighter transition-all relative ${
                                    tab === type ? 'text-red-600' : 'text-gray-500 hover:text-gray-300'
                                }`}
                            >
                                {type === 'now-showing' ? 'Phim đang chiếu' : 'Phim sắp chiếu'}
                                {tab === type && (
                                    <span className="absolute -bottom-[26px] left-0 w-full h-1 bg-red-600 rounded-full shadow-[0_0_10px_#dc2626]" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <Spinner animation="border" variant="danger" />
                        <p className="mt-4 text-gray-400">Đang tải phim, chờ xíu nhé...</p>
                    </div>
                ) : movies.length === 0 ? (
                    <div className="text-center py-20 bg-gray-800 rounded-3xl border border-dashed border-gray-600">
                        <p className="text-gray-400 text-xl">Hiện chưa có phim nào trong mục này.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {movies.map((movie) => (
                            <div 
                                key={movie.id}
                                onClick={() => navigate(`/movies/${movie.id}`)}
                                className="group cursor-pointer relative"
                            >
                                {/* CARD IMAGE WITH HOVER EFFECT */}
                                <div className="relative overflow-hidden rounded-2xl shadow-lg transition-all duration-500 group-hover:shadow-red-500/20 group-hover:shadow-2xl group-hover:-translate-y-2">
                                    <img 
                                        src={movie.posterUrl} 
                                        alt={movie.title}
                                        className="w-full h-[380px] object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    {/* Overlay on Hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                        <button className="bg-red-600 text-white font-bold py-2 rounded-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            CHI TIẾT & ĐẶT VÉ
                                        </button>
                                    </div>
                                    
                                    {/* Age Rating Badge - Top Right */}
                                    <div className={`absolute top-3 right-3 ${ageRatingColors[movie.ageRating]?.color || 'bg-gray-500'} text-white text-xs font-bold px-2 py-1 rounded shadow-md`}>
                                        {movie.ageRating}
                                    </div>
                                </div>

                                {/* MOVIE INFO */}
                                <div className="mt-4">
                                    <h5 className="text-lg font-bold truncate group-hover:text-red-500 transition-colors">
                                        {movie.title}
                                    </h5>
                                    <div className="flex items-center text-gray-400 text-sm mt-1 gap-2">
                                        <span>{movie.duration} phút</span>
                                        <span>•</span>
                                        <span>{new Date(movie.releaseDate).getFullYear()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Container>
        </div>
    );
}