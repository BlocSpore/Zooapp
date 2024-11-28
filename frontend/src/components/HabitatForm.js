import React, { useState, useEffect } from "react";
import axios from "axios";

const HabitatForm = ({ habitatToEdit, refreshHabitats }) => {
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (habitatToEdit) {
      setNom(habitatToEdit.nom);
      setDescription(habitatToEdit.description);
      setImage(habitatToEdit.image);
    }
  }, [habitatToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const habitatData = { nom, description, image };

    if (habitatToEdit) {
      // Modifier l'habitat existant
      axios.put(`http://localhost:5001/api/habitats/${habitatToEdit.habitat_id}`, habitatData)
        .then(() => {
          alert("Habitat modifié avec succès.");
          refreshHabitats();
        })
        .catch((error) => console.error("Erreur lors de la modification de l'habitat :", error));
    } else {
      // Ajouter un nouvel habitat
      axios.post("http://localhost:5001/api/habitats", habitatData)
        .then(() => {
          alert("Habitat ajouté avec succès.");
          refreshHabitats();
        })
        .catch((error) => console.error("Erreur lors de l'ajout de l'habitat :", error));
    }

    setNom("");
    setDescription("");
    setImage("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{habitatToEdit ? "Modifier Habitat" : "Ajouter un Habitat"}</h3>
      <input
        type="text"
        placeholder="Nom de l'habitat"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        required
      />
      <textarea
        placeholder="Description de l'habitat"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="URL de l'image"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        required
      />
      <button type="submit">{habitatToEdit ? "Modifier" : "Ajouter"}</button>
    </form>
  );
};

export default HabitatForm;
