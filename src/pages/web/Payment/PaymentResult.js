import { useLocation, Link } from "react-router-dom";
import { CheckCircle, XCircle, Home, Ticket } from "lucide-react"; // Cài lucide-react nếu chưa có
import BookingProgress from "../../../component/BookingProgress";

export default function PaymentResult() {
    const query = new URLSearchParams(useLocation().search);

    const txnRef = query.get("txnRef");
    const amount = query.get("vnp_Amount");
    const isSuccess = query.get("status") == "success";

    return (
        <>
        <div className="flex flex-col items-center justify-center p-4">
            {/* STEP PROGRESS */}
            <div className="w-full max-w-lg mb-8">
                <BookingProgress currentStep={3} />
            </div>
            <div className="max-w-md w-full] rounded-2xl shadow-xl p-8 text-center">
                {isSuccess ? (
                    <>
                        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Thanh toán thành công!</h1>
                        <p className="text-gray-600 mb-6">Vé của bạn đã được xác nhận.</p>
                    </>
                ) : (
                    <>
                        <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Thanh toán thất bại</h1>
                        <p className="text-gray-600 mb-6">Đã có lỗi xảy ra trong quá trình thanh toán hoặc giao dịch bị hủy.</p>
                    </>
                )}

                <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left border border-gray-100">
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-500 text-sm">Mã giao dịch:</span>
                        <span className="font-mono font-medium text-sm">{txnRef || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500 text-sm">Số tiền:</span>
                        <span className="font-bold text-blue-600">
                            {amount ? (parseInt(amount) / 100).toLocaleString('vi-VN') : 0} VNĐ
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    {isSuccess ? (
                        <Link to="/my-tickets" className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all no-underline">
                            <Ticket size={20} /> Xem vé của tôi
                        </Link>
                    ) : (
                        <Link to="/booking" className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-black text-white font-semibold py-3 rounded-xl transition-all no-underline">
                            Thử lại
                        </Link>
                    )}

                    <Link to="/" className="flex items-center justify-center gap-2 text-gray-500 hover:text-gray-800 text-sm font-medium transition-colors no-underline">
                        <Home size={16} /> Quay về trang chủ
                    </Link>
                </div>
            </div>
        </div>
        
        </>
    );
}