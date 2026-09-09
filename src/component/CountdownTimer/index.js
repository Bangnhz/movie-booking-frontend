import { useEffect, useState } from "react"

export default function CountdownTimer({startTime,expirationTime}){
    const [timeLeft,setTimeLeft] = useState(Math.floor((expirationTime - Date.now())/1000))
    
    // 1. Kịch bản khi KHÔNG có [startTime] (Lỗi)
    // Lần 1 (Vừa F5): Cha chưa có data, truyền startTime = 0 hoặc Date.now(). 
    // Con nhận 0, useEffect chạy (vì [] luôn chạy lần đầu). 
    // Nó tính toán dựa trên số 0 → Ra kết quả sai (ví dụ 899) 
    // → Khóa (Lock) cái setInterval với con số 899 này.
    // Lần 2 (100ms sau): Cha nhận data từ DB, truyền startTime = 1711234567. 
    // Con nhận giá trị mới, nó Re-render giao diện. 
    // NHƯNG, vì useEffect dùng [] nên chỉ chạy 1 lần.
    // Kết quả: Giao diện của bạn vẫn cứ đếm ngược từ 899, mặc kệ cái startTime vừa mới về.
    useEffect(() => {
        setTimeLeft(Math.floor((expirationTime - Date.now())/1000))
        if (Math.floor((expirationTime - Date.now())/1000) <= 0){
            setTimeLeft(0);
            return;
        }
        const timer = setInterval(()=>{
            setTimeLeft((prev) => {
                if(prev <= 0){
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        },1000);
        return () => clearInterval(timer);
    },[startTime]);
      // format mm:ss
    const minutes = Math.floor(timeLeft / 60) ;
    const seconds = timeLeft % 60;
    return (
        <>
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
                            width: `${(timeLeft / 900) * 100}%`,
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
        </>
    )
}