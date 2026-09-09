import { Container, Row, Col, Badge, Button } from "react-bootstrap";

export default function Offer() {
  const offers = [
    {
      id: 1,
      title: "NGÀY HỘI THÀNH VIÊN - ĐỒNG GIÁ 45K",
      description:
        "Áp dụng vào mỗi thứ Hai cuối cùng của tháng cho tất cả các suất chiếu 2D tại hệ thống.",
      image:
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000&auto=format&fit=crop",
      tag: "Member Day",
      expiry: "31/12/2026",
    },
    {
      id: 2,
      title: "COMBO BỎNG NƯỚC SIÊU TIẾT KIỆM",
      description:
        "Giảm ngay 20% khi đặt trước Combo bắp nước qua Website hoặc Ứng dụng.",
      image:
        "https://images.unsplash.com/photo-1572177191856-3cde618dee1f?q=80&w=1000&auto=format&fit=crop",
      tag: "Food & Drink",
      expiry: "Hàng tuần",
    },
    {
      id: 3,
      title: "ƯU ĐÃI HỌC SINH - SINH VIÊN",
      description:
        "Đồng giá vé 50K cho HSSV dưới 22 tuổi khi xuất trình thẻ tại quầy.",
      image:
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop",
      tag: "Students",
      expiry: "Vô thời hạn",
    },
    {
      id: 4,
      title: "THANH TOÁN VÍ ĐIỆN TỬ - GIẢM 50%",
      description:
        "Nhập mã GEMINI50 khi thanh toán qua MoMo, ZaloPay hoặc ShopeePay.",
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1000&auto=format&fit=crop",
      tag: "Payment",
      expiry: "15/05/2026",
    },
  ];

  return (
    <div className="bg-[#0f1115] min-h-screen py-16 text-white">
      <Container>
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-red-500 to-gray-500">
            Ưu đãi đặc biệt
          </h2>
          <div className="h-1 w-24 bg-red-600 mx-auto rounded-full shadow-[0_0_15px_#dc2626]" />
          <p className="text-gray-400 mt-6 max-w-2xl mx-auto">
            Khám phá những chương trình khuyến mãi hấp dẫn nhất chỉ có tại Bang Cinema.
          </p>
        </div>

        {/* FIX CHÍNH NẰM Ở ĐÂY */}
        <Row className="g-4">
          {offers.map((item) => (
            <Col key={item.id} lg={6} md={12} className="d-flex">
              
              {/* ép card full height */}
              <div className="group w-100 bg-[#16191e] rounded-3xl overflow-hidden border border-white/5 transition-all duration-500 hover:border-red-600/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col sm:flex-row">
                
                {/* Image */}
                <div className="relative w-full sm:w-56 shrink-0 overflow-hidden">
                  <img
                    src={item.image}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={item.title}
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-red-600 px-3 py-1 text-[10px] uppercase">
                      {item.tag}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <h4 className="text-lg font-black mb-2 uppercase italic">
                      {item.title}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-gray-500">
                      {item.expiry}
                    </span>
                    <Button className="!bg-red-600/10 !text-red-500 border !border-red-600/20 hover:!bg-red-600 hover:!text-white text-xs">
                      Chi tiết
                    </Button>
                  </div>
                </div>
              </div>

            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}