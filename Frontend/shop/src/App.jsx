

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Fut from "./components/Fut";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Register from "./pages/Registe";
import ProductPage from "./pages/ProductPage";
import VerifyCode from "./pages/VerifyCode";
import Cart from "./pages/Cart";
import Favourites from "./pages/Favourites";
import Profile from "./pages/Profile";
import AdminCabinet from "./pages/AdminCabinet";
import Info from "./pages/Info";

const pageStyle = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  width: "100%",
  overflowX: "hidden",
  boxSizing: "border-box",
  background: "#fff",
  color: "#333",
};

const contentStyle = {
  flex: 1,
  maxWidth: "1200px",
  margin: "0 auto",
  width: "100%",
};



function App() {
  return (
    <div style={pageStyle}>
      <Header />

      {/* Контент ограничен по центру */}
      <main style={contentStyle}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/info" element={<Info />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-code" element={<VerifyCode />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminCabinet />} />
        </Routes>
      </main>

      {/* Футер вынесен в общий layout и растягивается */}
      <Fut />
    </div>
  );
}

export default App;
