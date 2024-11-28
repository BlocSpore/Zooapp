import React, { useState, useEffect } from "react";
import axios from "axios";

const AnimalForm = ({ animalToEdit, refreshAnimals, habitats }) => {
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [race, setRace] = useState("");
  const [habitatId, setHabitatId] = useState("");

  useEffect(() => {
    if (animalToEdit) {
      setPrenom(animalToEdit.prenom);
      setNom(animalToEdit.nom);
      setRace(animalToEdit.race);
      setHabitatId(animalToEdit.habitat_id);
    }
  }, [animalToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const animalData = { prenom, nom, race, habitat_id: habitatId };

    if (animalToEdit) {
      // Modifier l'animal existant
      axios.put(`http://localhost:5001/api/animaux/${animalToEdit.animal_id}`, animalData)
        .then(() => {
          alert("Animal modifié avec succès.");
          refreshAnimals();
        })
        .catch((error) => console.error("Erreur lors de la modification de l'animal :", error));
    } else {
      // Ajouter un nouvel animal
      axios.post("http://localhost:5001/api/animaux", animalData)
        .then(() => {
          alert("Animal ajouté avec succès.");
          refreshAnimals();
        })
        .catch((error) => console.error("Erreur lors de l'ajout de l'animal :", error));
    }

    setPrenom("");
    setNom("");
    setRace("");
    setHabitatId("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{animalToEdit ? "Modifier Animal" : "Ajouter un Animal"}</h3>
      <input
        type="text"
        placeholder="Prénom de l'animal"
        value={prenom}
        onChange={(e) => setPrenom(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Nom de l'animal"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Race"
        value={race}
        onChange={(e) => setRace(e.target.value)}
        required
      />
      <select value={habitatId} onChange={(e) => setHabitatId(e.target.value)} required>
        <option value="" disabled>Choisir un habitat</option>
        {habitats.map((habitat) => (
          <option key={habitat.habitat_id} value={habitat.habitat_id}>
            {habitat.nom}
          </option>
        ))}
      </select>
      <button type="submit">{animalToEdit ? "Modifier" : "Ajouter"}</button>
    </form>
  );
};

export default AnimalForm;
