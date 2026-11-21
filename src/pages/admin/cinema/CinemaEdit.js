import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addCinema, getCinemaById, updateCinema } from "../../../service/CinemaService";
import { getCities } from "../../../service/CityService";

export default function CinemaEdit() {
    const { id } = useParams();
    const isAddMode = !id || id === "add";
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        email: "",
        cityId: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [cities, setCities] = useState([]);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const citiesData = await getCities();
                setCities(citiesData || []);
            } catch (er) {
                setError(er?.message || "Lỗi tải danh sách thành phố");
            }
        };

        const fetchCinema = async () => {
            try {
                if (!isAddMode) {
                    const cinema = await getCinemaById(id);
                    setFormData({
                        name: cinema.name || "",
                        address: cinema.address || "",
                        email: cinema.email || "",
                        cityId: cinema.city?.id || cinema.cityId || ""
                    });
                }
            } catch (er) {
                setError(er?.message || "Lỗi tải thông tin rạp");
            } finally {
                setLoading(false);
            }
        };

        fetchCities();
        fetchCinema();
    }, [id, isAddMode]);

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        setSaving(true);
        setError("");
        try {
            const payload = {
                name: formData.name.trim(),
                address: formData.address.trim(),
                email: formData.email.trim(),
                city: { id: Number(formData.cityId) },
                cityId: Number(formData.cityId)
            };

            if (isAddMode) {
                await addCinema(payload);
            } else {
                await updateCinema(id, payload);
            }
            navigate("/admin/cinemas");
        } catch (err) {
            setError(err?.message || "Có lỗi xảy ra khi lưu rạp");
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                    {isAddMode ? "Thêm Rạp mới" : "Sửa thông tin rạp"}
                </h2>

                <button
                    onClick={() => navigate("/admin/cinemas")}
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
                    <label className="block text-gray-300 mb-2">Tên rạp *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-red-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-300 mb-2">Địa chỉ *</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-red-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-300 mb-2">Thành phố *</label>
                    <select
                        name="cityId"
                        value={formData.cityId}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-red-500"
                    >
                        <option value="">Chọn thành phố</option>
                        {cities.map(city => (
                            <option key={city.id} value={city.id}>{city.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-300 mb-2">Email *</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-red-500"
                    />
                </div>
                <div className="flex justify-end gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/cinemas")}
                        className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                    >
                        Hủy
                    </button>
                    <button 
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                        {saving ? "Đang lưu..." : isAddMode ? "Thêm rạp" : "Lưu"}
                    </button>
                </div>
            </form>
        </div>
    );
}
