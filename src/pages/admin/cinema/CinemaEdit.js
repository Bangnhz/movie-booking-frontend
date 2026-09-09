import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCinemaById } from "../../../service/CinemaService";
import { getCities } from "../../../service/CityService";

export default function CinemaEdit() {
    const { id } = useParams();
    const isAddMode = id === "add"
    const [error,setError] = useState("");
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        address: "",
        email: "",
        cityId: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [cities, setCities] = useState([])
    useEffect(() => {
        const fetchCinema = async () => {
            try{
                if(!isAddMode){
                    const cinema = await getCinemaById(id);
                    console.log(cinema);
                    
                    setFormData({
                        id: id,
                        name: cinema.name || "",
                        address: cinema.address || "",
                        email: cinema.email || "",
                        cityId: cinema.city || ""
                    });
                }
            }
            catch(er){
                setError(er);
            }
            finally{
                setSaving(saving); 
            }
        }
        const fetchCities = async () => {
            try{
                const cities = await getCities();
                setCities(cities);
                console.log(cities);
                
            }
            catch(er){
                setError(er);
            }
        }
        fetchCinema();
        fetchCities();
        
    },[]);
    const handleSubmit = () => {
        const payload = {
            ...formData
        }
        
    }
    const handleChange = (e) => {
        console.log(e);
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }
    return (
        <>
            <div className="p-4 max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">
                        {isAddMode ? "Thêm Rạp mới" : "Sửa thông tin rạp"}
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
                        <label className="block text-gray-300 mb-2">Địa chỉ</label>
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
                        <label className="block text-gray-300 mb-2">Thành phố</label>
                        <select
                            name="cityId"
                            value={formData.cityId}
                            onChange={handleChange}
                            required
                            className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-red-500"
                        >
                            <option value="">Chọn thành phố</option>
                                {cities.map(city =>(
                                    <option key={city.id} value={city.name}>{city.name}</option>
                                ))}
                           
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-2">Email</label>
                        <input
                            type="text"
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
                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                            {saving ? "Đang lưu" : isAddMode ? "Thêm rạp" : "Lưu"}
                        </button>
                    </div>
                </form>

            </div>
        </>
    )
}
