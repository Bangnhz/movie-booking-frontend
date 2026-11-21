import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyBookings, getCurrentUser, getBookingsByUser } from "../../../service/UserService";

const statuses = ["PENDING", "PAID", "CANCELLED"];

const formatDateTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === "") return "—";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(value));
};

const getStatusBadge = (status) => {
  switch (status) {
    case "PAID":
      return {
        text: "Đã thanh toán",
        className: "bg-green-600/20 text-green-400 border border-green-500/30",
      };
    case "PENDING":
      return {
        text: "Chờ thanh toán",
        className: "bg-yellow-600/20 text-yellow-400 border border-yellow-500/30",
      };
    case "CANCELLED":
      return {
        text: "Đã hủy",
        className: "bg-red-600/20 text-red-400 border border-red-500/30",
      };
    default:
      return {
        text: status || "—",
        className: "bg-gray-600/20 text-gray-300 border border-gray-500/30",
      };
  }
};

export default function MyTickets() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookings, setBookings] = useState([]);

  const [cinemaName, setCinemaName] = useState("");
  const [status, setStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 5;

  const fetchBookings = async (page = 0) => {
    setLoading(true);
    setError("");
    try {
      let response;
      try {
        response = await getMyBookings({
          cinemaName,
          status,
          fromDate,
          toDate,
          page,
          size: pageSize,
          sort: "id,desc",
        });
      } catch (err) {
        // Fallback: lấy userId từ user hiện tại
        const me = await getCurrentUser();
        response = await getBookingsByUser({
          userId: me.id,
          cinemaName,
          status,
          fromDate,
          toDate,
          page,
          size: pageSize,
          sort: "id,desc",
        });
      }

      const content = Array.isArray(response?.content)
        ? response.content
        : Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
        ? response.data
        : [];

      setBookings(content);
      setTotalPages(response?.totalPages || 0);
      setCurrentPage(page);
    } catch (e) {
      setError(e?.message || "Không thể tải danh sách vé");
      setBookings([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(0);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBookings(0);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <span>🎟️</span> Vé của tôi
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Quản lý vé đã đặt và lịch sử giao dịch của bạn
        </p>
      </div>

      {/* Bộ lọc */}
      <form onSubmit={handleSearch} className="bg-gray-800/80 backdrop-blur border border-gray-700/60 rounded-xl p-4 mb-6 shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-gray-300 text-xs font-semibold mb-1 uppercase tracking-wide">
              Tên rạp
            </label>
            <input
              type="text"
              placeholder="Tìm theo tên rạp..."
              value={cinemaName}
              onChange={(e) => setCinemaName(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-xs font-semibold mb-1 uppercase tracking-wide">
              Trạng thái
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-red-500 transition-colors"
            >
              <option value="">Tất cả trạng thái</option>
              {statuses.map((st) => (
                <option key={st} value={st}>
                  {st === "PAID" ? "Đã thanh toán" : st === "PENDING" ? "Chờ thanh toán" : "Đã hủy"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 text-xs font-semibold mb-1 uppercase tracking-wide">
              Từ ngày
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-red-500 [color-scheme:dark]"
            />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-gray-300 text-xs font-semibold mb-1 uppercase tracking-wide">
                Đến ngày
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-red-500 [color-scheme:dark]"
              />
            </div>
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-500 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors h-[38px] self-end cursor-pointer"
            >
              Lọc
            </button>
          </div>
        </div>
      </form>

      {/* Thông báo lỗi */}
      {error && (
        <div className="bg-red-900/30 border border-red-500/50 text-red-300 p-4 rounded-xl mb-6 text-sm">
          {error}
        </div>
      )}

      {/* Danh sách vé */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-gray-400 text-sm">Đang tải danh sách vé...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-gray-800/60 rounded-2xl p-12 text-center border border-gray-700/50">
          <div className="text-5xl mb-4">🎟️</div>
          <h3 className="text-xl font-bold text-white mb-2">Bạn chưa có vé nào</h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
            Hãy khám phá các bộ phim hot đang chiếu và đặt vé ngay hôm nay!
          </p>
          <Link
            to="/movies"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-2.5 rounded-xl transition-all no-underline"
          >
            Khám phá phim ngay
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const badge = getStatusBadge(booking.status);
            return (
              <div
                key={booking.bookingId ?? `${booking.movieId}-${booking.showtimeId}`}
                className="bg-gray-800/90 rounded-2xl border border-gray-700/60 hover:border-gray-600 transition-all overflow-hidden shadow-md flex flex-col md:flex-row"
              >
                {/* Poster */}
                <div className="md:w-36 min-h-[140px] bg-gray-900 flex items-center justify-center p-3">
                  {booking.posterUrl ? (
                    <img
                      src={booking.posterUrl}
                      alt={booking.movieTitle || "Poster"}
                      className="w-full h-36 object-cover rounded-lg shadow"
                    />
                  ) : (
                    <div className="w-full h-36 rounded-lg border border-dashed border-gray-700 flex items-center justify-center text-gray-500 text-xs text-center p-2">
                      Không có poster
                    </div>
                  )}
                </div>

                {/* Thông tin vé */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">Mã đơn #{booking.bookingId || "—"}</span>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${badge.className}`}>
                          {badge.text}
                        </span>
                        {booking.ageRating && (
                          <span className="text-xs px-2 py-0.5 rounded bg-purple-900/40 text-purple-300 border border-purple-500/30">
                            {booking.ageRating}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-red-400">
                          {formatCurrency(booking.totalAmount)}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-1">
                      {booking.movieTitle || "—"}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3">
                      📍 {booking.cinemaName || "—"} • Phòng: {booking.roomName || "—"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-3 border-t border-gray-700/60 text-xs text-gray-300">
                    <div>
                      <span className="text-gray-500 block">Suất chiếu</span>
                      <span className="font-semibold text-white">{formatDateTime(booking.startTime)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Ngày đặt</span>
                      <span className="font-medium">{formatDateTime(booking.bookingDate)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Ghế</span>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {Array.isArray(booking.seats) && booking.seats.length > 0 ? (
                          booking.seats.map((seat, idx) => (
                            <span
                              key={seat.id ?? idx}
                              className="px-1.5 py-0.5 rounded bg-gray-700 text-white font-medium text-[11px]"
                            >
                              {seat.rowIndex}{seat.columnIndex}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500">Chưa xác định</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 gap-2">
          <button
            onClick={() => fetchBookings(currentPage - 1)}
            disabled={currentPage === 0}
            className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-700 border border-gray-700"
          >
            ← Trước
          </button>
          {Array.from({ length: totalPages }, (_, i) => i).map((page) => (
            <button
              key={page}
              onClick={() => fetchBookings(page)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${currentPage === page ? "bg-red-600 text-white border-red-500" : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"}`}
            >
              {page + 1}
            </button>
          ))}
          <button
            onClick={() => fetchBookings(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-700 border border-gray-700"
          >
            Sau →
          </button>
        </div>
      )}
    </div>
  );
}
