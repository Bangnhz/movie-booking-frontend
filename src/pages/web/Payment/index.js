import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TicketCard from "../../../component/TicketCard";

import {Breadcrumb} from "react-bootstrap";
import BookingProgress from "../../../component/BookingProgress";
import CountdownTimer from "../../../component/CountdownTimer";

export default function Payment() {
  const navigate = useNavigate();
  const { bookingId } = useParams();

  const [bookingDetail, setBookingDetail] = useState({});
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [startTime, setStartTime] = useState(new Date());
  const [expirationTime, setExpirationTime] = useState(new Date());
  useEffect(() => {
    fetch(`http://localhost:8080/api/bookings/${bookingId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Không lấy được booking");
        return res.json();
      })
      .then((data) => {
        setBookingDetail(data);
        console.log(data);
        
        setStartTime(new Date(data.createdAt)); 
        setExpirationTime(new Date(data.expirationTime));
      });
  }, []);
  const createPayment = () => {
    if (!paymentMethod) {
      Swal.fire("Lỗi", "Vui lòng chọn phương thức thanh toán", "warning");
      return;
    }
    console.log(`http://localhost:8080/api/payment/vnpay/create?amount=${bookingDetail.totalPrice} `);
    fetch(`http://localhost:8080/api/payment/vnpay/create?amount=${bookingDetail.totalPrice}`,{
      method:"POST"
    })
    .then((res) => {
      if (!res.ok) throw new Error("Không lấy được booking");
        return res.json();
    })
    .then((data) =>{
      console.log(data);
      window.location.href = data.paymentUrl;
    });
    
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* STEP PROGRESS */}
      <BookingProgress currentStep={2}/>

      <div className="grid md:grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="md:col-span-2 space-y-6">

          {/* VOUCHER */}
          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Giảm giá</h2>

            <div className="flex gap-2 mb-3">
              <input
                className="flex-1 border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                placeholder="Nhập mã voucher"
              />

              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-md">
                Áp dụng
              </button>
            </div>

            <div className="flex gap-2">
              <input
                className="flex-1 border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                placeholder="Nhập mã coupon"
              />

              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-md">
                Áp dụng
              </button>
            </div>
          </div>

          {/* PAYMENT METHOD */}
          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">
              Hình thức thanh toán
            </h2>

            <div className="grid grid-cols-2 gap-4">

              {[
                // {
                //   name: "ATM",
                //   img: "https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/placeholder/default/atm_icon.png",
                // },
                // {
                //   name: "ZaloPay",
                //   img: "https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/placeholder/default/zalopay_logo2024.png",
                // },
                // {
                //   name: "Momo",
                //   img: "https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/placeholder/default/momo_icon.png",
                // },
                // {
                //   name: "ShopeePay",
                //   img: "https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/placeholder/default/shopeepay_online.jpg",
                // },
                {
                  name: "vnpay",
                  img: "https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/placeholder/default/vnpay_newlogo.png",
                },
              ].map((method) => (
                <label
                  key={method.name}
                  className={`border rounded-lg p-3 flex items-center gap-3 cursor-pointer transition
                  ${
                    paymentMethod === method.name
                      ? "border-blue-500 bg-blue-50"
                      : "hover:border-blue-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    className="hidden"
                    onChange={() => setPaymentMethod(method.name)}
                  />

                  <img className="w-8" src={method.img} />

                  <span className="font-medium">{method.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SUMMARY */}
        <div className="bg-white shadow rounded-xl p-6 h-fit sticky top-6">

          <h2 className="text-lg font-semibold mb-4">Thông tin vé</h2>

          <div className="space-y-2 text-sm mb-4">

            <div className="flex justify-between">
              <span>Rạp</span>
              <span>{bookingDetail.cinemaName}</span>
            </div>

            <div className="flex justify-between">
              <span>Phòng</span>
              <span>{bookingDetail.roomName}</span>
            </div>

            <div className="flex justify-between">
              <span>Ghế</span>
              <span>
                {bookingDetail&&bookingDetail.selectedSeats&&bookingDetail.selectedSeats.map(seat => (
                  <span key={seat.id} className="font-bold text-red-400 pl-1">
                    {seat.rowIndex}{seat.columnIndex}</span>
                ))}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Giờ chiếu</span>
              <span>{bookingDetail.startTime}</span>
            </div>
          </div>

          <div className="border-t pt-4 space-y-3 text-sm">

            <div className="flex justify-between">
              <span>Tổng tiền vé</span>
              <span>{bookingDetail.totalPrice || 0} VND</span>
            </div>

            <div className="flex justify-between text-green-600">
              <span>Giảm giá</span>
              <span>0 VND</span>
            </div>

            <div className="flex justify-between text-lg font-semibold border-t pt-3">
              <span>Cần thanh toán</span>
              <span className="text-red-500">
                {bookingDetail.totalPrice || 0} VND
              </span>
            </div>
          </div>

          <button
            onClick={createPayment}
            className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold"
          >
            Thanh toán
          </button>
          
        </div>
        <CountdownTimer startTime={startTime.getTime()} expirationTime={expirationTime.getTime()}/>
      </div>
    </div>
  );
}