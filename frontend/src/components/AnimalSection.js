import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const AnimalSection = () => {
  const [animaux, setAnimaux] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5001/api/animaux")
      .then(response => setAnimaux(response.data))
      .catch(error => console.error("Erreur lors de la récupération des animaux :", error));
  }, []);

  return (
    <section>
      <h2>Nos Animaux</h2>
      <ul>
        {animaux.slice(0, 5).map(animal => (
          <li key={animal.animal_id}>
            <Link to={`/animaux/${animal.animal_id}`}>
              {animal.prenom} - {animal.nom}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default AnimalSection;
