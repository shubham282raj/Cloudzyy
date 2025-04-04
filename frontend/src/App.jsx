import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Browse from "./pages/Browse";
import Register from "./pages/Resigter";
import Profile from "./pages/Profile";
// import Share from "./pages/Share";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Browse />} />
          <Route path="/profile" element={<Profile />} />
          {/* <Route path="/share" element={<Share />} /> */}
          <Route path="/register" element={<Register />} />
          <Route path="/sign-in" element={<Login />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
