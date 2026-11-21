import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMovies } from "../../../service/MovieService";
import { searchCinemas } from "../../../service/CinemaService";
import { getStat } from "../../../service/StatService";

export default function AdminDashboard() {
  const [filter, setFilter] = useState({
    type: "MONTH",
    month: new Date().getMonth() + 1,
    year: 2026,
    movieId: "",
    cinemaId: ""
  });

  const [movieSearchText, setMovieSearchText] = useState("");
  const [cinemaSearchText, setCinemaSearchText] = useState("");

  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  const updateFilter = (key, value) => {
    setFilter(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const [stats, setStats] = useState({
    totalMovies: 0,
    soldTickets: 0,
    averageEmptySeatRate: 0,
    revenue: 0
  });

  const [chartData, setChartData] = useState([]);

  const formatPercent = (val) => {
    if (val === undefined || val === null || isNaN(val)) return "0%";
    const n = Number(val) || 0;
    return `${n.toFixed(2)}%`;
  };

  const normalizeList = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    return data?.data ?? [];
  };

  // Hàm tạo khung dữ liệu trống động dựa theo bộ lọc để tránh xài data fake
  const generateEmptyChartStructure = (type, month, year) => {
    if (type === "YEAR") {
      // Trả về khung 12 tháng: T1, T2, ..., T12
      return Array.from({ length: 12 }, (_, i) => ({
        label: `Tháng ${i + 1}`,
        value: 0,
        key: String(i + 1) // Dùng để map dữ liệu backend
      }));
    } else {
      // Bộ lọc theo MONTH: Tự động tính số ngày trong tháng đó
      const daysInMonth = new Date(year, month, 0).getDate();
      // Nếu biểu đồ quá dày, bạn có thể chia theo tuần. Ở đây tạo theo ngày cho chi tiết:
      return Array.from({ length: daysInMonth }, (_, i) => ({
        label: `Ngày ${i + 1}`,
        value: 0,
        key: String(i + 1)
      }));
    }
  };

  // 1. Lấy danh sách Phim và Rạp
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const [movieResponse, cinemaResponse] = await Promise.all([
          getMovies(),
          searchCinemas({})
        ]);
        setMovies(normalizeList(movieResponse));
        setCinemas(normalizeList(cinemaResponse));
      } catch (error) {
        console.error("Failed to load filter options", error);
      }
    };
    loadFilterOptions();
  }, []);

  // 2. Lấy dữ liệu thống kê & xử lý chartData lý tưởng
  useEffect(() => {
    const loadStatistics = async () => {
      setIsLoadingStats(true);

      // Tạo khung dữ liệu trống (mặc định toàn bộ bằng 0)
      const defaultChart = generateEmptyChartStructure(filter.type, filter.month, filter.year);

      try {
        const cleanFilter = { ...filter };
        if (cleanFilter.type === "YEAR") {
          delete cleanFilter.month;
        }
        if (!cleanFilter.movieId) delete cleanFilter.movieId;
        if (!cleanFilter.cinemaId) delete cleanFilter.cinemaId;

        const result = await getStat(cleanFilter);

        setStats({
          totalMovies: result?.totalMovies ?? result?.movieCount ?? 0,
          soldTickets: result?.totalTickets ?? result?.ticketCount ?? result?.bookings ?? result?.soldTickets ?? 0,
          averageEmptySeatRate: result?.averageEmptySeatRate ?? result?.avgEmptySeatRate ?? result?.emptySeatRate ?? 0,
          revenue: result?.totalRevenue ?? result?.revenue ?? result?.totalAmount ?? 0,
        });

        const rawChartData = result?.chartData ?? result?.data ?? [];

        if (Array.isArray(rawChartData) && rawChartData.length > 0) {
          // Map đè dữ liệu thật từ API trả về vào khung mặc định
          const mergedChart = defaultChart.map(slot => {
            // Tìm xem Backend có trả về dữ liệu của ngày/tháng này không
            const match = rawChartData.find(item => {
              const itemTime = String(item.period ?? item.label ?? item.name ?? item.time ?? "").trim();
              return itemTime === slot.key || itemTime === `Ngày ${slot.key}` || itemTime === `Tháng ${slot.key}`;
            });
            return {
              label: slot.label,
              value: match ? Number(match.value ?? match.amount ?? match.total ?? match.tickets ?? 0) : 0,
              revenue: match ? Number(match.revenue ?? 0) : 0
            };
          });
          setChartData(mergedChart);
        } else {
          // Nếu API trả về mảng rỗng (Ví dụ: Chưa ai mua vé), hiện biểu đồ toàn cột 0
          setChartData(defaultChart);
        }
      } catch (error) {
        console.error("Failed to load statistics", error);
        setStats({ totalMovies: 0, soldTickets: 0, averageEmptySeatRate: 0, revenue: 0 });
        setChartData(defaultChart); // Lỗi thì hiện biểu đồ trống thay vì crash
      } finally {
        setIsLoadingStats(false);
      }
    };

    loadStatistics();
  }, [filter]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Tính thang chia trục tung (Y-axis) mượt mà, trực quan
  const rawMax = Math.max(...chartData.map(d => Number(d.value) || 0), 0);
  const calculateYAxis = (maxVal) => {
    if (maxVal <= 0) return { max: 10, ticks: [10, 8, 6, 4, 2, 0] };
    if (maxVal <= 4) return { max: 4, ticks: [4, 3, 2, 1, 0] };
    if (maxVal <= 5) return { max: 5, ticks: [5, 4, 3, 2, 1, 0] };
    if (maxVal <= 10) return { max: 10, ticks: [10, 8, 6, 4, 2, 0] };
    if (maxVal <= 20) return { max: 20, ticks: [20, 15, 10, 5, 0] };
    if (maxVal <= 50) return { max: 50, ticks: [50, 40, 30, 20, 10, 0] };
    if (maxVal <= 100) return { max: 100, ticks: [100, 75, 50, 25, 0] };
    const step = Math.ceil(maxVal / 5 / 10) * 10;
    const top = step * 5;
    return {
      max: top,
      ticks: [top, step * 4, step * 3, step * 2, step, 0]
    };
  };
  const { max: yAxisMax, ticks: yAxisTicks } = calculateYAxis(rawMax);

  return (
    <div className="p-6 bg-[#0f1115] min-h-screen text-gray-200">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">
            Dashboard <span className="text-red-500">Analytics</span>
          </h2>
          <p className="text-gray-500 text-sm mt-1">Tổng quan hệ thống rạp chiếu phim</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 bg-gray-800/60 backdrop-blur-sm p-2 rounded-xl border border-gray-700/50 min-h-[52px]">
          <div className="flex bg-gray-900 rounded-lg p-1">
            <button
              onClick={() => updateFilter("type", "MONTH")}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all duration-300 ${filter.type === "MONTH" ? "bg-red-600 text-white shadow-lg shadow-red-600/30" : "text-gray-400 hover:text-white"}`}
            >
              Theo tháng
            </button>
            <button
              onClick={() => updateFilter("type", "YEAR")}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all duration-300 ${filter.type === "YEAR" ? "bg-red-600 text-white shadow-lg shadow-red-600/30" : "text-gray-400 hover:text-white"}`}
            >
              Cả năm
            </button>
          </div>

          <div className="h-6 w-px bg-gray-700"></div>

          <div className="flex items-center gap-2 min-h-[42px]">
            <select
              value={filter.year}
              onChange={(e) => updateFilter("year", parseInt(e.target.value))}
              className="bg-gray-900 text-white border border-gray-700 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-red-500 transition-colors"
            >
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
            </select>

            <div className="w-[120px]">
              <select
                value={filter.month}
                onChange={(e) => updateFilter("month", parseInt(e.target.value))}
                className={`w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-red-500 transition-colors ${filter.type === "YEAR" ? "invisible" : "visible"}`}
                aria-hidden={filter.type === "YEAR"}
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Ô TÌM KIẾM PHIM */}
          <div className="relative min-w-[190px]">
            <input
              type="text"
              list="movie-options"
              value={movieSearchText}
              onChange={(e) => {
                const textValue = e.target.value;
                setMovieSearchText(textValue);

                if (!textValue.trim()) {
                  updateFilter("movieId", "");
                  return;
                }

                const matchedMovie = movies.find((movie) => {
                  const id = movie.id ?? movie.movieId;
                  const name = movie.title ?? movie.name ?? `Phim ${id}`;
                  return name.toLowerCase() === textValue.toLowerCase();
                });

                if (matchedMovie) {
                  updateFilter("movieId", String(matchedMovie.id ?? matchedMovie.movieId));
                } else {
                  updateFilter("movieId", "");
                }
              }}
              placeholder="Tìm phim..."
              className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-red-500 transition-colors"
            />
            <datalist id="movie-options">
              {movies.map((movie) => {
                const movieId = movie.id ?? movie.movieId;
                const movieName = movie.title ?? movie.name ?? `Phim ${movieId}`;
                return <option key={movieId} value={movieName} />;
              })}
            </datalist>
          </div>

          {/* Ô TÌM KIẾM RẠP */}
          <div className="relative min-w-[190px]">
            <input
              type="text"
              list="cinema-options"
              value={cinemaSearchText}
              onChange={(e) => {
                const textValue = e.target.value;
                setCinemaSearchText(textValue);

                if (!textValue.trim()) {
                  updateFilter("cinemaId", "");
                  return;
                }

                const matchedCinema = cinemas.find((cinema) => {
                  const id = cinema.id ?? cinema.cinemaId;
                  const name = cinema.name ?? cinema.cinemaName ?? `Rạp ${id}`;
                  return name.toLowerCase() === textValue.toLowerCase();
                });

                if (matchedCinema) {
                  updateFilter("cinemaId", String(matchedCinema.id ?? matchedCinema.cinemaId));
                } else {
                  updateFilter("cinemaId", "");
                }
              }}
              placeholder="Tìm rạp..."
              className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-red-500 transition-colors"
            />
            <datalist id="cinema-options">
              {cinemas.map((cinema) => {
                const cinemaId = cinema.id ?? cinema.cinemaId;
                const cinemaName = cinema.name ?? cinema.cinemaName ?? `Rạp ${cinemaId}`;
                return <option key={cinemaId} value={cinemaName} />;
              })}
            </datalist>
          </div>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Tổng phim"
          value={stats.totalMovies}
          subtitle="Đang chiếu"
          color="blue"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
          }
        />
        <StatCard
          title="Vé đã bán"
          value={stats.soldTickets?.toLocaleString?.() ?? String(stats.soldTickets ?? 0)}
          subtitle={filter.type === "MONTH" ? `Tháng ${filter.month}` : `Năm ${filter.year}`}
          color="purple"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
        <StatCard
          title="Tỉ lệ ghế trống TB"
          value={formatPercent(stats.averageEmptySeatRate)}
          subtitle="Trung bình"
          color="yellow"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          }
        />
        <StatCard
          title={filter.type === "MONTH" ? "Doanh thu" : "Doanh thu năm"}
          value={formatCurrency(stats.revenue)}
          subtitle={filter.type === "MONTH" ? `Tháng ${filter.month}` : "2026"}
          color="red"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CHART - Hỗ trợ trục tung Y-axis đánh số vé bán ra & thanh cuộn ngang */}
        <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h5 className="text-lg font-semibold text-white">
                {filter.type === "MONTH" ? `Doanh thu tháng ${filter.month}/${filter.year}` : `Doanh thu năm ${filter.year}`}
              </h5>
              <p className="text-gray-500 text-xs">{isLoadingStats ? "Đang tải dữ liệu..." : "Số lượng vé bán ra (vé)"}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="text-xs text-gray-400">Vé đã bán</span>
            </div>
          </div>

          <div className="flex gap-2">
            {/* CỘT BÊN TRÁI: TRỤC TUNG (Y-AXIS) ĐÁNH SỐ LƯỢNG VÉ */}
            <div className="h-64 flex flex-col justify-between items-end pr-2 text-[11px] text-gray-400 font-medium select-none min-w-[34px] pb-6">
              {yAxisTicks.map((tick, index) => (
                <span key={index} className="leading-none">{tick}</span>
              ))}
            </div>

            {/* VÙNG BIỂU ĐỒ VÀ ĐƯỜNG KẺ NGANG */}
            <div className="flex-1 overflow-x-auto pb-2 custom-scrollbar relative">
              {/* ĐƯỜNG LƯỚI NGANG (HORIZONTAL GRID LINES) */}
              <div className="absolute inset-0 pb-6 flex flex-col justify-between pointer-events-none z-0">
                {yAxisTicks.map((_, index) => (
                  <div key={index} className="w-full border-b border-gray-700/25" />
                ))}
              </div>

              {chartData.length > 0 && chartData.every(d => d.value === 0) && (
                <div className="absolute inset-0 pb-6 flex flex-col items-center justify-center bg-gray-900/60 rounded-xl pointer-events-none z-20">
                  <span className="text-gray-300 text-sm font-medium">Chưa có dữ liệu vé bán trong khoảng thời gian này</span>
                </div>
              )}

              <div className="h-64 flex items-end justify-between gap-3 min-w-[500px] relative z-10">
                {chartData.map((data, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center group min-w-[30px] h-full justify-end">
                    <div className="relative w-full flex justify-center items-end h-[calc(100%-24px)]">
                      {/* Đường rãnh cột mờ để biểu đồ không bị trống */}
                      <div className="absolute bottom-0 w-full h-full bg-gray-700/10 rounded-t-sm group-hover:bg-gray-700/20 transition-colors"></div>
                      <div
                        className={`w-full bg-gradient-to-t from-red-600 to-red-500 rounded-t-sm transition-all duration-500 hover:from-red-500 hover:to-red-400 hover:shadow-lg hover:shadow-red-500/20 z-10 ${data.value > 0 ? "min-h-[4px]" : "h-0"}`}
                        style={{ height: `${(data.value / yAxisMax) * 100}%` }}
                      ></div>
                      <span className="absolute -top-8 bg-gray-900 text-white text-[10px] font-medium px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 shadow-lg border border-gray-700 pointer-events-none">
                        {data.value} vé {data.revenue > 0 ? `(${data.revenue.toLocaleString()}₫)` : ""}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-500 mt-2 font-medium whitespace-nowrap h-4 leading-4">{data.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <h5 className="text-lg font-semibold text-white mb-5">Thao tác nhanh</h5>
          <div className="grid grid-cols-2 gap-3">
            <QuickLink to="/admin/movies/add" title="Thêm phim" color="blue" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>} />
            <QuickLink to="/admin/genres" title="Thể loại" color="purple" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>} />
            <QuickLink to="/admin/cinemas" title="Rạp chiếu" color="green" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>} />
            <QuickLink to="/admin/users" title="Người dùng" color="orange" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>} />
          </div>

          <div className="mt-6 p-4 bg-gray-900/50 rounded-xl border border-gray-700/30">
            <h6 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Ghi chú</h6>
            <p className="text-xs text-gray-500 leading-relaxed">
              Dữ liệu được cập nhật từ các giao dịch thanh toán thành công qua VNPay và tại quầy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, color, icon }) {
  const colors = {
    blue: "from-blue-600 to-cyan-500 blue-glow",
    purple: "from-purple-600 to-indigo-500 purple-glow",
    yellow: "from-amber-500 to-yellow-400 yellow-glow",
    red: "from-red-600 to-rose-500 red-glow"
  };
  return (
    <div className={`bg-gradient-to-br ${colors[color]} p-5 rounded-2xl shadow-lg hover:-translate-y-1 transition-all duration-300 hover:shadow-xl relative overflow-hidden group`}>
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-medium opacity-80 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-white">{value}</h3>
          <p className="text-xs text-white/60 mt-1">{subtitle}</p>
        </div>
        <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm">{icon}</div>
      </div>
    </div>
  );
}

function QuickLink({ to, title, icon, color }) {
  const styles = {
    blue: "border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-600 hover:border-blue-500/20",
    purple: "border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-600 hover:border-purple-500/20",
    green: "border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-600 hover:border-green-500/20",
    orange: "border-orange-500/30 bg-orange-500/10 text-orange-400 hover:bg-orange-600 hover:border-orange-500/20",
  };
  const iconBg = { blue: "bg-blue-500/20", purple: "bg-purple-500/20", green: "bg-green-500/20", orange: "bg-orange-500/20" };
  return (
    <Link to={to} className={`flex items-center gap-3 p-3.5 border rounded-xl font-medium text-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${styles[color]}`}>
      <span className={`p-2 rounded-lg ${iconBg[color]}`}>{icon}</span>
      <span>{title}</span>
      <svg className="w-4 h-4 ml-auto opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
    </Link>
  );
}