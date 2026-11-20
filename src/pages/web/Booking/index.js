import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom"
import Swal from "sweetalert2";
import BookingProgress from "../../../component/BookingProgress";
import { Dropdown, DropdownButton, Badge, ButtonGroup, Container, ListGroup, Card } from "react-bootstrap";
import TicketCard from "../../../component/TicketCard";
import CountdownTimer from "../../../component/CountdownTimer";
const SEAT_TYPE_COLORS = {
    NORMAL: "#26292f",    // Xám đen (trùng màu card) - nhìn rất sạch
    VIP: "#c9a227",   // Tím ánh kim (Violet 500) - tạo cảm giác đẳng cấp hơn vàng
    SWEETBOX: "#be185d",  // Đỏ rượu vang - lãng mạn nhưng không bị chói
    SELECTED: "#dc2626",  // Đỏ rực (Red 600) - màu thương hiệu của bạn
    BOOKED: "#111827",
    HELD: "#334155"   // xanh xám
};
export default function Booking() {
    const navigate = useNavigate()

    const { showtimeId } = useParams();
    const [showtimeDetail, setShowtimeDetail] = useState();
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [isBooking, setIsBooking] = useState(false);

    useEffect(() => {
        let url = `http://localhost:8080/api/showtimes/${showtimeId}`;
        fetch(url)
            .then(res => res.json())
            .then(data => {
                setShowtimeDetail(data)
            })
    }, [])

    const groupSeatsByRow = (seats) => {
        return seats.reduce((acc, seat) => {
            if (!acc[seat.rowIndex]) acc[seat.rowIndex] = [];
            acc[seat.rowIndex].push(seat);
            return acc;
        }, {})
    }
    // console.log(showtimeDetail);

    const handleSelectedSeat = (seat) => {
        if (seat.status === "BOOKED") return;
        setSelectedSeats(prev => prev.includes(seat)
            ? prev.filter(s => s.id !== seat.id)
            : [...prev, seat].sort((a, b) => {
                if (a.rowIndex === b.rowIndex) {
                    return a.columnIndex - b.columnIndex;
                }
                return a.rowIndex.localeCompare(b.rowIndex);
            })
        )
    }
    const handleBooking = async () => {
        if (isBooking) return;

        if (selectedSeats.length === 0) {
            Swal.fire('Lỗi', 'Vui lòng chọn ghế trước khi đặt vé', 'warning');
            return;
        }
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            await Swal.fire("Thông báo", "Vui lòng đăng nhập trước", "warning");
            navigate("/login");
            return;
        }

        setIsBooking(true);
        try {
            const bookingData = {
                showtimeId: Number(showtimeId),
                seatIds: selectedSeats.map(seat => seat.id)
            };

            const response = await fetch(
                "http://localhost:8080/api/bookings/hold",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`
                    },
                    body: JSON.stringify(bookingData)
                }
            );

            const result = await response.text();

            if (!response.ok) {
                throw new Error(result || "Không thể giữ ghế");
            }

            const tempBookingId = result.replaceAll('"', "").trim();

            if (!tempBookingId) {
                throw new Error("Backend không trả về mã booking tạm");
            }

            navigate(`/payments/${encodeURIComponent(tempBookingId)}`);
        } catch (error) {
            await Swal.fire("Lỗi", error.message, "error");
        } finally {
            setIsBooking(false);
        }
    }
    const getSeatColor = (seat) => {
        if (seat.status === "BOOKED") return SEAT_TYPE_COLORS.BOOKED;
        if (seat.status === "HELD") return SEAT_TYPE_COLORS["HELD"];
        if (selectedSeats.includes(seat)) return SEAT_TYPE_COLORS.SELECTED;
        return SEAT_TYPE_COLORS[seat.type] || SEAT_TYPE_COLORS.NORMAL;
    }
    const totalPrice = useMemo(() => {
        return selectedSeats.reduce((sum, seat) => {
            const seatPrice = (showtimeDetail.basePrice + seat.surcharge)
            return sum + seatPrice;
        }, 0)
    }, [selectedSeats]);

    if (!showtimeDetail) {
        return <div>Loading...</div>;
    }
    const seatsByRow = groupSeatsByRow(showtimeDetail.seats);
    if (!showtimeDetail || !showtimeDetail.movieBookingDTO) return null;
    const { title, posterUrl, ageRatingColor, ageRatingName } = showtimeDetail.movieBookingDTO;

    return (
        <div className="bg-[#0f1115] min-h-screen py-10 text-white">
            <Container>
                {/* STEP PROGRESS - Bạn nên vào component này chỉnh màu text sang trắng */}
                <BookingProgress currentStep={1} />

                <div className="text-center my-12">
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                        Màn hình chọn ghế
                    </h2>
                    <div className="h-1 w-24 bg-red-600 mx-auto rounded-full shadow-[0_0_15px_#dc2626] mt-2"></div>
                </div>

                {/* MÀN HÌNH GIẢ LẬP */}
                <div className="relative mb-20">
                    <div
                        style={{
                            width: "80%",
                            margin: "0 auto",
                            height: "8px",
                            background: "linear-gradient(to bottom, #ef4444, transparent)",
                            borderRadius: "50% / 100% 100% 0 0",
                            boxShadow: "0 -5px 20px rgba(239, 68, 68, 0.5)"
                        }}
                    />
                    <p className="text-center text-xs tracking-[0.5em] text-gray-500 uppercase mt-2">Màn hình</p>
                </div>

                {/* DANH SÁCH GHẾ */}
                <div className="flex flex-col items-center gap-3 overflow-x-auto pb-10">
                    {Object.keys(seatsByRow).map(row => (
                        <div key={row} className="flex items-center gap-3 min-w-max">
                            <strong className="w-8 text-gray-500 font-mono text-lg">{row}</strong>
                            <div className="flex gap-2">
                                {seatsByRow[row].map(seat => (
                                    <button
                                        key={seat.id}
                                        disabled={seat.status === "BOOKED" || seat.status === "HELD"}
                                        onClick={() => handleSelectedSeat(seat)}
                                        className="
                                        relative w-10 h-9 rounded-md text-[10px] font-bold transition-all duration-300
                                        flex items-center justify-center border border-white/5
                                        hover:scale-110 active:scale-90 disabled:opacity-30 disabled:hover:scale-100
                                    "
                                        style={{
                                            backgroundColor: getSeatColor(seat),
                                            boxShadow: selectedSeats.some(s => s.id === seat.id)
                                                ? "0 0 15px rgba(239, 68, 68, 0.6)" : "none",
                                            color: seat.type === "VIP" ? "#0f172a" : seat.status === "BOOKED" ? "#475569" : "white",
                                        }}
                                    >
                                        {row}{seat.columnIndex}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* CHÚ THÍCH (LEGEND) */}
                <div className="flex flex-wrap justify-center gap-6 mt-12 p-6 bg-[#16191e] rounded-2xl border border-white/5 shadow-xl">
                    {[
                        { label: "Thường", color: SEAT_TYPE_COLORS.NORMAL },
                        { label: "VIP", color: SEAT_TYPE_COLORS.VIP },
                        { label: "Đã bán", color: SEAT_TYPE_COLORS.BOOKED },
                        { label: "Đang chọn", color: SEAT_TYPE_COLORS.SELECTED },
                        { label: "Không thể chọn", color: SEAT_TYPE_COLORS.HELD }
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded shadow-inner" style={{ backgroundColor: item.color }}></div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">{item.label}</span>
                        </div>
                    ))}
                </div>

                {/* TICKET CARD (Thông tin đặt vé ở dưới cùng) */}
                <div className="mt-10">
                    <TicketCard
                        showtimeDetail={showtimeDetail}
                        selectedSeats={selectedSeats}
                        totalPrice={totalPrice}
                        isBooking={isBooking}
                        handleBooking={handleBooking}
                    />
                </div>
            </Container>
        </div>
    );
}