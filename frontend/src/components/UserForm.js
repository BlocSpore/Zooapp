import React, { useState } from "react";
import axios from "axios";

const UserForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employé");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = { email, password, role };

    axios.post("http://localhost:5001/api/utilisateurs", newUser)
      .then(() => {
        alert("Utilisateur ajouté avec succès.");
        setEmail("");
        setPassword("");
        setRole("employé");
      })
      .catch((error) => console.error("Erreur lors de l'ajout de l'utilisateur :", error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Ajouter un Utilisateur</h3>
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
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="employé">Employé</option>
        <option value="vétérinaire">Vétérinaire</option>
      </select>
      <button type="submit">Ajouter</button>
    </form>
  );
};

export default UserForm;
