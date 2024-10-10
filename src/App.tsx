import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Products from './pages/Products.tsx';

import Dashboard from "./pages/Dashboard.tsx";
import Blogs from "./pages/Blogs.tsx";
import MainLayout from "./layout/MainLayout.tsx";
import Seasons from "./pages/Seasons.tsx";

import Chats from "./pages/Chats.tsx";
import Analytics from "./pages/Analytics.tsx";
import Needs from "./pages/Needs.tsx";
import Orders from "./pages/Orders.tsx";




function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>

                    <Route element={<MainLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/blogs" element={<Blogs />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/analytics" element={<Analytics />} />
                          <Route path="/needs" element={<Needs/>} />
                          <Route path="/orders" element={<Orders />} />
                          <Route path="/seasons" element={<Seasons />} />
                          <Route path="/chats" element={<Chats />} />



                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
