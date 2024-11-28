import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    axios.post("http://localhost:5001/api/auth/login", { email, password })
      .then((response) => {
        // Enregistrer le token dans le local storage pour la session de l'utilisateur
        localStorage.setItem("token", response.data.token);
        alert("Connexion réussie !");
        navigate("/"); // Rediriger vers la page d'accueil après la connexion
      })
      .catch((error) => {
        console.error("Erreur lors de la connexion :", error);
        alert("Email ou mot de passe incorrect.");
      });
  };

  return (
    <div>
      <h1>Connexion</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
};

export default LoginPage;
