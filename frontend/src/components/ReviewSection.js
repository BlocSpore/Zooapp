import React, { useEffect, useState } from "react";
import axios from "axios";

const ReviewSection = () => {
  const [avis, setAvis] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5001/api/avis")
      .then(response => setAvis(response.data))
      .catch(error => console.error("Erreur lors de la récupération des avis :", error));
  }, []);

  return (
    <section>
      <h2>Les Avis de Nos Visiteurs</h2>
      <ul>
        {avis.filter(a => a.valide).map(a => (
          <li key={a.avis_id}>
            <strong>{a.pseudo} :</strong> {a.texte}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ReviewSection;
