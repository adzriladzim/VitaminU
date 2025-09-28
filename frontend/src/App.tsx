import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/home/Home";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

// ===== Dashboard & Child Pages =====
import Dashboard from "@/pages/Dashboard";
import AddClass from "@/pages/Dashboard/AddClass";
import ManageClass from "@/pages/Dashboard/ManageClass";
import Requests from "@/pages/Dashboard/Request";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Dashboard with Nested Routes */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="add-class" element={<AddClass />} />
          <Route path="manage-class" element={<ManageClass />} />
          <Route path="requests" element={<Requests />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
