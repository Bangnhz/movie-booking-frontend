import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addMovie, getMovieById, updateMovie } from "../../../service/MovieService";
import { getGenres } from "../../../service/GenreService";
import { getAgeRatings } from "../../../service/AgeRatingService";
import GenreModal from "../../../component/GenreModal";

export default function MovieEdit() {
  const { id } = useParams();
  const isAddMode = id === "add";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [generes, setGenres] = useState([]);
  const [ageRatings, setAgeRatings] = useState([]);
  const [showGenreModal, setShowGenreModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    posterUrl: "",
    ageRating: "",
    releaseDate: "",
    duration: "",
    genreIds: []
  });
  
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const [genresData, ageRatingsData] = await Promise.all([
          getGenres(),
          getAgeRatings()
        ]);
        
        setGenres(genresData);
        setAgeRatings(ageRatingsData);

        if (!isAddMode) {
          const movie = await getMovieById(id);
          setFormData({
            title: movie.title || "",
            description: movie.description || "",
            posterUrl: movie.posterUrl || "",
            ageRating: movie.ageRating || "",
            releaseDate: movie.releaseDate || "",
            duration: movie.duration || "",
            genreIds: (movie.genres || []).map(g => g.id || g)
          });
        }
      } catch (err) {
        setError("Lỗi khi tải thông tin phim");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id, isAddMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenreToggle = (genreid) => {
    setFormData(prev => {
      const isExist = prev.genreIds.some(g => g === genreid);
      const newGenres = isExist
        ? prev.genreIds.filter(g => g !== genreid)
        : [...prev.genreIds, genreid];
      return { ...prev, genreIds: newGenres };
    });
  };

  const handleGenreSuccess = (newGenre) => {
    setGenres(prev => [...prev, newGenre]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        ...formData,
        duration: parseInt(formData.duration)
      };
      isAddMode ? await addMovie(payload) : await updateMovie(id, payload);
      navigate("/admin/movies");
    } catch (err) {
      setError(isAddMode ? "Lỗi khi thêm phim" : "Lỗi khi cập nhật phim");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-white p-4">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">
          {isAddMode ? "Thêm phim mới" : "Sửa thông tin phim"}
        </h2>
        <button
          onClick={() => navigate("/admin/movies")}
          className="text-gray-400 hover:text-white"
        >
          ← Quay lại
        </button>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-6 space-y-6">
        <div>
          <label className="block text-gray-300 mb-2">Tên phim *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-red-500"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Mô tả</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-red-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">URL Poster</label>
          <input
            type="url"
            name="posterUrl"
            value={formData.posterUrl}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-red-500"
          />
          {formData.posterUrl && (
            <img 
              src={formData.posterUrl} 
              alt="Preview" 
              className="mt-2 w-32 h-44 object-cover rounded"
              onError={(e) => e.target.style.display = 'none'}
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-2">Độ tuổi</label>
            <select
              name="ageRating"
              value={formData.ageRating}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-red-500"
            >
              <option value="">Chọn độ tuổi</option>
              {ageRatings.map(age => (
                <option key={age.name} value={age.name}>{age.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Thời lượng (phút) *</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
              min="1"
              className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Ngày khởi chiếu</label>
          <input
            type="date"
            name="releaseDate"
            value={formData.releaseDate}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-red-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-gray-300">Thể loại</label>
            <button
              type="button"
              onClick={() => setShowGenreModal(true)}
              className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Thêm mới
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {generes.map(genre => (
              <button
                key={genre.id}
                type="button"
                onClick={() => handleGenreToggle(genre.id)}
                className={`px-3 py-1 rounded-full text-sm transition-all ${
                  formData.genreIds.includes(genre.id)
                    ? "bg-red-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate("/admin/movies")}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {saving ? "Đang lưu..." : isAddMode ? "Thêm phim" : "Lưu thay đổi"}
          </button>
        </div>
      </form>
      <GenreModal 
          isOpen={showGenreModal} 
          onClose={() => setShowGenreModal(false)}
          onSuccess={handleGenreSuccess}
        />
    </div>
  );
}