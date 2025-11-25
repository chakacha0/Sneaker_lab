import React from "react";
import { Link } from "react-router-dom";

function Header() {
  const headerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "15px 40px",
    backgroundColor: "#111",
    color: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    width: "100%",
  };

  const logoStyle = {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#fff",
    textDecoration: "none",
    letterSpacing: "1px",
  };

  const navStyle = {
    display: "flex",
    gap: "25px",
    fontWeight: "bold",
    textTransform: "uppercase",
  };

  const linkStyle = {
    color: "#fff",
    textDecoration: "none",
    transition: "color 0.2s",
  };

  const linkHover = {
    color: "#f0c040", // акцентный цвет при наведении
  };

  return (
    <header style={headerStyle}>
      {/* Логотип */}
      <Link to="/" style={logoStyle}>
        🛍 Shop
      </Link>

      {/* Навигация */}
      <nav style={navStyle}>
        <Link
          to="/"
          style={linkStyle}
          onMouseEnter={(e) => (e.target.style.color = linkHover.color)}
          onMouseLeave={(e) => (e.target.style.color = linkStyle.color)}
        >
          Главная
        </Link>
        <Link
          to="/catalog"
          style={linkStyle}
          onMouseEnter={(e) => (e.target.style.color = linkHover.color)}
          onMouseLeave={(e) => (e.target.style.color = linkStyle.color)}
        >
          Каталог
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

