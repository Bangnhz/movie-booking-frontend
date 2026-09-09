import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function AdminLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-900">
            <Header />
            <main className="flex-1 bg-gray-900">
                <Outlet />
            </main>
            <Footer/>
        </div>
    )
}