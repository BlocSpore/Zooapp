import React, { useState } from "react";
import axios from "axios";

const ReviewForm = ({ animalId }) => {
  const [pseudo, setPseudo] = useState("");
  const [avis, setAvis] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAvis = { pseudo, texte: avis, animal_id: animalId };

    axios.post("http://localhost:5001/api/avis", newAvis)
      .then(() => {
        setPseudo("");
        setAvis("");
        alert("Avis soumis avec succès. Il est en attente de validation.");
      })
      .catch((error) => console.error("Erreur lors de la soumission de l'avis :", error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Laisser un avis</h3>
      <input
        type="text"
        name="pseudo"
        placeholder="Votre pseudo"
        value={pseudo}
        onChange={(e) => setPseudo(e.target.value)}
        required
      />
      <textarea
        name="avis"
        placeholder="Votre avis"
        value={avis}
        onChange={(e) => setAvis(e.target.value)}
        required
      />
      <button type="submit">Soumettre</button>
    </form>
  );
};

export default ReviewForm;
