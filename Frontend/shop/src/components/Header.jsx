import React from "react";
import { Link } from "react-router-dom";

function Header() {
const headerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "20px 40px",
  background: "linear-gradient(90deg, #111 0%, #222 100%)",
  color: "#fff",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  position: "sticky",
  top: 0,
  zIndex: 1000,
  width: "100%",
};

const logoStyle = {
  fontFamily: "'Bungee Spice', sans-serif",
  fontSize: "32px",
  fontWeight: "400",
  textTransform: "uppercase",
  textDecoration: "none", // 🔥 убирает подчёркивание
  color: "#fff",
};


const navStyle = {
  display: "flex",
  justifyContent: "center", // ссылки по центру
  flex: 1,                  // занимает всё доступное пространство
  gap: "30px",
  fontWeight: "600",
  textTransform: "uppercase",
  fontSize: "14px",
};

const linkStyle = {
  fontFamily: "'Archivo Black', sans-serif",
  color: "#fff",
  textDecoration: "none",
  transition: "color 0.3s ease",
};


  return (
    <header style={headerStyle}>
      {/* Логотип */}
      <Link to="/" style={logoStyle}>
        SNEAKER LAB
      </Link>

      {/* Навигация */}
      <nav style={navStyle}>
        <Link
          to="/"
          style={linkStyle}
          onMouseEnter={(e) => (e.target.style.color = linkHover.color)}
          onMouseLeave={(e) => (e.target.style.color = linkStyle.color)}
        >
          Home
        </Link>
        <Link
          to="/catalog"
          style={linkStyle}
          onMouseEnter={(e) => (e.target.style.color = linkHover.color)}
          onMouseLeave={(e) => (e.target.style.color = linkStyle.color)}
        >
          Catalog
        </Link>
         <Link
          to="/register"
          style={linkStyle}
          onMouseEnter={(e) => (e.target.style.color = linkHover.color)}
          onMouseLeave={(e) => (e.target.style.color = linkStyle.color)}
        >
          Registration
        </Link>
      </nav>
    </header>
  );
}

export default Header;




// import React from "react";



// function Header() {
//     const headerStyle = {
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "space-between",
//         padding: "15px 40px",
//         backgroundColor: "#111",
//         color: "#fff",
//         boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
//         position: "sticky",
//         top: 0,
//         zIndex: 1000,
//     };

//     const logoStyle = {
//         height: "50px",
//         objectFit: "contain",
//     };

//     const navStyle = {
//         display: "flex",
//         gap: "25px",
//         fontWeight: "bold",
//         textTransform: "uppercase",
//     };

//     const linkStyle = {
//         color: "#fff",
//         textDecoration: "none",
//         transition: "color 0.2s",
//     };

//     return (
//         <header style={headerStyle}>
//             <p>HELLO</p>
            
//         </header>
//     );
// }

// export default Header;

