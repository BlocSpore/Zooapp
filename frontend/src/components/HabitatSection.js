import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const HabitatSection = () => {
  const [habitats, setHabitats] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5001/api/habitats")
      .then(response => setHabitats(response.data))
      .catch(error => console.error("Erreur lors de la récupération des habitats :", error));
  }, []);

  return (
    <section>
      <h2>Nos Habitats</h2>
      <div className="habitat-list">
        {habitats.map(habitat => (
          <Link key={habitat.habitat_id} to={`/habitats/${habitat.habitat_id}`}>
            <div className="habitat-card">
              <img src={habitat.image} alt={habitat.nom} />
              <h3>{habitat.nom}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default HabitatSection;
