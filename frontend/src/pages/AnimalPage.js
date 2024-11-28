import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const AnimalPage = () => {
  const [animaux, setAnimaux] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5001/api/animaux")
      .then(response => setAnimaux(response.data))
      .catch(error => console.error("Erreur lors de la récupération des animaux :", error));
  }, []);

  return (
    <div>
      <h1>Liste des Animaux</h1>
      <ul>
        {animaux.map(animal => (
          <li key={animal.animal_id}>
            <Link to={`/animaux/${animal.animal_id}`}>
              {animal.prenom} - {animal.nom}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnimalPage;
