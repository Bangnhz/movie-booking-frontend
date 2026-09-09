import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// THÊM: Import Navigate để chuyển hướng
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; 

import Home from "./pages/Home";
import MovieList from './pages/web/Movie/MovieList';
import CinemaList from './component/CinemaList';
import Booking from './pages/web/Booking';
import Payment from './pages/web/Payment';
import PaymentResult from './pages/web/Payment/PaymentResult';
import MovieDetail from './pages/web/Movie/MovieDetail';
import WebLayout from './layout/web/WebLayout';
import AdminLayout from './layout/admin/AdminLayout';
import AdminDashboard from './pages/admin/dashboard';
import AdminMovieList from './pages/admin/movie';
import AdminCinemaList from './pages/admin/cinema';
import AdminGenreList from './pages/admin/genre';
import MovieEdit from './pages/admin/movie/MovieEdit';
import Offer from './pages/web/Offer';
import AuthPage from './pages/AuthPage';
import CinemaEdit from './pages/admin/cinema/CinemaEdit';
import User from './pages/admin/user';
import UserDetail from './pages/admin/user/UserDetail';
import Profile from './pages/Profile';
import RoomPage from './pages/admin/room';

// Component bảo vệ Route
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("accessToken"); 
    
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

// Component bảo vệ Route cho Admin
const AdminRoute = ({ children }) => {
    const token = localStorage.getItem("accessToken"); 
    const rolesRaw = localStorage.getItem("roles");
    const roles = (rolesRaw && rolesRaw !== "undefined") ? JSON.parse(rolesRaw) : [];
    // Thêm dấu ngoặc đóng ) cho hàm includes
    const isAdmin = roles && roles.some(r => r.name.includes("ADMIN"));    
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    
    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* TRANG WEB */}
        <Route path="/" element={<WebLayout/>}>
          {/* CÁC TRANG CÔNG KHAI */}
          <Route index element={<Home/>}/>
          <Route path='home' element={<Home/>}/>
          <Route path='offers' element={<Offer/>}/>
          <Route path="cinemas" element={<CinemaList/>}/>
          <Route path='movies' element={<MovieList/>}/>
          <Route path='movies/:movieId' element={<MovieDetail/>}/>
          <Route path='login' element={<AuthPage/>}/>
          <Route 
            path='profile' 
            element={
              <ProtectedRoute>
                <Profile/>
              </ProtectedRoute>
            }
          />

          {/* CÁC TRANG CẦN ĐĂNG NHẬP */}
          <Route 
            path='bookings/:showtimeId' 
            element={
              <ProtectedRoute>
                <Booking/>
              </ProtectedRoute>
            } 
          />
          <Route 
            path='payments/:bookingId' 
            element={
              <ProtectedRoute>
                <Payment/>
              </ProtectedRoute>
            } 
          />
          <Route 
            path='payment-result' 
            element={
              <ProtectedRoute>
                <PaymentResult/>
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* TRANG ADMIN */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminLayout/>
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard/>}/>
          <Route path="movies" element={<AdminMovieList/>}/>
          <Route path="movies/:id" element={<MovieEdit/>}/>
          <Route path="cinemas" element={<AdminCinemaList/>}/>
          <Route path="cinemas/:id/edit" element={<CinemaEdit/>}/>
          <Route path="cinemas/:id/rooms" element={<RoomPage/>}/>
          <Route path="cinemas/:id" element={<RoomPage/>}/>
          <Route path="genres" element={<AdminGenreList/>}/>
          <Route path="users" element={<User/>}/>
          <Route path="users/:id" element={<UserDetail/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;