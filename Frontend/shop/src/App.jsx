
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Fut from "./components/Fut"
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Register from "./pages/Registe";

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />}/>
         <Route path="/register" element={<Register />} />
      </Routes>

      <Fut />
      
    </>
  );
}

export default App;

// import Header from "./components/Header";
// import Home from "./pages/Home";
// import Catalog from "./pages/Catalog";

// function App() {
//   return (
//     <>
//       <Header />
//       <Home />
//     </>
      
//   );
// }

// export default App;
// import { BrowserRouter as Router, Routes, Route, Link, NavLink } from "react-router-dom";
// import Home from "./pages/Home";
// import Catalog from "./pages/Catalog";

// function App() {
//   return (
//     <Router>
//       <header>        
//         <nav>
//           <NavLink to="/">Главная</NavLink>          
//         </nav>
//       </header>
//       <Routes>
//         <Route path="/" element={<Home />} />       
//       </Routes>
//     </Router>
//   );
// }

// export default App;
