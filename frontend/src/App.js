import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AnimalPage from "./pages/AnimalPage";
import AnimalDetailsPage from "./pages/AnimalDetailsPage";
import HabitatPage from "./pages/HabitatPage";
import HabitatDetailsPage from "./pages/HabitatDetailsPage";
import ServicePage from "./pages/ServicePage";
import ReviewPage from "./pages/ReviewPage";
import LoginPage from "./pages/LoginPage";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import VetDashboard from "./pages/VetDashboard"; // Import ajouté
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/animaux" element={<AnimalPage />} />
          <Route path="/animaux/:id" element={<AnimalDetailsPage />} />
          <Route path="/habitats" element={<HabitatPage />} />
          <Route path="/habitats/:id" element={<HabitatDetailsPage />} />
          <Route path="/services" element={<ServicePage />} />
          <Route path="/avis" element={<ReviewPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Routes protégées */}
          <Route
            path="/employe"
            element={
              <ProtectedRoute>
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/veterinaire" // Route pour le tableau de bord vétérinaire
            element={
              <ProtectedRoute>
                <VetDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
