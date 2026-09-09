import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBookingsByUser } from "../../../service/UserService";

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

const getStatusClass = (status) => {
  switch (status) {
    case "PAID":
      return "bg-green-600/20 text-green-400";
    case "PENDING":
      return "bg-yellow-600/20 text-yellow-400";
    case "CANCELLED":
      return "bg-red-600/20 text-red-400";
    default:
      return "bg-gray-600/20 text-gray-300";
  }
};

export default function UserDetail() {
  const { id } = useParams();
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

  const fetchBooking = async (page = 0) => {
    setLoading(true);
    setError("");
    try {
      const response = await getBookingsByUser({
        userId: id,
        cinemaName,
        status,
        fromDate,
        toDate,
        page,
        size: pageSize,
        sort: "id,asc",
      });

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
      setError("Không thể tải danh sách đặt vé");
      setBookings([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking(0);
  }, [id]);

  const handleSearch = () => {
    fetchBooking(0);
  };

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Lịch sử đặt vé</h2>
          <p className="text-gray-400 text-sm mt-1">Hiển thị dữ liệu booking từ API theo cấu trúc response</p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-gray-400 text-sm mb-1">Tên rạp</label>
            <input
              type="text"
              name="cinemaName"
              placeholder="Tìm kiếm theo tên rạp..."
              value={cinemaName}
              onChange={(e) => setCinemaName(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="w-full md:w-auto">
            <label className="block text-gray-400 text-sm mb-1">Từ ngày</label>
            <input
              type="date"
              name="fromDate"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-red-500 [color-scheme:dark]"
            />
          </div>

          <div className="w-full md:w-auto">
            <label className="block text-gray-400 text-sm mb-1">Đến ngày</label>
            <input
              type="date"
              name="toDate"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-red-500 [color-scheme:dark]"
            />
          </div>

          <div className="w-full md:w-auto min-w-[160px]">
            <label className="block text-gray-400 text-sm mb-1">Trạng thái</label>
            <select
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-red-500"
            >
              <option value="">Tất cả trạng thái</option>
              {statuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSearch}
            className="w-full md:w-auto bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-lg transition-colors font-medium h-[42px]"
          >
            Tìm kiếm
          </button>
        </div>
      </div>

      {error && <div className="text-red-400 mb-4">{error}</div>}

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="text-white text-lg">Đang tải dữ liệu...</div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-8 text-center text-gray-400">
          Không tìm thấy đơn đặt vé nào phù hợp.
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <article key={booking.bookingId ?? `${booking.movieId}-${booking.showtimeId}`} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-36 p-4 flex items-center justify-center bg-gray-900/70">
                  {booking.posterUrl ? (
                    <img
                      src={booking.posterUrl}
                      alt={booking.movieTitle || "Poster phim"}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-40 rounded-lg border border-dashed border-gray-600 flex items-center justify-center text-gray-400 text-sm text-center p-2">
                      Không có ảnh poster
                    </div>
                  )}
                </div>

                <div className="flex-1 p-4 md:p-5">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-white">Đơn #{booking.bookingId || "—"}</span>
                        <span className={`text-xs px-2.5 py-1 rounded-full ${getStatusClass(booking.status)}`}>
                          {booking.status || "—"}
                        </span>
                        {booking.ageRating ? (
                          <span className="text-xs px-2.5 py-1 rounded-full bg-purple-600/20 text-purple-300">
                            {booking.ageRating}
                          </span>
                        ) : null}
                      </div>
                      <h3 className="text-xl font-semibold text-white">{booking.movieTitle || "—"}</h3>
                      <p className="text-sm text-gray-400 mt-1">
                        {booking.cinemaName || "—"} • {booking.roomName || "—"}
                      </p>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="text-sm text-gray-400">Tổng tiền</p>
                      <p className="text-lg font-semibold text-red-400">{formatCurrency(booking.totalAmount)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-sm text-gray-300">
                    <div className="rounded-lg bg-gray-700/60 p-3">
                      <p className="text-gray-400 mb-1">Ngày đặt</p>
                      <p className="font-medium text-white">{formatDateTime(booking.bookingDate)}</p>
                    </div>

                    <div className="rounded-lg bg-gray-700/60 p-3">
                      <p className="text-gray-400 mb-1">Suất chiếu</p>
                      <p className="font-medium text-white">{formatDateTime(booking.startTime)}</p>
                    </div>

                    <div className="rounded-lg bg-gray-700/60 p-3">
                      <p className="text-gray-400 mb-1">Ghế</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {Array.isArray(booking.seats) && booking.seats.length > 0 ? (
                          booking.seats.map((seat, index) => (
                            <span
                              key={seat.id ?? `${seat.rowIndex}-${seat.columnIndex}-${index}`}
                              className="px-2.5 py-1 rounded-full bg-gray-600 text-gray-100 text-xs"
                            >
                              {seat.rowIndex || ""}
                              {seat.columnIndex || ""}
                              {seat.type ? ` • ${seat.type}` : ""}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400">Không có thông tin ghế</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-2">
          <button
            onClick={() => fetchBooking(currentPage - 1)}
            disabled={currentPage === 0}
            className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
          >
            ← Trước
          </button>
          {Array.from({ length: totalPages }, (_, i) => i).map((page) => (
            <button
              key={page}
              onClick={() => fetchBooking(page)}
              className={`px-3 py-1 rounded ${currentPage === page ? "bg-red-600 text-white" : "bg-gray-700 text-white hover:bg-gray-600"}`}
            >
              {page + 1}
            </button>
          ))}
          <button
            onClick={() => fetchBooking(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
          >
            Sau →
          </button>
        </div>
      )}
    </div>
  );
}