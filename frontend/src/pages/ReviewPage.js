import React, { useEffect, useState } from "react";
import axios from "axios";

const ReviewPage = () => {
  const [avis, setAvis] = useState([]);
  const [pseudo, setPseudo] = useState("");
  const [texte, setTexte] = useState("");

  useEffect(() => {
    // Récupération des avis validés
    axios.get("http://localhost:5001/api/avis")
      .then((response) => {
        const avisValides = response.data.filter((a) => a.valide);
        setAvis(avisValides);
      })
      .catch((error) => console.error("Erreur lors de la récupération des avis :", error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAvis = { pseudo, texte };

    axios.post("http://localhost:5001/api/avis", newAvis)
      .then(() => {
        setPseudo("");
        setTexte("");
        alert("Avis soumis avec succès. Il est en attente de validation.");
      })
      .catch((error) => console.error("Erreur lors de la soumission de l'avis :", error));
  };

  return (
    <div>
      <h1>Les Avis des Visiteurs</h1>
      <ul>
        {avis.map((a) => (
          <li key={a.avis_id}>
            <strong>{a.pseudo} :</strong> {a.texte}
          </li>
        ))}
      </ul>

      <h2>Laisser un Avis</h2>
      <form onSubmit={handleSubmit}>
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
          value={texte}
          onChange={(e) => setTexte(e.target.value)}
          required
        />
        <button type="submit">Soumettre</button>
      </form>
    </div>
  );
};

export default ReviewPage;
