import { useEffect, useState } from "react";

export default function CountdownTimer({ startTime, expirationTime }) {
    const calculateRemaining = () => {
        if (!expirationTime) return 0;
        const expMs = typeof expirationTime === "number" ? expirationTime : new Date(expirationTime).getTime();
        if (Number.isNaN(expMs)) return 0;
        const diff = Math.floor((expMs - Date.now()) / 1000);
        return diff > 0 ? diff : 0;
    };

    const [timeLeft, setTimeLeft] = useState(calculateRemaining);

    useEffect(() => {
        // Cập nhật lại thời gian còn lại chính xác từ expirationTime - Date.now()
        const updateTimer = () => {
            const remaining = calculateRemaining();
            setTimeLeft(remaining);
            return remaining;
        };

        const currentRemaining = updateTimer();
        if (currentRemaining <= 0) {
            return;
        }

        // Mỗi nhịp setInterval (1 giây) tính lại từ expirationTime - Date.now(),
        // tránh việc bị lệch giây khi trình duyệt hạn chế chạy nền (background tab throttling)
        const timer = setInterval(() => {
            const remaining = updateTimer();
            if (remaining <= 0) {
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [expirationTime, startTime]);

    // Format mm:ss
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    // Tổng thời gian dự kiến (mặc định 900 giây = 15 phút nếu không tính được từ startTime)
    const totalDuration = (startTime && expirationTime)
        ? Math.max(1, Math.floor(((typeof expirationTime === "number" ? expirationTime : new Date(expirationTime).getTime()) - (typeof startTime === "number" ? startTime : new Date(startTime).getTime())) / 1000))
        : 900;

    return (
        <div className="flex items-center justify-center min-h-[200px]">
            <div className="bg-white shadow-lg rounded-2xl p-6 w-[300px] text-center border">
                {/* Title */}
                <h2 className="text-lg font-semibold mb-2">
                    Thời gian giữ vé
                </h2>

                {/* Countdown */}
                <div className="text-4xl font-bold text-red-500 mb-4">
                    {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div
                        className="bg-red-500 h-2 rounded-full transition-all duration-1000"
                        style={{
                            width: `${Math.min(100, Math.max(0, (timeLeft / totalDuration) * 100))}%`,
                        }}
                    ></div>
                </div>

                {/* Status */}
                {timeLeft > 0 ? (
                    <p className="text-sm text-gray-500">
                        Vui lòng hoàn tất thanh toán trước khi hết thời gian
                    </p>
                ) : (
                    <p className="text-sm text-red-500 font-medium">
                        Hết thời gian giữ vé!
                    </p>
                )}
            </div>
        </div>
    );
}
