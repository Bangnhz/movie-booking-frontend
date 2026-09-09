import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { getCities } from "../../../service/CityService";
import { getMovieById } from "../../../service/MovieService";
import { getCinemasByCity } from "../../../service/CinemaService";
import { getScheduleByCinema } from "../../../service/ScheduleService";

export default function MovieDetail() {
  const { movieId } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [cities, setCities] = useState([]);
  const [cinemasByCity, setCinemasByCity] = useState({});
  const [cinemaSchedule, setCinemaSchedule] = useState(null);

  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [show, setShow] = useState(false);

  // load movie
  useEffect(() => {
    const fetchDataMovie = async () => {
      try {
        const response = await getMovieById(movieId);
        setMovie(response);
      } catch (err) {
        console.error(err);
      }
    }
    fetchDataMovie();
  }, [movieId]);

  // load cities khi mở modal
  const openBooking = async () => {
    const response = await getCities();
    setCities(response);
    setShow(true);
  };

  const loadCinemasByCity = async(cityId) => {
    setSelectedCity(cityId);
    setSelectedCinema(null);
    setCinemaSchedule(null);

    if (cinemasByCity[cityId]) return;
    try {
      const res = await getCinemasByCity(cityId);
      setCinemasByCity((prev) => ({ ...prev, [cityId]: res }));

    }
    catch (err) {
      console.error(err);
    }
  };

  const loadShowtimesByCinema = async(cinemaId) => {
    setSelectedCinema(cinemaId);
    try {
      const res = await getScheduleByCinema(cinemaId);
      setCinemaSchedule(res);
    }
    catch (err) {
      console.error(err);
    }
  };

  const formatTime = (time) =>
    new Date(time).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  if (!movie) return <div className="text-white p-10">Loading...</div>;

  return (
    <div className="bg-gray-900 min-h-screen text-white">

      {/* Banner */}
      <div
        className="h-[400px] bg-cover bg-center relative"
        style={{ backgroundImage: `url(${movie.posterUrl})` }}
      >
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Info */}
      <div className="max-w-6xl mx-auto px-6 -mt-40 flex gap-8 relative z-10">
        <img
          src={movie.posterUrl}
          className="w-[250px] rounded-xl shadow-2xl"
        />

        <div>
          <h1 className="text-4xl font-bold">{movie.title}</h1>

          <div className="text-gray-300 mt-2">
            {movie.ageRating} • {movie.duration} phút •{" "}
            {new Date(movie.releaseDate).toLocaleDateString("vi-VN")}
          </div>

          <p className="mt-4 text-gray-300 max-w-xl">
            {movie.description}
          </p>

          <button
            onClick={openBooking}
            className="mt-6 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition"
          >
            🎟 Đặt vé
          </button>
        </div>
      </div>

      {/* MODAL */}
      <Modal show={show} centered
        size="xl"
        scrollable
        onHide={() => setShow(false)}
        dialogClassName="w-[90%] max-w-none mx-auto">
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body className="bg-gray-900 text-white p-6">

          <div className="grid grid-cols-3 gap-6 h-full">

            {/* CITY */}
            <div className="bg-gray-800 rounded-xl p-4 overflow-auto">
              <h3 className="font-bold mb-3 text-red-400">Thành phố</h3>

              {cities.map(city => (
                <div
                  key={city.id}
                  onClick={() => loadCinemasByCity(city.id)}
                  className={`p-3 rounded-lg cursor-pointer mb-2 transition
                  ${selectedCity === city.id
                      ? "bg-red-600"
                      : "bg-gray-700 hover:bg-gray-600"
                    }`}
                >
                  {city.name}
                </div>
              ))}
            </div>

            {/* CINEMA */}
            <div className="bg-gray-800 rounded-xl p-4 overflow-auto">
              <h3 className="font-bold mb-3 text-yellow-400">Rạp</h3>

              {!selectedCity && <p>Chọn thành phố</p>}

              {cinemasByCity[selectedCity]?.map(cinema => (
                <div
                  key={cinema.id}
                  onClick={() => loadShowtimesByCinema(cinema.id)}
                  className={`p-3 rounded-lg cursor-pointer mb-2 transition
                  ${selectedCinema === cinema.id
                      ? "bg-yellow-500 text-black"
                      : "bg-gray-700 hover:bg-gray-600"
                    }`}
                >
                  {cinema.name}
                </div>
              ))}
            </div>

            {/* SHOWTIME */}
            <div className="bg-gray-800 rounded-xl p-4 overflow-auto">
              <h3 className="font-bold mb-3 text-green-400">Suất chiếu</h3>

              {!cinemaSchedule && <p>Chọn rạp</p>}

              {cinemaSchedule?.movies?.map(movie => (
                <div key={movie.id} className="mb-4">
                  <p className="font-semibold">{movie.title}</p>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {movie.showtimes.map(showtime => (
                      <span
                        key={showtime.id}
                        onClick={() =>
                          navigate(`/bookings/${showtime.id}`)
                        }
                        className="bg-green-500 px-3 py-1 rounded-lg cursor-pointer hover:bg-green-600 transition"
                      >
                        {formatTime(showtime.startTime)}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </Modal.Body>

      </Modal>
    </div>
  );
}