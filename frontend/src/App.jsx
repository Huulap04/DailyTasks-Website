import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./page/Auth/Register.jsx";
import Welcome from "./page/Welcome/Welcome.jsx";
import Login from "./page/Auth/Login.jsx";
import Home from "./page/Home/Home.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
