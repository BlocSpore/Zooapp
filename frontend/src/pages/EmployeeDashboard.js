import React, { useEffect, useState } from "react";
import axios from "axios";

const EmployeeDashboard = () => {
  const [avis, setAvis] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5001/api/avis")
      .then((response) => setAvis(response.data))
      .catch((error) => console.error("Erreur lors de la récupération des avis :", error));
  }, []);

  const handleValidation = (avisId, valider) => {
    axios.put(`http://localhost:5001/api/avis/${avisId}`, { valide: valider })
      .then(() => {
        setAvis((prevAvis) => prevAvis.map((a) =>
          a.avis_id === avisId ? { ...a, valide: valider } : a
        ));
      })
      .catch((error) => console.error("Erreur lors de la mise à jour de l'avis :", error));
  };

  return (
    <div>
      <h1>Espace Employé - Gestion des Avis</h1>
      <ul>
        {avis.map((a) => (
          <li key={a.avis_id}>
            <p><strong>{a.pseudo} :</strong> {a.texte}</p>
            <p>Statut : {a.valide ? "Validé" : "En attente de validation"}</p>
            {!a.valide && (
              <>
                <button onClick={() => handleValidation(a.avis_id, true)}>Valider</button>
                <button onClick={() => handleValidation(a.avis_id, false)}>Invalider</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeDashboard;
