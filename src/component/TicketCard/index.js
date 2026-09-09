export default function TicketCard({
    showtimeDetail,
    selectedSeats,
    totalPrice,
    isBooking,
    handleBooking
}) {
    const { title, posterUrl, ageRatingColor, ageRatingName } = showtimeDetail.movieBookingDTO;

    return (
        <div className="mt-8 bg-zinc-900 text-zinc-300 p-0 rounded-xl overflow-hidden shadow-2xl border border-zinc-800 relative">
            {/* Hiệu ứng đục lỗ giả ở hai đầu (Trang trí) */}
            <div className="absolute top-1/2 -translate-y-1/2 -left-3 w-6 h-6 bg-white rounded-full z-10"></div>
            <div className="absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-6 bg-white rounded-full z-10"></div>

            <div className="flex items-stretch">

                {/* PHẦN 1: POSTER & TITLE (Dành 35% chiều rộng) */}
                <div className="flex-[1.5] p-5 flex gap-4 items-center bg-zinc-950/50">
                    <img
                        src={posterUrl}
                        className="w-24 h-36 object-cover rounded shadow-[0_0_15px_rgba(220,38,38,0.3)] border border-zinc-800"
                        alt="poster"
                    />
                    <div className="flex flex-col gap-3">
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-tight">
                            {title}
                        </h3>
                        <div className="flex items-center gap-2">
                            <span
                                className="text-[10px] font-bold px-2 py-0.5 rounded text-white"
                                style={{ backgroundColor: ageRatingColor }}
                            >
                                {ageRatingName}
                            </span>
                            <span className="text-xs text-zinc-500 font-medium">2D • Phụ đề</span>
                        </div>
                    </div>
                </div>

                {/* ĐƯỜNG KẺ NGĂN CÁCH (Dashed Line) */}
                <div className="relative flex items-center">
                    <div className="h-[70%] border-l-2 border-dashed border-zinc-700"></div>
                </div>

                {/* PHẦN 2: CHI TIẾT (Dành 40% chiều rộng) */}
                <div className="flex-[2] p-5 flex flex-col justify-center gap-4 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1 font-bold">Rạp / Phòng</p>
                            <p className="text-white font-semibold">{showtimeDetail.cinemaName} • {showtimeDetail.roomName}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1 font-bold">Suất chiếu</p>
                            <p className="text-white font-semibold">{showtimeDetail.startTime}</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-bold">Ghế đang chọn</p>
                        <div className="flex flex-wrap gap-1.5">
                            {selectedSeats.length > 0 ? (
                                selectedSeats.map((seat) => (
                                    <span
                                        key={seat.id}
                                        className="px-2 py-0.5 bg-zinc-800 border border-zinc-700 text-amber-400 rounded text-xs font-bold shadow-inner"
                                    >
                                        {seat.rowIndex}{seat.columnIndex}
                                    </span>
                                ))
                            ) : (
                                <span className="text-zinc-600 italic text-xs">Vui lòng chọn ghế...</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* ĐƯỜNG KẺ NGĂN CÁCH (Dashed Line) */}
                <div className="relative flex items-center">
                    <div className="h-[70%] border-l-2 border-dashed border-zinc-700"></div>
                </div>

                {/* PHẦN 3: THANH TOÁN (Dành 25% chiều rộng) */}
                <div className="flex-1 p-5 flex flex-col justify-center items-center bg-zinc-950/30">
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1 font-bold">Tổng tiền</p>
                    <div className="text-2xl font-black text-amber-500 mb-4 tracking-tight">
                        {totalPrice.toLocaleString()}<span className="text-sm ml-0.5">₫</span>
                    </div>
                    <button
                        className={`w-full py-3 rounded-lg font-black text-xs tracking-widest transition-all duration-300 ${selectedSeats.length > 0
                            ? 'bg-red-600 hover:bg-red-700 text-white shadow-[0_0_20px_rgba(220,38,38,0.2)] active:scale-95'
                            : 'bg-zinc-800 text-zinc-600 cursor-not-allowed uppercase'
                            }`}
                        disabled={selectedSeats.length === 0 || isBooking}
                        onClick={handleBooking}
                    >
                        {selectedSeats.length > 0 ? 'MUA VÉ NGAY' : 'CHỌN GHẾ'}
                    </button>
                </div>
            </div>
        </div>
    )
}