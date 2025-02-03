import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {Provider} from 'react-redux';
import {store, persistor} from './stores';
import { PersistGate } from 'redux-persist/integration/react';
import {AuthProvider} from './context/AuthContext';
import Products from './pages/Products.tsx';
import Dashboard from "./pages/Dashboard.tsx";
import Blogs from "./pages/Blogs.tsx";
import MainLayout from "./layout/MainLayout.tsx";
import Seasons from "./pages/Seasons.tsx";
import Chats from "./pages/Chats.tsx";
import Analytics from "./pages/Analytics.tsx";
import Needs from "./pages/Needs.tsx";
import Orders from "./pages/Orders.tsx";
import ProductDetail from './pages/products/ProductDetail.tsx';
import AuthLayout from "@/layout/AuthLayout.tsx";
import Home from '@/pages/auth/Home.tsx';
import Login from "@/pages/auth/Login.tsx"
import Register from "@/pages/auth/Register.tsx";
import {ThemeProvider} from "@/context/ThemeContext";

function App() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
            <ThemeProvider>
                <AuthProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route element={<AuthLayout />}>
                                <Route path={"/"} element={<Home />} />
                                <Route path={"/login"} element={<Login />} />
                                <Route path={"/register"} element={<Register />} />
                            </Route>
                            <Route element={<MainLayout />}>
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/blogs" element={<Blogs />} />
                                <Route path="/products">
                                    <Route index element={<Products />} />
                                    <Route path="/products/product-detail" element={<ProductDetail />} />
                                </Route>
                                <Route path="/analytics" element={<Analytics />} />
                                <Route path="/needs" element={<Needs />} />
                                <Route path="/orders" element={<Orders />} />
                                <Route path="/seasons" element={<Seasons />} />
                                <Route path="/chats" element={<Chats />} />
                         </Route>
                        </Routes>
                    </BrowserRouter>
                </AuthProvider>
            </ThemeProvider>
            </PersistGate>
        </Provider>
    );
}

export default App;