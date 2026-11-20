import { useLocation, Link, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Home, Ticket, RotateCcw, AlertTriangle, Loader2 } from "lucide-react";
import BookingProgress from "../../../component/BookingProgress";
import { useEffect, useState, useRef } from "react";

export default function PaymentResult() {
    const navigate = useNavigate();
    const query = new URLSearchParams(useLocation().search);
    const txnRef = query.get("txnRef");

    const [paymentData, setPaymentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pollCount, setPollCount] = useState(0);

    const timerRef = useRef(null);

    useEffect(() => {
        if (!txnRef) {
            setError("Không tìm thấy mã giao dịch trong yêu cầu");
            setLoading(false);
            return;
        }

        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            setError("Vui lòng đăng nhập để xem thông tin giao dịch");
            setLoading(false);
            return;
        }

        let isMounted = true;

        const checkStatus = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/payment/vnpay/status?txnRef=${encodeURIComponent(txnRef)}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(text || "Không thể xác thực trạng thái thanh toán");
                }

                const data = await res.json();
                if (!isMounted) return;

                setPaymentData(data);
                setLoading(false);

                // Nếu trạng thái vẫn là PENDING và chưa quá 15 lần poll (30 giây)
                if (data.status === "PENDING") {
                    setPollCount((prev) => {
                        if (prev < 15) {
                            timerRef.current = setTimeout(checkStatus, 2000);
                            return prev + 1;
                        }
                        return prev;
                    });
                }
            } catch (err) {
                if (!isMounted) return;
                setError(err.message || "Đã xảy ra lỗi khi kiểm tra giao dịch");
                setLoading(false);
            }
        };

        checkStatus();

        return () => {
            isMounted = false;
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [txnRef]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600 font-medium text-lg">Đang kiểm tra kết quả thanh toán từ hệ thống...</p>
            </div>
        );
    }

    if (error || !paymentData) {
        return (
            <div className="flex flex-col items-center justify-center p-6 text-center">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-red-100">
                    <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Thông báo</h2>
                    <p className="text-gray-600 mb-6">{error || "Không thể lấy thông tin giao dịch"}</p>
                    <Link to="/" className="inline-flex items-center justify-center gap-2 bg-gray-800 hover:bg-black text-white font-semibold py-3 px-6 rounded-xl transition-all no-underline">
                        <Home size={18} /> Quay về trang chủ
                    </Link>
                </div>
            </div>
        );
    }

    const isPending = paymentData.status === "PENDING";
    const isSuccess = paymentData.status === "SUCCESS";
    const isRefunded = paymentData.status === "REFUNDED";
    const isFailed = paymentData.status === "FAILED";
    const amount = paymentData.amount;
    const canRetry = isFailed && !paymentData.isExpired && paymentData.tempBookingId;

    return (
        <div className="flex flex-col items-center justify-center p-4">
            {/* STEP PROGRESS */}
            <div className="w-full max-w-lg mb-8">
                <BookingProgress currentStep={3} />
            </div>

            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
                {isPending ? (
                    <>
                        <div className="relative w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                            <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Đang xác nhận thanh toán...</h1>
                        <p className="text-gray-600 mb-6">
                            Hệ thống đang đối soát với cổng thanh toán VNPay. Vui lòng đợi trong giây lát.
                        </p>
                    </>
                ) : isSuccess ? (
                    <>
                        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Thanh toán thành công!</h1>
                        <p className="text-gray-600 mb-6">Vé của bạn đã được xác nhận trong hệ thống.</p>
                    </>
                ) : isRefunded ? (
                    <>
                        <AlertTriangle className="w-20 h-20 text-amber-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Giao dịch cần hoàn tiền</h1>
                        <p className="text-gray-600 mb-6">
                            Giao dịch thanh toán thành công nhưng đơn giữ chỗ đã hết hạn và ghế đã bán cho khách khác. Hệ thống sẽ hoàn tiền lại cho bạn.
                        </p>
                    </>
                ) : (
                    <>
                        <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Thanh toán thất bại</h1>
                        <p className="text-gray-600 mb-6">Giao dịch thanh toán chưa hoàn tất hoặc đã bị hủy.</p>
                    </>
                )}

                <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left border border-gray-100">
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-500 text-sm">Mã giao dịch:</span>
                        <span className="font-mono font-medium text-sm">{paymentData.txnRef || txnRef || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500 text-sm">Số tiền:</span>
                        <span className="font-bold text-blue-600">
                            {amount ? Number(amount).toLocaleString("vi-VN") : 0} VNĐ
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    {isPending ? (
                        <div className="space-y-3">
                            <p className="text-xs text-gray-400">Tự động cập nhật ngay khi nhận được tín hiệu từ ngân hàng...</p>
                            <Link to="/my-tickets" className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium no-underline">
                                <Ticket size={16} /> Kiểm tra trong Vé của tôi
                            </Link>
                        </div>
                    ) : isSuccess ? (
                        <Link to="/my-tickets" className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all no-underline">
                            <Ticket size={20} /> Xem vé của tôi
                        </Link>
                    ) : isRefunded ? (
                        <div className="space-y-3">
                            <p className="text-sm text-amber-600 font-medium">Vui lòng liên hệ nhân viên hoặc đặt một suất chiếu khác.</p>
                            <Link to="/" className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-black text-white font-semibold py-3 rounded-xl transition-all no-underline">
                                Đặt vé mới
                            </Link>
                        </div>
                    ) : canRetry ? (
                        <button
                            onClick={() => navigate(`/payments/${encodeURIComponent(paymentData.tempBookingId)}`)}
                            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-all border-0 cursor-pointer w-full text-base">
                            <RotateCcw size={18} /> Thanh toán lại
                        </button>
                    ) : (
                        <div className="space-y-3">
                            <p className="text-sm text-amber-600 font-medium">Phiên giữ ghế đã hết hạn. Vui lòng chọn lại vé mới.</p>
                            <Link to="/" className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-black text-white font-semibold py-3 rounded-xl transition-all no-underline">
                                Đặt vé mới
                            </Link>
                        </div>
                    )}

                    <Link to="/" className="flex items-center justify-center gap-2 text-gray-500 hover:text-gray-800 text-sm font-medium transition-colors no-underline">
                        <Home size={16} /> Quay về trang chủ
                    </Link>
                </div>
            </div>
        </div>
    );
}
