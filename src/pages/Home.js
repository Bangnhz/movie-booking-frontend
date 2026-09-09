import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [filter, setFilter] = useState("now-showing");
  const navigate = useNavigate();

  useEffect(() => {
    // Giả sử API lấy danh sách phim
    fetch("http://localhost:8080/api/movies")
      .then((res) => res.json())
      .then((data) => setMovies(data))
      .catch((err) => console.error("Lỗi tải phim:", err));
  }, []);

  return (
    <div className="bg-[#0f1115] min-h-screen text-white font-sans">
      
      {/* 1. HERO SECTION (BANNER) */}
      <div className="relative h-[70vh] w-full overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f1115] via-transparent to-transparent z-10"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#0f1115] to-transparent z-10"></div>
        
        <img 
          src="https://image.tmdb.org/t/p/original/mdfGrisvAVvbtvHgo9pZ9qNiTCo.jpg" // Thay bằng ảnh banner phim hot nhất
          className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000"
          alt="Hero Banner"
        />

        <Container className="relative z-20 h-full flex flex-col justify-center">
          <Badge bg="danger" className="w-fit mb-4 px-3 py-2 text-sm uppercase tracking-widest animate-bounce">
            Hot Trend
          </Badge>
          <h1 className="text-6xl font-black italic tracking-tighter uppercase mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
            Deadpool & Wolverine
          </h1>
          <p className="max-w-xl text-gray-300 text-lg mb-6 line-clamp-3">
            Cặp đôi hoàn cảnh của vũ trụ Marvel tái xuất trong một hành trình điên rồ nhất từ trước đến nay. 
            Đừng bỏ lỡ những suất chiếu sớm đặc biệt tại hệ thống rạp của chúng tôi.
          </p>
          <div className="flex gap-4">
            <Button 
              onClick={() => navigate('/cinemas')}
              className="bg-red-600 hover:bg-red-700 border-none px-8 py-3 rounded-xl font-bold transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(220,38,38,0.5)]"
            >
              ĐẶT VÉ NGAY
            </Button>
            <Button className="bg-white/10 hover:bg-white/20 border border-white/20 px-8 py-3 rounded-xl font-bold backdrop-blur-md transition-all">
              XEM TRAILER
            </Button>
          </div>
        </Container>
      </div>

      <Container className="py-16">
        {/* 2. FILTER TABS */}
        <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-6">
          <div className="flex gap-8">
            {["now-showing", "coming-soon"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`text-2xl font-black uppercase tracking-tighter transition-all relative ${
                  filter === type ? "text-red-600" : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {type === "now-showing" ? "Phim đang chiếu" : "Phim sắp chiếu"}
                {filter === type && (
                  <span className="absolute -bottom-[26px] left-0 w-full h-1 bg-red-600 rounded-full shadow-[0_0_10px_#dc2626]"></span>
                )}
              </button>
            ))}
          </div>
          <button className="text-red-500 font-bold hover:underline">Xem tất cả</button>
        </div>

        {/* 3. MOVIE GRID */}
        <Row className="g-6">
          {movies.map((movie) => (
            <Col key={movie.id} xs={6} md={4} lg={3}>
              <div 
                className="group relative bg-[#16191e] rounded-2xl overflow-hidden border border-white/5 transition-all duration-500 hover:border-red-600/50 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                onClick={() => navigate(`/movies/${movie.id}`)}
              >
                {/* Poster */}
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img 
                    src={movie.posterUrl} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    alt={movie.title}
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-red-600 shadow-lg">{movie.ageRating}</Badge>
                  </div>
                  {/* Overlay khi hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                     <Button variant="danger" className="rounded-full font-bold px-4 py-2 scale-75 group-hover:scale-100 transition-transform">
                        ĐẶT VÉ
                     </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h6 className="font-bold text-lg truncate group-hover:text-red-500 transition-colors uppercase italic tracking-tighter">
                    {movie.title}
                  </h6>
                  <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <i className="bi bi-clock"></i> 120'
                    </span>
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <i className="bi bi-star-fill"></i> 9.5
                    </span>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        {/* 4. PARTNERS (CINEMAS) */}
        <div className="mt-24 text-center">
          <h4 className="text-gray-500 uppercase tracking-[0.5em] text-sm mb-10">Đối tác rạp phim</h4>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
            {/* Thay bằng logo thật của các rạp */}
            <div className="text-3xl font-black text-white">CGV</div>
            <div className="text-3xl font-black text-white">LOTTE</div>
            <div className="text-3xl font-black text-white">BHD STAR</div>
            <div className="text-3xl font-black text-white">GALAXY</div>
          </div>
        </div>
      </Container>

    </div>
  );
}