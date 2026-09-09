import { Container, Row, Col } from "react-bootstrap";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 pt-16 pb-8 text-gray-400">
      <Container>
        <Row className="gy-8">
          {/* Cột 1: Brand & Intro */}
          <Col lg={4} md={12}>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-black text-white italic">G</div>
              <span className="text-2xl font-black tracking-tighter text-white italic uppercase">Gemini <span className="text-red-600">Cinema</span></span>
            </div>
            <p className="text-sm leading-relaxed pr-8">
              Trải nghiệm điện ảnh đỉnh cao với hệ thống âm thanh Dolby Atmos và màn hình IMAX thế hệ mới. 
              Đặt vé nhanh chóng, thanh toán an toàn, tận hưởng trọn vẹn từng khoảnh khắc.
            </p>
            <div className="flex gap-4 mt-6">
              {['facebook', 'instagram', 'youtube', 'tiktok'].map(icon => (
                <a key={icon} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all">
                  <i className={`bi bi-${icon}`}></i>
                </a>
              ))}
            </div>
          </Col>

          {/* Cột 2: Quick Links */}
          <Col lg={2} md={4} xs={6}>
            <h6 className="text-white font-bold uppercase tracking-widest mb-6 text-sm">Tài khoản</h6>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-red-500 transition-colors">Đăng nhập</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Đăng ký</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Lịch sử đặt vé</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Ưu đãi thành viên</a></li>
            </ul>
          </Col>

          {/* Cột 3: Cinema Info */}
          <Col lg={2} md={4} xs={6}>
            <h6 className="text-white font-bold uppercase tracking-widest mb-6 text-sm">Hệ thống rạp</h6>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-red-500 transition-colors">Rạp toàn quốc</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Giá vé rạp</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Tuyển dụng</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Liên hệ quảng cáo</a></li>
            </ul>
          </Col>

          {/* Cột 4: Newsletter/Contact */}
          <Col lg={4} md={4}>
            <h6 className="text-white font-bold uppercase tracking-widest mb-6 text-sm">Đăng ký nhận tin</h6>
            <p className="text-xs mb-4">Nhận thông báo về các bộ phim bom tấn và khuyến mãi sớm nhất.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Email của bạn..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-red-600 transition-all"
              />
              <button className="absolute right-2 top-2 bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all">
                GỬI
              </button>
            </div>
            <div className="mt-6 flex items-center gap-3">
               <i className="bi bi-headset text-2xl text-red-600"></i>
               <div>
                  <div className="text-[10px] uppercase tracking-widest">Hotline hỗ trợ 24/7</div>
                  <div className="text-white font-black">1900 1234 56</div>
               </div>
            </div>
          </Col>
        </Row>

        <hr className="my-12 border-white/5" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] uppercase tracking-widest font-medium">
          <p>© 2026 GEMINI CINEMA. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Điều khoản sử dụng</a>
            <a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a>
            <a href="#" className="hover:text-white transition-colors">Chăm sóc khách hàng</a>
          </div>
        </div>
      </Container>
    </footer>
  );
}