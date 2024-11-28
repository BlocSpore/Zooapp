import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const HabitatPage = () => {
  const [habitats, setHabitats] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5001/api/habitats")
      .then((response) => setHabitats(response.data))
      .catch((error) => console.error("Erreur lors de la récupération des habitats :", error));
  }, []);

  return (
    <div>
      <h1>Habitats du Zoo Arcadia</h1>
      <div className="habitat-list">
        {habitats.map((habitat) => (
          <div key={habitat.habitat_id} className="habitat-card">
            <Link to={`/habitats/${habitat.habitat_id}`}>
              <img src={habitat.image} alt={habitat.nom} />
              <h3>{habitat.nom}</h3>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HabitatPage;
