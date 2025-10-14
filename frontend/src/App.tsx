import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import Dashboard from "@/pages/Dashboard";

// Public Pages
import Home from "@/pages/home/Home";
import About from "@/pages/home/About";
import Faq from "@/pages/home/Faq";

// Auth Pages
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

// Dashboard Child Pages
import AddClass from "@/pages/Dashboard/AddClass";
import ManageClass from "@/pages/Dashboard/ManageClass";
import Requests from "@/pages/Dashboard/Request";
import Overview from "@/pages/Dashboard/Overview";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rute untuk Halaman Publik dengan Layout yang Sama */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<Faq />} />
        </Route>

        {/* Rute untuk Halaman Autentikasi (tanpa Navbar/Footer) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rute untuk Halaman Dashboard */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Overview />} />
          <Route path="add-class" element={<AddClass />} />
          <Route path="manage-class" element={<ManageClass />} />
          <Route path="requests" element={<Requests />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
