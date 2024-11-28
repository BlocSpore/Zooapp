import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const HabitatDetailsPage = () => {
  const { id } = useParams(); // Récupère l'ID de l'habitat depuis l'URL
  const [habitat, setHabitat] = useState(null);
  const [animaux, setAnimaux] = useState([]);

  useEffect(() => {
    // Récupération des détails de l'habitat
    axios.get(`http://localhost:5001/api/habitats/${id}`)
      .then((response) => setHabitat(response.data))
      .catch((error) => console.error("Erreur lors de la récupération de l'habitat :", error));

    // Récupération des animaux associés à cet habitat
    axios.get(`http://localhost:5001/api/animaux?habitat_id=${id}`)
      .then((response) => setAnimaux(response.data))
      .catch((error) => console.error("Erreur lors de la récupération des animaux :", error));
  }, [id]);

  if (!habitat) {
    return <p>Chargement...</p>;
  }

  return (
    <div>
      <h1>{habitat.nom}</h1>
      <img src={habitat.image} alt={habitat.nom} />
      <p>{habitat.description}</p>

      <section>
        <h2>Animaux dans cet habitat</h2>
        <ul>
          {animaux.map((animal) => (
            <li key={animal.animal_id}>
              <Link to={`/animaux/${animal.animal_id}`}>{animal.prenom} - {animal.nom}</Link>
            </li>
          ))}
        </ul>
      </section>

      <Link to="/habitats">Retour à la liste des habitats</Link>
    </div>
  );
};

export default HabitatDetailsPage;
