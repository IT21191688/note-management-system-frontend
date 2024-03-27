import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import { ToastContainer } from "react-toastify";
import UserHomePage from "./components/UserHomePage";
import AddNotePage from "./components/AddNotePage";
import EditNotePage from "./components/EditNotePage";

function App() {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    setUser(localStorage.getItem("role") || null);
  }, []);

  return (
    <Router>
      <div>
        <NavBar />
        <ToastContainer />

        <Routes>
          {user === "admin" && <Route path="/" element={<UserHomePage />} />}
          {user === "user" && (
            <>
              <Route path="/userHome" element={<UserHomePage />} />
              <Route path="/AddNotePage" element={<AddNotePage />} />
              <Route path="/EditNotePage/:noteId" element={<EditNotePage />} />
            </>
          )}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
